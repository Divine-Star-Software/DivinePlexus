import { Observable } from "@divinestar/utils/Observers";
import type { Vec2Array, Vec3Array } from "@divinevoxel/core/Math";
import { useEffect, useRef, useState } from "react";
import { Input, Label } from "Components/Form/FormComponents";
const VectorInputBase = (props: {
  array: number[];
  index: number;
  label: string;
  disabled?: boolean;
  updateObserver:
    | Observable<number[]>
    | Observable<Vec3Array>
    | Observable<Vec2Array>;
}) => {
  const [value, setValue] = useState(props.array[props.index]);
  props.updateObserver.subscribe(props.index, (array) => {
    if (value != array[props.index]) {
      setValue(array[props.index]);
    }
  });
  return (
    <div className="vector-input-node">
      <div className="vector-input-label">
        <Label>{props.label}</Label>
      </div>
      <Input
        className="input"
        type="number"
        step="any"
        disabled={props.disabled}
        defaultValue={value}
        onInput={({ target }) => {
          let value = parseFloat((target as HTMLInputElement).value);
          if (Number.isNaN(value)) value = 0;
          props.array[props.index] = value;
          props.updateObserver.notify(props.array as any);
          setValue(value);
        }}
      />
    </div>
  );
};

export function ObjectVector3Property(props: {
  default?: number[];
  label: string;
  segmentLabels?: string[];
  disabled?: boolean;
  updateObserver:
    | Observable<number[]>
    | Observable<Vec3Array>
    | Observable<Vec2Array>;
}) {
  const [array, setArray] = useState<number[]>(
    props.default ? props.default : [0, 0, 0]
  );

  const subbed = useRef({});
  props.updateObserver.subscribe(subbed.current!, (array) => setArray(array));
  useEffect(() => {
    return () => {
      props.updateObserver.unsubscribe(subbed.current!);
    };
  }, []);

  let segmentLabels = props.segmentLabels
    ? props.segmentLabels
    : ["X", "Y", "Z"];
  return (
    <div className="object-vector-property">
      <div className="object-vector-propert-label">
        <Label>{props.label}</Label>
      </div>
      <div className="vector-3-inputs">
        <VectorInputBase
          updateObserver={props.updateObserver}
          array={array}
          label={segmentLabels[0]}
          index={0}
          disabled={props.disabled}
        />
        <VectorInputBase
          updateObserver={props.updateObserver}
          array={array}
          label={segmentLabels[1]}
          index={1}
          disabled={props.disabled}
        />
        <VectorInputBase
          updateObserver={props.updateObserver}
          array={array}
          label={segmentLabels[2]}
          index={2}
          disabled={props.disabled}
        />
      </div>
    </div>
  );
}
