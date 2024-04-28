import { Input, Label } from "Components/Form/FormComponents";
import { SEInputBaseProps } from "../../Types/SEInputElement";
import { useSEInputValue } from "../Hooks/useSEInputValue";
export const SEVectorInputBase = (
  props: SEInputBaseProps & { index: number; label: string }
) => {
  const [value, setValue, getValue] = useSEInputValue<number[]>(props);
  return (
    <div className="vector-input-node">
      <Label>{props.label}</Label>
      <Input
        className="input"
        type="number"
        step="any"
        defaultValue={value[props.index]}
        onInput={({ target }) => {
          let value = parseFloat((target as HTMLInputElement).value);
          if (Number.isNaN(value)) value = 0;
          const array = getValue();
          array[props.index] = value;
          setValue([...array]);
        }}
      />
    </div>
  );
};
