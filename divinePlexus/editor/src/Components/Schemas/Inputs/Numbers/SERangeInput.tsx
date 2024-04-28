import type { ObjectSchemaRangeInput } from "Types/schemas/";
import { SEBaseInput } from "../../Components/SEBaseInput";
import { useSEInputValue } from "../Hooks/useSEInputValue";
import { SchemaEditorInputRegister } from "../SchemaEditorInputRegister";
import { Slider } from "Components/Form/FormComponents";

SchemaEditorInputRegister.register("range", (props) => {
  const [value, setValue] = useSEInputValue(props);
  const input = props.data.input as ObjectSchemaRangeInput;
  return (
    <SEBaseInput {...props}>
      <Slider
        className="input"
        min={input.min}
        max={input.max}
        defaultValue={value}
        onChange={(value) => {
          setValue(value);
        }}
      />
    </SEBaseInput>
  );
});
