import { shortId } from "@divinestar/utils/Ids";
import { TreeNodeComponentTraitBase } from "@divineplexus/editor/Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "@divineplexus/editor/Types/NodeComponentTraitData.types";

import { useState } from "react";
import { VoxelPlaceActions } from "@divineplexus/dvefcore/Base/Traits/Voxels/PlaceActions/VoxelPlaceAction.types";
import {
  VoxelPlaceActionPlexusTrait,
  VoxelPlaceActionPlexusTraitData,
} from "@divineplexus/dvefcore/Base/Traits/Voxels/PlaceActions/VoxelPlaceAction.plexus.trait";
import { ObjectToolBar } from "@divineplexus/editor/Components/ToolBar/ObjectToolBar";
import { DropDownMenu } from "@divineplexus/editor/Components/DropDownMenu/DropDownMenu";
import { TraitComponent } from "@divineplexus/editor/Tree/Traits/TraitComponent";
import { VoxelComponentTrait } from "./Data/Voxel.trait";

export type VoxelPlaceActionsTraitData = TreeNodeComponentTraitData<
  VoxelPlaceActionPlexusTraitData["properties"]
>;

export class VoxelPlaceActionsTrait extends TreeNodeComponentTraitBase<VoxelPlaceActionsTraitData> {
  static Meta = {
    ...VoxelPlaceActionPlexusTrait.Meta,
    icon: "action",
    description: "Defines a voxel place constraints.",
    flags: {},
    category: "voxels",
    color: "#893dd4",
  };

  static PlaceActins: Record<string, () => TreeNodeComponentTraitData[]> = {
    [VoxelPlaceActions.PlaceVoxel]: () => [
      VoxelComponentTrait.CreateNew({
        permanent: true,
      }),
    ],

    [VoxelPlaceActions.PlaceAndExtrude]: () => [
      VoxelComponentTrait.CreateNew({
        permanent: true,
      }),
    ],
  };

  static PropertiesComponent({ trait }: { trait: VoxelPlaceActionsTrait }) {
    const [traits, setTraits] = useState(trait.traits);
    trait.baseObservers.traitsUpdated.subscribe(this, () => {
      setTraits([...trait.traits]);
    });
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
                      ...Object.keys(VoxelPlaceActionsTrait.PlaceActins).map(
                        (key) => {
                          return {
                            name: key,
                            action: async () => {
                              trait.data.properties.type = key;
                              trait.removeAllTraits();
                              VoxelPlaceActionsTrait.PlaceActins[key]().forEach(
                                (_) => trait.addTrait(_)
                              );
                            },
                          };
                        }
                      ),
                    ],
                  },
                ]}
              />
              <p>Actions</p>
            </>
          }
        />
        {traits.map((_, index) => (
          <div key={`${_.id}-${index}`}>
            <TraitComponent trait={_} />
          </div>
        ))}
      </>
    );
  }

  static CreateNew(
    overrides: Partial<VoxelPlaceActionsTraitData>
  ): VoxelPlaceActionsTraitData {
    return {
      id: shortId(),
      properties: {
        type: "",
        data: {} as any,
      },
      traits: [],
      traitType: VoxelPlaceActionsTrait.Meta.id,
      ...overrides,
    };
  }

  async init() {}

  getClass() {
    return VoxelPlaceActionsTrait;
  }

  getMeta() {
    return VoxelPlaceActionsTrait.Meta;
  }
}
