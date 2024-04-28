import { SEInputBaseProps } from "../../Types/SEInputElement";
import { useState, useEffect } from "react";

export function useSEInputValue<T = any, S = T>(
  props: SEInputBaseProps & {
    schemaSetFilter?: (value: any) => any;
    stateSetFilter?: (value: T) => S;
  }
) {
  const getStateValue = () =>
    props.stateSetFilter
      ? props.stateSetFilter(props.editor.current._getValue(props.data))
      : props.editor.current._getValue(props.data);
  const [value, setValue] = useState<S>(getStateValue());

  const updateValue = (value: T) => {
    props.editor.current._setValue(
      props.data,
      props.schemaSetFilter ? props.schemaSetFilter(value) : value,
      true
    );
    setValue(
      props.stateSetFilter ? props.stateSetFilter(value) : (value as any)
    );
  };
  const getValue = (): T => {
    return props.editor.current._getValue(props.data);
  };
  props.editor.current.observers.sync.subscribe(
    props.data.id.toString(),
    () => {
      updateValue(getValue());
    }
  );
  props.editor.current.observers.stateSync.subscribe(
    props.data.id.toString(),
    () => {
      setValue(getStateValue());
    }
  );

  return [value, updateValue, getValue] as const;
}
