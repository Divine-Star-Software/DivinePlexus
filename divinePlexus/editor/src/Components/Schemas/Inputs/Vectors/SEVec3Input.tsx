import { SEVectorInputBase } from "./SEVectorInputBase";
import { SchemaEditorInputRegister } from "../SchemaEditorInputRegister";
import { SEBaseInput } from "Components/Schemas/Components/SEBaseInput";
import { Observable } from "@divinestar/utils/Observers";
import { Vec3Array } from "@divinevoxel/core/Math";
import { ObjectVector3Property } from "Components/Form/ObjectVectorProperties";
import { useSEInputValue } from "../Hooks/useSEInputValue";
import { useEffect, useRef } from "react";
SchemaEditorInputRegister.register("vec3", (props) => {
  const updated = useRef<Observable<number[]>>(new Observable<number[]>());

  const [value, setValue] = useSEInputValue<number[]>(props);

  updated.current.subscribe(props.data, (newValue) => {
    setValue(newValue);
  });
  useEffect(() => {
    updated.current.notify(value);
  }, [value]);
  return (
    <ObjectVector3Property
      label={props.data.name}
      default={value}
      disabled={props.data.input?.disabled}
      updateObserver={updated.current}
    />
  );
});
