import { Distance3D, Vec3Array } from "@divinevoxel/core/Math";
import { PlexusNodeBuilder } from "../PlexusNodeBuilder";
import {
  PlexusBuilderVoxelPathData,
  PlexusBuilderVoxelPathSegmentData,
} from "Types/Rooms";
import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector";

const getRight2DVector = (normal: Vector3) => {
  normal = normal.clone();
  if (normal.z == 0) normal.z = Number.EPSILON;

  const abs = Math.abs;
  const b0 = abs(normal.x) < abs(normal.y) && abs(normal.x) < abs(normal.z);
  const b1 = abs(normal.y) <= abs(normal.x) && abs(normal.y) < abs(normal.z);
  const b2 = abs(normal.z) <= abs(normal.x) && abs(normal.z) <= abs(normal.y);
  const dir = Vector3.Cross(
    normal,
    new Vector3(Number(b0), Number(b1), Number(b2))
  );
  if (abs(dir.x) == Number.EPSILON) dir.x = 0;
  if (abs(dir.y) == Number.EPSILON) dir.y = 0;
  if (abs(dir.z) == Number.EPSILON) dir.z = 0;
  return dir;
};

const getTriangleNormal = (p1: Vector3, p2: Vector3, p3: Vector3) => {
  const a = new Vector3(p1.x, p1.y, p1.z);
  const b = new Vector3(p2.x, p2.y, p2.z);
  const c = new Vector3(p3.x, p3.y, p3.z);

  const substract = Vector3.Cross(b.subtract(a), c.subtract(a));
  const normal = new Vector3(substract.x, substract.y, substract.z).scale(-1);
  return normal.normalize();
};

const getRightVectorFromLine = (p1: Vector3, p2: Vector3) => {
  const p3 = new Vector3();
  if (p1.y < p2.y) {
    p3.set(p1.x, p2.y, p1.z);
    return getTriangleNormal(p3, p2, p1);
  }
  if (p1.y > p2.y) {
    p3.set(p2.x, p1.y, p2.z);
    return getTriangleNormal(p3, p2, p1).scale(-1);
  }
  return getTriangleNormal(p3, p2, p1);
};
const getUpVector = (forward: Vector3, right: Vector3) => {
  forward = forward.clone();
  const p1 = new Vector3(0, 0, 0);
  const p2 = forward;
  const p3 = right;
  return getTriangleNormal(p1, p2, p3);
};
const TraverseVoxels = (
  point1: Vec3Array,
  point2: Vec3Array,
  run: (
    x: number,
    y: number,
    z: number,
    data: { forward: Vector3; up: Vector3; right: Vector3 }
  ) => void
) => {
  const vector1 = new Vector3(...point1);
  const vector2 = new Vector3(...point2);
  const forward = vector2.subtract(vector1).normalize();
  const up = new Vector3();
  const right = new Vector3();
  {
    //check if the line is straight
    if (
      vector1.y == vector2.y ||
      (vector1.x == vector2.x && vector1.z == vector2.z)
    ) {
      right.copyFrom(getRight2DVector(forward));
      up.copyFrom(getUpVector(forward, right));
    } else {
      right.copyFrom(getRightVectorFromLine(vector1, vector2));
      up.copyFrom(getUpVector(forward, right));
    }
  }

  const sx = vector1.x;
  const sy = vector1.y;
  const sz = vector1.z;
  const ex = vector2.x;
  const ey = vector2.y;
  const ez = vector2.z;
  const maxDistance = Distance3D(sx, sy, sz, ex, ey, ez);

  if (Math.abs(maxDistance) < 1) return;

  let cx = sx;
  let cy = sy;
  let cz = sz;

  while (true) {
    run(Math.floor(cx), Math.floor(cy), Math.floor(cz), {
      forward,
      right,
      up,
    });
    cx += forward.x;
    cy += forward.y;
    cz += forward.z;
    const distance = Distance3D(cx, cy, cz, sx, sy, sz);
    if (distance > maxDistance) break;
  }
};

