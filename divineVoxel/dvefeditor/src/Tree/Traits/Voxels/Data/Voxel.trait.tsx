import { shortId } from "@divinestar/utils/Ids";
import { PlexusBulderVoxelPaintData } from "@divineplexus/dvefcore/Types/Rooms";
import { Button } from "@divineplexus/editor/Components/Button";
import { SchemaEditor } from "@divineplexus/editor/Components/Schemas/SchemaEditor";

import { VoxelDisplay, VoxelDisplayData } from "Voxels/Components/VoxelDisplay";
import { useVoxelDisplay } from "Voxels/Hooks/useVoxelDisplay";

import { VoxelSelectList } from "Voxels/Select/VoxelSelectList";
import { useEffect, useState } from "react";

import { VoxelPlexusTrait } from "@divineplexus/dvefcore/Base/Traits/Voxels/Data/Voxel.plexus.trait";
import { useWindow } from "@divineplexus/editor/Hooks/Windows/useWindow";
import { ObjectComponentTrait } from "@divineplexus/editor/Tree/Traits/Data/Types/Object.trait";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { DataTypeIndicator } from "@divineplexus/editor/Tree/Traits/Data/Components/DataTypeIndicator";

export function VoxelPaintSelect(props: {
  voxel: PlexusBulderVoxelPaintData;

  onUpdate: (data: PlexusBulderVoxelPaintData) => void;
}) {
  const [getVoxelDisplay] = useVoxelDisplay();
  const [voxel, setVoxel] = useState<VoxelDisplayData | null>(null);
  const [openWindow, actions] = useWindow({
    title: "voxel select",
  });

  useEffect(() => {
    (async () => {
      if (props.voxel.id) {
        setVoxel((await getVoxelDisplay({ voxelId: props.voxel.id }))!);
      }
    })();
  }, []);
  return (
    <div className="voxel-paint-select">
      {!voxel && <p>No Voxel Selected</p>}
      {voxel && <VoxelDisplay data={voxel} />}
      <Button
        onClick={() => {
          openWindow(
            <VoxelSelectList
              onSelected={(_) => {
                if (!_) return;
                actions.close();
                setVoxel(_);
                props.voxel.id = _.data.id;
                props.onUpdate(props.voxel);
              }}
            />
          );
        }}
      >
        Select
      </Button>
      <SchemaEditor
        nodes={[
          {
            id: "state",
            name: "State",
            input: {
              type: "int",
              min: 0,
              max: Infinity,
              default: 0,
              onUpdate: (value:number) => {
                props.voxel.level = value;
              },
            },
          },
          {
            id: "level",
            name: "Level",
            input: {
              type: "int",
              min: 0,
              max: 15,
              default: 0,
              onUpdate: (value:number) => {
                props.voxel.level = value;
              },
            },
          },
          {
            id: "levelState",
            name: "Level State",
            input: {
              type: "int",
              min: 0,
              max: 15,
              default: 0,
              onUpdate: (value:number) => {
                props.voxel.levelState = value;
              },
            },
          },
          {
            id: "shapeState",
            name: "Shape State",
            input: {
              type: "int",
              min: 0,
              max: 15,
              default: 0,
              onUpdate: (value:number) => {
                props.voxel.shapeState = value;
              },
            },
          },
        ]}
      />
    </div>
  );
}

export class VoxelComponentTrait extends ObjectComponentTrait<PlexusBulderVoxelPaintData> {
  static Meta = {
    ...VoxelPlexusTrait.Meta,
    icon: "square",
    description: "Define a voxel",
    flags: {},
    category: "voxels",
    color: "#893dd4",
  };

  static PropertiesComponent({ trait }: { trait: VoxelComponentTrait }) {
 
    return (
      <>
        <VoxelPaintSelect
          voxel={trait.data.properties.value}
          onUpdate={(_) => {
            trait.data.properties.value = {
              ...trait.data.properties.value,
              ..._,
            };
          }}
        />
      </>
    );
  }
  static RightSidebarComponent() {
    return (
      <DataTypeIndicator
        dataType={DataTypes.Object}
        traitType={VoxelPlexusTrait.Meta.id}
      />
    );
  }
  static CreateNew(
    overrides: Partial<VoxelComponentTrait["data"]>
  ): VoxelComponentTrait["data"] {
    return {
      id: shortId(),
      properties: {
        value: {
          id: "dve_air",
          level: 0,
          levelState: 0,
          shapeState: 0,
          state: 0,
        },
      },
      traits: [],
      traitType: VoxelComponentTrait.Meta.id,
      ...overrides,
    };
  }


  async init() {}

  getClass() {
    return VoxelComponentTrait;
  }

  getMeta() {
    return VoxelComponentTrait.Meta;
  }
}
