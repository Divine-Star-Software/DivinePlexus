import { VoxelData } from "@divinevoxel/core";
import { TextureData } from "@divinevoxel/foundation/Textures/Texture.types";
import { RawImage } from "@divineplexus/editor/Components/RawImage";
import "./VoxelDisplay.css";
import { JSONTreeDisplay } from "@divineplexus/editor/Components/JSONDisplay/JSONDisplay";
import { Pane } from "@divineplexus/editor/Components/Pane/Pane";

type TagValue = string | boolean | string[] | { id: string; data: any };
type TagsArray = [string, TagValue][];

interface JsonRecord {
  [key: string]: TagValue;
}

const transformTagsToJsonRecord = (tags: TagsArray): JsonRecord => {
  const record: JsonRecord = {};

  tags.forEach(([key, value]) => {
    // Remove the hashtag from the key
    const formattedKey = key.replace(/^#/, "");

    // If the value is an array or object that contains strings starting with '#', process them as well
    if (Array.isArray(value)) {
      value = value.map((item) =>
        typeof item === "string" && item.startsWith("#")
          ? item.replace(/^#/, "")
          : item
      );
    } else if (typeof value === "object" && value !== null && "id" in value) {
      value = {
        ...value,
        id: value.id.replace(/^#/, ""),
        data: Array.isArray(value.data)
          ? value.data.map((item) =>
              typeof item === "string" && item.startsWith("#")
                ? item.replace(/^#/, "")
                : item
            )
          : value.data,
      };
    }

    record[formattedKey] = value;
  });

  return record;
};
export type VoxelDisplayData = {
  data: VoxelData;
  texture: TextureData | null;
};

function VoxelImage({ image }: { image: TextureData }) {
  return (
    <div className="voxel-image-contianer">
      {image.base64 && (
        <img
          width={50}
          height={50}
          src={Array.isArray(image.base64) ? image.base64[0] : image.base64}
        />
      )}
      {image.rawData && (
        <RawImage
          width={50}
          height={50}
          src={Array.isArray(image.rawData) ? image.rawData[0] : image.rawData}
        />
      )}
    </div>
  );
}

export function VoxelDisplay(props: { data: VoxelDisplayData }) {
  return (
    <Pane titleComponent={<p>{props.data.data.id}</p>}>
      <div className="voxel-display">
        {props.data.texture && <VoxelImage image={props.data.texture} />}

        <Pane titleComponent={<p>Data</p>}>
          <JSONTreeDisplay
            object={transformTagsToJsonRecord(props.data.data.tags as any)}
          />
        </Pane>
      </div>
    </Pane>
  );
}
