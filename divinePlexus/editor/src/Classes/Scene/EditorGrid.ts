import { Mesh, StandardMaterial, Texture, VertexBuffer } from "@babylonjs/core";
import { RenderNodes } from "./RenderNodes";
export class EditorGrid {
  _mesh: Mesh;
  _texture: Texture;
  _material: StandardMaterial;
  constructor(public nodes: RenderNodes) {
    this._texture = new Texture("assets/grid.png", nodes.scene);
    this._material = new StandardMaterial("", nodes.scene);
    this._material.diffuseTexture = this._texture;
  }

  build(meterSize = [256, 256]) {
    if (this._mesh) this._mesh.dispose();

    const positions: number[] = [
      //1
      0,
      0,
      0,
      //2
      meterSize[0],
      0,
      0,
      //3
      meterSize[0],
      0,
      meterSize[1],
      //3
      0,
      0,
      meterSize[1],
    ];
    const normals: number[] = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
    const indicies: number[] = [0, 1, 2, 2, 3, 0];
    const uvs: number[] = [
      //1
      0,
      0,
      //2
      0,
      1 * meterSize[1],
      //3
      1 * meterSize[0],
      1 * meterSize[1],
      //4
      1 * meterSize[0],
      0,
    ];

    const newMesh = new Mesh("", this.nodes.scene);

    newMesh.setVerticesData(VertexBuffer.PositionKind, positions);
    newMesh.setVerticesData(VertexBuffer.NormalKind, normals);
    newMesh.setVerticesData(VertexBuffer.UVKind, uvs);
    newMesh.setIndices(indicies);
    newMesh.hasVertexAlpha = false;
    this._mesh = newMesh;
    this._mesh.material = this._material;
    // this._material.wireframe = true;
    this._mesh.position.x -= meterSize[0] / 2;
    this._mesh.position.z -= meterSize[1] / 2;
  }
  private _active = true;
  setActive(active: boolean) {
    this._mesh.setEnabled(active);
    this._active = active;
  }
  isActive() {
    return this._active;
  }
}
