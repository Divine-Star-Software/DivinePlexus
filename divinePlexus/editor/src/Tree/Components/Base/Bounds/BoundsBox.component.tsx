import {
  CreateBox,
  InstancedMesh,
  Mesh,
  StandardMaterial,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { shortId } from "@divinestar/utils/Ids";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";
import { TreeNodeBase } from "Classes/Tree/TreeNodeBase";
import { TreeNodeComponentBase } from "Classes/Tree/TreeNodeComponentBase";
import { TreeNodeComponentData } from "Types/NodeComponentData.types";
import { ObjectSchemaData } from "Types/schemas";
import { TransformComponent } from "../Transform.component";
import { Vec3Array } from "@divinevoxel/core/Math";

export type BoundsBoxComponentData = TreeNodeComponentData<{
  size: Vec3Array;
}>;

export class BoundsBoxComponent extends TreeNodeComponentBase<BoundsBoxComponentData> {
  static Meta = {
    id: "bounds-box",
    icon: "box",
    name: "Bounds Box",
    category: "object-bounds",
    description: "Used to represent an object with a box.",
    flags: {},
    color: "#3d72d4",
  };

  static Material: StandardMaterial;
  static InstanceMesh: Mesh;

  static PropertiesComponent({ component }: { component: BoundsBoxComponent }) {
    const schema: ObjectSchemaData[] = [];

    schema.push({
      id: "size",
      name: "Size",
      input: {
        type: "vec3",
        valueType: "dimension",
        default: component.data.properties.size,
        onUpdate: (size) => {
          component.update({ size });
        },
      },
    });
    return (
      <>
        <SchemaEditor nodes={schema} />
      </>
    );
  }

  static CreateNew(
    overrides: Partial<BoundsBoxComponentData>
  ): BoundsBoxComponentData {
    return {
      id: shortId(),
      traits:[],
      properties: {
        size: [1, 1, 1],
      },
      componentType: BoundsBoxComponent.Meta.id,
      ...overrides,
    };
  }

  private _parent: TransformNode;
  private _mesh: InstancedMesh;

  constructor(data: BoundsBoxComponentData, node: TreeNodeBase) {
    super(data, node);
    if (!BoundsBoxComponent.InstanceMesh) {
      const scene = node.renderNodes.scene;
      BoundsBoxComponent.InstanceMesh = CreateBox("", { size: 1 }, scene);
      BoundsBoxComponent.Material = new StandardMaterial("", scene);
      BoundsBoxComponent.InstanceMesh.material = BoundsBoxComponent.Material;
      BoundsBoxComponent.InstanceMesh.setEnabled(false);

      BoundsBoxComponent.Material.alpha = 0.5;
      BoundsBoxComponent.Material.diffuseColor.set(0, 0, 1);
    }
    this._parent = new TransformNode("", this.node.renderNodes.scene);
  }

  calculateBounds() {
    const tranformComponent =
      this.node.getComponentByClass<TransformComponent>(
        TransformComponent
      );
    if (!tranformComponent)
      throw new Error(`Node must have tranform component`);
    const boxSize = new Vector3(1, 1, 1);
    // Define the initial corner points of the box
    let halfSize = boxSize.scale(0.5);
    let corners = [
      new Vector3(-halfSize.x, -halfSize.y, -halfSize.z),
      new Vector3(halfSize.x, -halfSize.y, -halfSize.z),
      new Vector3(-halfSize.x, halfSize.y, -halfSize.z),
      new Vector3(halfSize.x, halfSize.y, -halfSize.z),
      new Vector3(-halfSize.x, -halfSize.y, halfSize.z),
      new Vector3(halfSize.x, -halfSize.y, halfSize.z),
      new Vector3(-halfSize.x, halfSize.y, halfSize.z),
      new Vector3(halfSize.x, halfSize.y, halfSize.z),
    ];

    // Get the world matrix for the TransformNode
    let worldMatrix = this._parent.computeWorldMatrix(true);

    // Transform each corner point by the world matrix
    let transformedCorners = corners.map((corner) => {
      return Vector3.TransformCoordinates(corner, worldMatrix);
    });

    // Initialize min and max vectors
    let min = new Vector3(
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY
    );
    let max = new Vector3(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY
    );

    // Find the AABB by getting the min and max coordinates among the transformed corners
    transformedCorners.forEach((corner) => {
      min = Vector3.Minimize(min, corner);
      max = Vector3.Maximize(max, corner);
    });

    return { min: [min.x, min.y, min.z], max: [max.x, max.y, max.z] };
  }

  async init() {
    const tranformComponent =
      this.node.getComponentByClass<TransformComponent>(
        TransformComponent
      );
    if (!tranformComponent)
      throw new Error(`Node must have tranform component`);
    tranformComponent.pipelines.getBounds.regiser(this, (bounds) => {
      const currentBounds = this.calculateBounds();
      if (bounds.max[0] < currentBounds.max[0])
        bounds.max[0] = currentBounds.max[0];
      if (bounds.max[1] < currentBounds.max[1])
        bounds.max[1] = currentBounds.max[1];
      if (bounds.max[2] < currentBounds.max[2])
        bounds.max[2] = currentBounds.max[2];

      if (bounds.min[0] > currentBounds.min[0])
        bounds.min[0] = currentBounds.min[0];
      if (bounds.min[1] > currentBounds.min[1])
        bounds.min[1] = currentBounds.min[1];
      if (bounds.min[2] > currentBounds.min[2])
        bounds.min[2] = currentBounds.min[2];
      return bounds;
    });
    const visible = (visible: boolean) => {
      if (!visible) {
        this._mesh.dispose();
        return;
      }
      if (!this._mesh || this._mesh.isDisposed()) {
        this._mesh = BoundsBoxComponent.InstanceMesh.createInstance(shortId());
        this._mesh.setEnabled(true);
        this._mesh!.enableEdgesRendering();
        this._mesh.parent = this._parent;
        const pivoit = tranformComponent.getPivoitPoint();
        if (pivoit) this._parent.setPivotPoint(pivoit);
      }
      this._parent.scaling.set(...this.data.properties.size);
      tranformComponent.parent(this._parent);
    };
    if (this.node.isVisible()) visible(true);

    this.node.baseObservers.visible.subscribe(this, (isVisible) => {
      visible(isVisible);
    });

    this.baseObservers.disposed.subscribe(this, () => {
      tranformComponent.pipelines.getBounds.unRegister(this);
      this.node.baseObservers.visible.unsubscribe(this);
    });
  }

  update(data: BoundsBoxComponentData["properties"]): void {
    this.data.properties = {
      ...this.data.properties,
      ...data,
    };

    this._parent.scaling.set(...this.data.properties.size);
    const tranformComponent =
      this.node.getComponentByClass<TransformComponent>(
        TransformComponent
      )!;
    tranformComponent.observers.boundsUpdated.notify();
  }
  getClass() {
    return BoundsBoxComponent;
  }
  getMeta() {
    return BoundsBoxComponent.Meta;
  }


}