export class PlexusVoxelPathBuilder {
  constructor(public builder: PlexusNodeBuilder) {}

  build(data: PlexusBuilderVoxelPathData) {
    if (data.segments.length < 2) return;
    this.builder.mapBrush(data.voxel);
    const brush = this.builder.brush;
    let lastPoint = [...data.segments[0].point];
    for (let i = 0; i < data.segments.length - 1; i++) {
      const seg1 = data.segments[i];
      const seg2 = data.segments[i + 1];

      TraverseVoxels(seg1.point, seg2.point, (x, y, z, directions) => {
        brush.setXYZ(x, y, z).paint();
        this.extrude([x, y, z], directions, seg1);
      });
    }
  }

  extrude(
    [px, py, pz]: Vec3Array,
    {
      forward,
      right,
      up,
    }: {
      forward: Vector3;
      right: Vector3;
      up: Vector3;
    },
    segmet: PlexusBuilderVoxelPathSegmentData
  ) {
    let left = right.scale(-1);
    let down = right.scale(-1);

    if (segmet.pathType.type == "default") return;
    if (segmet.pathType.extrude.type == "world") {
      up = new Vector3(0, 1, 0);
      down = new Vector3(0, -1, 0);

      if (segmet.pathType.extrude.mode == "XY") {
        right = new Vector3(1, 0, 0);
        left = new Vector3(-1, 0, 0);
      }
      if (segmet.pathType.extrude.mode == "ZY") {
        right = new Vector3(0, 0, 1);
        left = new Vector3(0, 0, -1);
      }
    }
    if (segmet.pathType.extrude.type == "custom") {
      const data = segmet.pathType.extrude;
      up = new Vector3(...data.up);
      right = new Vector3(...data.right);
      left = new Vector3(...data.left);
      down = new Vector3(...data.down);
    }
    const brush = this.builder.brush;

    if (segmet.pathType.type == "square-extrude") {
      const [dimPX, dimNX, dimPY, dimNY] = segmet.pathType.bounds;

      const points = [
        new Vector3(
          (left.x * dimNX + down.x * dimNY + px) >> 0,
          (left.y * dimNX + down.y * dimNY + py) >> 0,
          (left.z * dimNX + down.z * dimNY + pz) >> 0
        ),
        new Vector3(
          (right.x * dimPX + down.x * dimNY + px) >> 0,
          (right.y * dimPX + down.y * dimNY + py) >> 0,
          (right.z * dimPX + down.z * dimNY + pz) >> 0
        ),
        new Vector3(
          (left.x * dimNX + up.x * dimPY + px) >> 0,
          (left.y * dimNX + up.y * dimPY + py) >> 0,
          (left.z * dimNX + up.z * dimPY + pz) >> 0
        ),
        new Vector3(
          (right.x * dimPX + up.x * dimPY + px) >> 0,
          (right.y * dimPX + up.y * dimPY + py) >> 0,
          (right.z * dimPX + up.z * dimPY + pz) >> 0
        ),
      ];

      const {
        min: [sx, sy, sz],
        max: [ex, ey, ez],
      } = this.getBounds(points);

      for (let z = sz; z < ez + 1; z++) {
        for (let x = sx; x < ex + 1; x++) {
          for (let y = sy; y < ey + 1; y++) {
            brush.setXYZ(x, y, z).paint();
          }
        }
      }
    }
  }

  getBounds(vector3: Vector3[]) {
    const min: Vec3Array = [Infinity, Infinity, Infinity];
    const max: Vec3Array = [-Infinity, -Infinity, -Infinity];
    console.log(vector3.map((_) => _.toString()).join("  "));
    for (const child of vector3) {
      if (child.x > max[0]) max[0] = child.x;
      if (child.y > max[1]) max[1] = child.y;
      if (child.z > max[2]) max[2] = child.z;

      if (child.x < min[0]) min[0] = child.x;
      if (child.y < min[1]) min[1] = child.y;
      if (child.z < min[2]) min[2] = child.z;
    }
    return {
      min,
      max,
    };
  }
}
