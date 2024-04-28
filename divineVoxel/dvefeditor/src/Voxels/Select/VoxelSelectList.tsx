import { useEffect, useState } from "react";
import { VoxelDisplay, VoxelDisplayData } from "../Components/VoxelDisplay";
import { useVoxelDisplay } from "../Hooks/useVoxelDisplay";
import { Button } from "@divineplexus/editor/Components/Button";
import "./VoxelSelect.css";
import { Pane } from "@divineplexus/editor/Components/Pane/Pane";
import { Input } from "@divineplexus/editor/Components/Form/FormComponents";
import { Icon } from "@divineplexus/editor/Components/Icon";
import { FuzzySearch } from "@divinestar/utils/Search/FuzzySearch";
export function VoxelSelectList(props: {
  onSelected: (voxelData: VoxelDisplayData) => void;
}) {
  const [voxels, setVoxels] = useState<VoxelDisplayData[]>([]);
  const [voxelSearch, setVoxelSearch] = useState("");

  useEffect(() => {
    (async () => {
      setVoxels(await useVoxelDisplay.getList());
    })();
  }, []);

  return (
    <div className="voxel-select">
      <div className="voxel-list-search">
        <Icon icon="search" />
        <Input
          type="text"
          defaultValue={voxelSearch}
          onInput={(evt) => {
            setVoxelSearch((evt.target as HTMLInputElement).value);
          }}
        />
      </div>
      <div className="voxel-list">
        {voxels.map((_) => (
          <Pane
            paneComponentProps={{
              style: {
                ...(voxelSearch
                  ? {
                      display: `${
                        FuzzySearch.fuzzyCloseMatch(
                          _.data.id.split("_"),
                          voxelSearch.split(" ").map((_) => _.trim()),
                          0.2
                        )
                          ? "block"
                          : "none"
                      }`,
                    }
                  : {}),
              },
            }}
          >
            <VoxelDisplay data={_} />
            <Button
              onClick={() => {
                props.onSelected(_);
              }}
            >
              Select
            </Button>
          </Pane>
        ))}
      </div>
    </div>
  );
}
