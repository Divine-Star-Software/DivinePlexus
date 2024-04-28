import { shortId } from "@divinestar/utils/Ids";
import { TreeNodeComponentTraitBase } from "@divineplexus/editor/Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "@divineplexus/editor/Types/NodeComponentTraitData.types";
import { useState } from "react";
import { TraitComponent } from "@divineplexus/editor/Tree/Traits/TraitComponent";
import { VoxelPlaceFilterTrait } from "./VoxelPlaceFilter.trait";
import { VoxelPlaceFiltersPlexusTrait } from "@divineplexus/dvefcore/Base/Traits/Voxels/VoxelPlaceFilters.plexus.trait";
import { LogicComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/Logic.trait";
import { LogicImportsComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicImports";
import { LogicImportComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicImport";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { LogicArgumentComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicArgument";
import { LogicArgumentsComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicArguments";
import { Vec3ComponentTrait } from "@divineplexus/editor/Tree/Traits/Data/Math/Vec3.data.trait";
import { ObjectImportTrait } from "@divineplexus/editor/Tree/Traits/Objects/ObjectImport.trait";
import { LogicIOComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicIO";
import { LogicOutputComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicOutputs";

export type VoxelPlaceFiltersTraitData = TreeNodeComponentTraitData<{}>;

export class VoxelPlaceFiltersTrait extends TreeNodeComponentTraitBase<VoxelPlaceFiltersTraitData> {
  static Meta = {
    ...VoxelPlaceFiltersPlexusTrait.Meta,
    icon: "filter",
    description: "Defines a voxel place constraints.",
    flags: {},
    category: "voxels",
    color: "#893dd4",
  };

  static PropertiesComponent({ trait }: { trait: VoxelPlaceFiltersTrait }) {
    const [constraints, setContraints] = useState(trait.traits);
    trait.baseObservers.traitsUpdated.subscribe(trait, () =>
      setContraints([...trait.traits])
    );
    return (
      <>
        {constraints.map((_) => (
          <TraitComponent trait={_} key={_.id} />
        ))}
      </>
    );
  }

  static CreateNew(
    overrides: Partial<VoxelPlaceFiltersTraitData>
  ): VoxelPlaceFiltersTraitData {
    return {
      id: shortId(),
      properties: {},
      traits: [
        LogicComponentTrait.CreateNew({
          permanent: true,
          properties: {
            allowedTraits: [
              {
                dataType: DataTypes.Boolean,
                traitType: VoxelPlaceFilterTrait.Meta.id,
              },
              ...LogicComponentTrait.GetBaseDataTypeTraits().primitives,
              ...LogicComponentTrait.GetBaseDataTypeTraits().objects,
            ],
            graph: {
              transform: {
                zoom: 1,
                panX: 0,
                panY: 0,
              },
              nodes: [],
              edges: [],
            },
          },
          traits: [
            LogicIOComponentTrait.CreateNew({
              traits: [
                LogicArgumentsComponentTrait.CreateNew({
                  permanent: true,
                  locked: true,
                  traits: [
                    LogicArgumentComponentTrait.CreateNew({
                      permanent: true,
                      locked: true,
                      properties: {
                        name: "voxelPosition",
                        dataType: DataTypes.Vector,
                        genericTypes: [Vec3ComponentTrait.Meta.id],
                      },
                      traits: [
                        Vec3ComponentTrait.CreateNew({
                          permanent: true,
                          locked: true,
                        }),
                      ],
                    }),
                  ],
                }),
                LogicImportsComponentTrait.CreateNew({
                  permanent: true,
                  locked: true,
                  traits: [
                    LogicImportComponentTrait.CreateNew({
                      permanent: true,
                      locked: true,
                      properties: {
                        name: "voxelDataTool",
                        importId: "voxelDataTool",
                        dataType: DataTypes.Object,
                      },
                      traits: [
                        ObjectImportTrait.CreateNew({
                          properties: {
                            objectId: "voxelDataTool",
                            objectName: "Voxel Data Tool",
                          },
                        }),
                      ],
                    }),
                  ],
                }),
                LogicOutputComponentTrait.CreateNew({
                  permanent: true,
                  locked: true,
                  properties: {
                    expectedDataType: DataTypes.Boolean,
                  },
                }),
              ],
            }),
          ],
        }),
      ],
      traitType: VoxelPlaceFiltersTrait.Meta.id,
      ...overrides,
    };
  }

  async init() {
    console.log("INIT VOXLE PLACE FILTERS");
  }

  getClass() {
    return VoxelPlaceFiltersTrait;
  }

  getMeta() {
    return VoxelPlaceFiltersTrait.Meta;
  }
}
