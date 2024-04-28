import { Mesh, StandardMaterial } from "@babylonjs/core";
import { shortId } from "@divinestar/utils/Ids";
import { AsyncPipeline } from "@divinestar/utils/Pipelines";
import { PlexusBulderVoxelPaintData } from "@divineplexus/dvefcore/Types/Rooms";
import { TreeNodeComponentBase } from "@divineplexus/editor/Classes/Tree/TreeNodeComponentBase";
import { TreeNodeComponentData } from "@divineplexus/editor/Types/NodeComponentData.types";
import { VoxelRandomFillPlexusComponent } from "@divineplexus/dvefcore/Base/Components/Voxels/Fill/VoxelRandomFill.plexus.component";
import { PlexusNodeData } from "@divineplexus/core/Types/PlexusNode.types";
import { ObjectSchemaData } from "@divineplexus/editor/Types/schemas";
import { useComponentTrait } from "@divineplexus/editor/Tree/Hooks/useComponentTrait";
import { RandomnNumberTrait } from "@divineplexus/editor/Tree/Traits/Randomness/RandomNumber.trait";
import { WeightedRandomComponentTrait } from "@divineplexus/editor/Tree/Traits/Randomness/WeightedRandom.trait";
import { Pane } from "@divineplexus/editor/Components/Pane/Pane";
import { VoxelPlaceFiltersTrait } from "../../Traits/Voxels/VoxelPlaceFilters.trait";
import { VoxelPlaceActionsTrait } from "../../Traits/Voxels/VoxelPlaceAction.trait";

type VoxelWeights = {
  voxel: PlexusBulderVoxelPaintData;
  weight: number;
}[];
export type VoxelRandomFillComponentData = TreeNodeComponentData<{
  randomThreshold: number;
  voxels: VoxelWeights;
  placeVoxels: PlexusBulderVoxelPaintData[];
}>;

export class VoxelRandomFill extends TreeNodeComponentBase<VoxelRandomFillComponentData> {
  static Meta = {
    ...VoxelRandomFillPlexusComponent.Meta,
    icon: "paint_fill",
    description: "Fill an area with voxels.",
    flags: {},
    category: "voxels",
    color: "#893dd4",
  };

  static Material: StandardMaterial;
  static InstanceMesh: Mesh;

  pipelines = {
    createBuildData: new AsyncPipeline<PlexusNodeData>(),
  };

  static PropertiesComponent({ component }: { component: VoxelRandomFill }) {
    const schema: ObjectSchemaData[] = [];

    const [
      VoxelPlaceFiltersTraitComponent,
      RandomnNumberTraitComponent,
      WeightedRandomComponentTraitComponent,
    ] = useComponentTrait({
      traits: [
        component.getTraitByClass(VoxelPlaceFiltersTrait)!,
        component.getTraitByClass(RandomnNumberTrait)!,
        component.getTraitByClass(WeightedRandomComponentTrait)!,
      ]!,
    });

    return (
      <>
        <VoxelPlaceFiltersTraitComponent />
        <Pane titleComponent={<p>Place Actions</p>}>
          <RandomnNumberTraitComponent />
          <WeightedRandomComponentTraitComponent />
        </Pane>
      </>
    );
  }

  static CreateNew(
    overrides: Partial<VoxelRandomFillComponentData>
  ): VoxelRandomFillComponentData {
    return {
      id: shortId(),
      traits: [
        VoxelPlaceFiltersTrait.CreateNew({
          permanent: true,
        }),
        RandomnNumberTrait.CreateNew({
          permanent: true,
          title: "Weighted Random Number",
        }),
        WeightedRandomComponentTrait.CreateNew({
          permanent: true,
          properties: {
            weights: [],
            allowedTraits: [VoxelPlaceActionsTrait.Meta.id],
          },
        }),
      ],
      properties: {
        randomThreshold: 0.8,
        placeVoxels: [
          {
            id: "dve_air",
            level: 0,
            levelState: 0,
            state: 0,
            shapeState: 0,
          },
        ],
        voxels: [],
      },
      componentType: VoxelRandomFill.Meta.id,

      ...overrides,
    };
  }

  async init() {
    console.log("INIT VOXEL FILL COMPONENT");
  }

  update(data: Partial<VoxelRandomFillComponentData["properties"]>): void {
    this.data.properties = {
      ...this.data.properties,
      ...data,
    };
  }
  getClass() {
    return VoxelRandomFill;
  }
  getMeta() {
    return VoxelRandomFill.Meta;
  }
}
