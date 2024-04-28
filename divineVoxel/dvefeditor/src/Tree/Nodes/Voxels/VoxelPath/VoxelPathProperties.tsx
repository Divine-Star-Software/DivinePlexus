/* import { VoxeBindlSelect } from "Modules/Voxels/Select/VoxeBindlSelect";
import { VoxelPathEditorNode } from "./VoxelPath.node";
import { VoxelPathSegment } from "./VoxelPathSegment";
import { useRef, useState } from "react";
import { CollapsePanel } from "Components/CollpasePanel/CollapsePanel";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";
import { ObjectVector3Property } from "Components/Form/ObjectVectorProperties";
import { Observable } from "@divinestar/utils/Observers";
import { Vec3Array } from "@divinevoxel/core/Math";
import { Button } from "Components/Button";
import { ToolBar } from "Components/ToolBar/ToolBar";
import {
  VoxelPathSegmentPathTypeIndavidual,
  VoxelPathSegmentPathTypeMultiple,
} from "./VoxelPathTypes/SegmentPathTypeSelect";
import { Input } from "Components/Form/FormComponents";
import { useEditorNodePropertiesState } from "/Sidebar/NodeProperties/EditorNodePropertiesTreeState";

function VoxelPathSegmentTitle({ segment }: { segment: VoxelPathSegment }) {
  const [active, setActive] = useState(segment.isActive());
  segment.baseObservers.active.subscribe(VoxelPathSegmentTitle, (active) => {
    setActive(active);
  });
  const [selected, setSelected] = useState(segment.isActive());
  segment.baseObservers.selected.subscribe(
    VoxelPathSegmentTitle,
    (selected) => {
      setSelected(selected);
    }
  );
  return (
    <>
      <div className="object-tool-bar">
        <>
          <div className="object-tool-bar-title">{segment.index}</div>
          <div
            className="object-tool-bar-button"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Input
              type="checkbox"
              checked={selected}
              onChange={(event) => {
                segment.setSelected(Boolean(event.target.checked));
              }}
            />
            <Button
              icon={active ? "transform" : "square"}
              onClick={() => {
                segment.setActive(!segment.isActive());
              }}
            />
            <Button
              title="Delete"
              icon={"delete"}
              onClick={() => {
                segment.path.removeSegment(segment.index);
              }}
            />
          </div>
        </>
      </div>
    </>
  );
}

function VoxelPathSegmentComponent({ segment }: { segment: VoxelPathSegment }) {

  const updatePositionObserver = useRef(new Observable<Vec3Array>()).current;
  updatePositionObserver.subscribe(segment, (point) => {
    segment.update({
      point,
    });
  });
  segment.observers.updated.subscribe(segment, (data) => {
    updatePositionObserver.notify(segment.data.properties.point);
  });
  return (
    <CollapsePanel title={<VoxelPathSegmentTitle segment={segment} />}>
      <>
        <ObjectVector3Property
          label="Position"
          default={segment.data.properties.point}
          updateObserver={updatePositionObserver}
        />
        <SchemaEditor
          nodes={[
            {
              name: "Is Arc",
              id: "isArch",
              input: {
                type: "checkbox",
                default: segment.data.properties.isArc,
                onUpdate: (isArc) => {
                  segment.update({
                    isArc,
                  });
                },
              },
            },
            {
              name: "Arc Radius",
              id: "arc-radius",
              input: {
                type: "float",
                min: 0,
                max: Infinity,
                default: segment.data.properties.radius,
                onUpdate: (radius) => {
                  segment.update({
                    radius,
                  });
                },
              },
            },
          ]}
        />
        <VoxelPathSegmentPathTypeIndavidual segment={segment} />
      </>
    </CollapsePanel>
  );
}

function VoxelPathSegments({ node }: { node: VoxelPathEditorNode }) {
  const [segments, setSegments] = useState(node.segments);
  node.observers.segments.added.subscribe(VoxelPathProperties, () => {
    setSegments([...node.segments]);
  });
  node.observers.segments.removed.subscribe(VoxelPathProperties, () => {
    setSegments([...node.segments]);
  });
  const propertiesState = useEditorNodePropertiesState((_) => _);
  return (
    <>
      <ToolBar>
        <Button
          onClick={() => {
            if (!node.segments.length) {
              node.addSegment(VoxelPathSegment.CreateNew({})).setActive(true);
            } else {
              node
                .addSegment(
                  VoxelPathSegment.CreateNew(
                    node.segments[node.segments.length - 1].toJSON()
                  )
                )
                .setActive(true);
            }
          }}
          title="Add Point To Path"
          icon="new_file"
        />
        <Button
          onClick={() => {
            node.segments.forEach((_) => _.setSelected(true));
          }}
          title="Select all segments."
          icon="check"
        />
        <Button
          onClick={() => {
            node.segments.forEach((_) => {
              _.setSelected(false);
              _.setActive(false);
            });
          }}
          title="De-Select all segments."
          icon="square"
        />
        <Button
          onClick={() => {
            const selected = segments.filter((_) => _.isSelected());
            if (!selected.length) return;
            propertiesState.updates.showScreen(
              <VoxelPathSegmentPathTypeMultiple
                segments={selected}
                done={() => {
                  propertiesState.updates.hieScreen();
                }}
              />
            );
          }}
          title="Assign Path Type To Selected Segments"
          icon="assign"
        />
        <Button
          onClick={() => {
            node.segments
              .filter((_) => _.isSelected())
              .forEach((_) => node.removeSegment(_.index));
          }}
          title="De-Select all segments."
          icon="delete"
        />
      </ToolBar>
      <>
        {segments.map((_) => (
          <VoxelPathSegmentComponent
            key={`${node.data.id}-${_.index}`}
            segment={_}
          />
        ))}
      </>
    </>
  );
}

export function VoxelPathProperties({ node }: { node: VoxelPathEditorNode }) {
  return (
    <>
      <VoxeBindlSelect
        data={{
          voxelId: node.data.properties.voxel.id,
        }}
        onSelect={(_) => {
          node.update({
            properties: {
              ...node.data.properties,
              voxel: {
                ...node.data.properties.voxel,
                id: _.data.id,
              },
            },
          });
        }}
      />
      <VoxelPathSegments node={node} />
    </>
  );
}
 */