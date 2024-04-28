import { shortId } from "@divinestar/utils/Ids";
import { TreeNodeComponentTraitBase } from "@divineplexus/editor/Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "@divineplexus/editor/Types/NodeComponentTraitData.types";
import { useState } from "react";
import { TraitComponent } from "@divineplexus/editor/Tree/Traits/TraitComponent";
import { RandomnNumberTrait } from "@divineplexus/editor/Tree/Traits/Randomness/RandomNumber.trait";
import { ArrayComponentTrait } from "@divineplexus/editor/Tree/Traits/Data/Types/Array.trait";
import {
  VoxelPlaceFilterPlexusTrait,
  VoxelPlaceFilterTypes,
} from "@divineplexus/dvefcore/Base/Traits/Voxels/VoxelPlaceFilter.plexus.trait";
import { ObjectToolBar } from "@divineplexus/editor/Components/ToolBar/ObjectToolBar";
import { DropDownMenu } from "@divineplexus/editor/Components/DropDownMenu/DropDownMenu";
import { LogicComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/Logic.trait";
import { LogicImportsComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicImports";
import { LogicImportComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicImport";
import { DataTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/DataTrait.trait.interface";
import { Vec3ComponentTrait } from "@divineplexus/editor/Tree/Traits/Data/Math/Vec3.data.trait";
import { VoxelComponentTrait } from "./Data/Voxel.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { LogicArgumentsComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicArguments";
import { LogicArgumentComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicArgument";
import { LogicFunctionCallComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/LogicFunctionCall.trait";
import { LogicErrorCheck } from "@divineplexus/editor/Tree/Traits/Logic/Interfaces/LogicErrorCheck";
import { LogicComponentInterface } from "@divineplexus/editor/Tree/Traits/Logic/Interfaces/LogicComponent.interface";
import { DataTypeIndicator } from "@divineplexus/editor/Tree/Traits/Data/Components/DataTypeIndicator";
import { LogicIOComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicIO";
import { LogicOutputComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicOutputs";

export type VoxelPlaceFilterTraitData = TreeNodeComponentTraitData<{
  constraintType: string;
}>;

export class VoxelPlaceFilterTrait
  extends TreeNodeComponentTraitBase<VoxelPlaceFilterTraitData>
  implements DataTraitInterface, LogicComponentInterface
{
  static Meta = {
    ...VoxelPlaceFilterPlexusTrait.Meta,
    icon: "filter",
    description: "Defines a voxel place constraint.",
    flags: {},
    category: "voxels",
    color: "#893dd4",
  };
  static PlaceFilters: Record<string, () => TreeNodeComponentTraitData[]> = {
    [VoxelPlaceFilterTypes.RandomNumberFilter]: () => [
      LogicFunctionCallComponentTrait.CreateNew({
        permanent: true,
        locked: true,
        traits: [
          LogicComponentTrait.CreateNew({
            permanent: true,
            properties: {
              allowedTraits: [
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
                permanent: true,
                locked: true,
                traits: [
                  LogicArgumentsComponentTrait.CreateNew({
                    permanent: true,
                    locked: true,
                    traits: [],
                  }),
                  LogicImportsComponentTrait.CreateNew({
                    permanent: true,
                    locked: true,
                    traits: [
                      LogicImportComponentTrait.CreateNew({
                        permanent: true,
                        locked: true,
                        properties: {
                          name: "randomValue",
                          importId: "randomValue",
                          dataType: DataTypes.Number,
                        },
                        traits: [
                          RandomnNumberTrait.CreateNew({
                            permanent: true,
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
      }),
    ],

    [VoxelPlaceFilterTypes.PositionFilter]: () => [
      LogicFunctionCallComponentTrait.CreateNew({
        permanent: true,
        locked: true,
        traits: [
          LogicComponentTrait.CreateNew({
            permanent: true,
            traits: [
              LogicIOComponentTrait.CreateNew({
                permanent: true,
                locked: true,
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
                    traits: [],
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
      }),
    ],

    [VoxelPlaceFilterTypes.PlacedOnFilter]: () => [
      ArrayComponentTrait.CreateNew({
        permanent: true,
        title: "Check Directions",
        properties: {
          value: [],
          allowedTraits: [Vec3ComponentTrait.Meta.id],
        },
      }),
      ArrayComponentTrait.CreateNew({
        permanent: true,
        title: "Voxels",
        properties: {
          value: [],
          allowedTraits: [VoxelComponentTrait.Meta.id],
        },
      }),
    ],
  };
  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.Boolean}
        traitType={DataTypes.Boolean}
      />
    );
  }
  static PropertiesComponent({ trait }: { trait: VoxelPlaceFilterTrait }) {
    const [traits, setTraits] = useState(trait.traits);
    trait.baseObservers.traitsUpdated.subscribe(
      VoxelPlaceFilterTrait.PropertiesComponent,
      () => {
        setTraits([...trait.traits]);
      }
    );

    const [title, setTitle] = useState(trait.data.properties.constraintType);
    return (
      <>
        <ObjectToolBar
          titleComponent={
            <>
              <DropDownMenu
                direction="horizontal"
                rootWindow={trait.getParentWindow()}
                items={[
                  {
                    icon: "trait",
                    children: [
                      ...Object.keys(VoxelPlaceFilterTrait.PlaceFilters).map(
                        (key) => {
                          return {
                            name: key,
                            action: () => {
                              trait.update({
                                constraintType: key,
                              });
                              trait.setFilter(key);
                              setTitle(key);
                            },
                          };
                        }
                      ),
                    ],
                  },
                ]}
              />
              <p>{title}</p>
            </>
          }
        />
        {traits.map((_) => (
          <TraitComponent trait={_} key={_.id} />
        ))}
      </>
    );
  }

  static CreateNew(
    overrides: Partial<VoxelPlaceFilterTraitData>
  ): VoxelPlaceFilterTraitData {
    return {
      id: shortId(),

      properties: {
        constraintType: VoxelPlaceFilterTypes.RandomNumberFilter,
      },
      traits: [],

      traitType: VoxelPlaceFilterTrait.Meta.id,
      ...overrides,
    };
  }
  logicParent: LogicComponentTrait;
  logicErrorCheck: LogicErrorCheck;
  constructor(data: VoxelPlaceFilterTraitData, parent: any) {
    super(data, parent);
    for (const trait of this.traverseTraits("up")) {
      if (trait instanceof LogicComponentTrait) {
        this.logicParent = trait;
        break;
      }
    }
    this.logicErrorCheck = new LogicErrorCheck(this);
  }

  setFilter(type: string) {
    const filters = VoxelPlaceFilterTrait.PlaceFilters[type]();
    this.removeAllTraits();
    this.addTraits(filters);
    this.initTraits();
  }
  async init() {
    if (!this.traits.length) {
      this.setFilter(this.data.properties.constraintType);
    }
  }

  dataType = DataTypes.Boolean;
  isPrimitive = true;
  getValue(...args: any): boolean {
    return true;
  }

  getClass() {
    return VoxelPlaceFilterTrait;
  }

  getMeta() {
    return VoxelPlaceFilterTrait.Meta;
  }
}
