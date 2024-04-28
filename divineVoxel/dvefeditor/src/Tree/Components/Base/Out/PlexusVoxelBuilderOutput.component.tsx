import { Mesh, StandardMaterial } from "@babylonjs/core";
import { shortId } from "@divinestar/utils/Ids";
import { AsyncPipeline } from "@divinestar/utils/Pipelines";
import { PlexusBuilderData } from "@divineplexus/dvefcore/Types/Rooms";
import {
  PlexusComponentData,
  PlexusComponentTraitData,
  PlexusNodeData,
} from "@divineplexus/core/Types/PlexusNode.types";
import { SchemaEditor } from "@divineplexus/editor/Components/Schemas/SchemaEditor";
import { TreeNodeBase } from "@divineplexus/editor/Classes/Tree/TreeNodeBase";
import { TreeNodeComponentBase } from "@divineplexus/editor/Classes/Tree/TreeNodeComponentBase";
import { TreeNodeComponentTraitBase } from "@divineplexus/editor/Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentData } from "@divineplexus/editor/Types/NodeComponentData.types";
import { ObjectSchemaData } from "@divineplexus/editor/Types/schemas";

export type PlexusVoxelBuilderOutputComponentData = TreeNodeComponentData<{}>;
enum MetaFlags {
  IncludeInOutput = "#plexus-voxel-builder-output-component-include-in-output",
}
export class PlexusVoxelBuilderOutputComponent extends TreeNodeComponentBase<PlexusVoxelBuilderOutputComponentData> {
  static MetaFlags = MetaFlags;
  static Meta = {
    id: "plexus-voxel-builder-output",
    icon: "node_tree",
    name: "Plexus Voxel Builder Output",
    description: "Handles the output of a node to plexus voxel builder data.",

    category: "output",
    flags: {},
    color: "#00fbff",
  };

  static Material: StandardMaterial;
  static InstanceMesh: Mesh;
  static NodeToPlexusData(node: TreeNodeBase) {
    let data: PlexusNodeData<any> = {
      nodeType: node.getMeta().id,
      properties: JSON.parse(JSON.stringify(node.data.properties)),
      components: node.components.map((_) =>
        PlexusVoxelBuilderOutputComponent.ComponentToPlexusData(_)
      ),
    };
    return data;
  }
  static ComponentToPlexusData(component: TreeNodeComponentBase) {
    let data: PlexusComponentData<any> = {
      componentType: component.getMeta().id,
      properties: JSON.parse(JSON.stringify(component.data.properties)),
      traits: component.traits.map((_) =>
        PlexusVoxelBuilderOutputComponent.TraitToPlexusData(_)
      ),
    };
    return data;
  }
  static TraitToPlexusData(trait: TreeNodeComponentTraitBase) {
    let data: PlexusComponentTraitData<any> = {
      traitType: trait.getMeta().id,
      properties: JSON.parse(JSON.stringify(trait.data.properties)),
      traits: trait.traits.map((_) =>
        PlexusVoxelBuilderOutputComponent.TraitToPlexusData(_)
      ),
    };
    return data;
  }

  pipelines = {
    createBuildData: new AsyncPipeline<PlexusNodeData>(),
  };

  static PropertiesComponent({
    component,
  }: {
    component: PlexusVoxelBuilderOutputComponent;
  }) {
    const schema: ObjectSchemaData[] = [];
    return (
      <>
        <SchemaEditor nodes={schema} />
      </>
    );
  }

  static CreateNew(
    overrides: Partial<PlexusVoxelBuilderOutputComponentData>
  ): PlexusVoxelBuilderOutputComponentData {
    return {
      id: shortId(),
      traits: [],
      properties: {},
      componentType: PlexusVoxelBuilderOutputComponent.Meta.id,
      ...overrides,
    };
  }

  async init() {}

  async addToData(data: PlexusBuilderData) {
    console.log(
      "BEFORE DATA",
      PlexusVoxelBuilderOutputComponent.NodeToPlexusData(this.node),
      this.node.toJSON()
    );
     this.pipelines.createBuildData.regiser
    data.nodes.push(
      await this.pipelines.createBuildData.pipe(
        PlexusVoxelBuilderOutputComponent.NodeToPlexusData(this.node)
      )
    );
    return data;
  }

  update(
    data: Partial<PlexusVoxelBuilderOutputComponentData["properties"]>
  ): void {
    this.data.properties = {
      ...this.data.properties,
      ...data,
    };
  }

  getClass() {
    return PlexusVoxelBuilderOutputComponent;
  }
  getMeta() {
    return PlexusVoxelBuilderOutputComponent.Meta;
  }
}
