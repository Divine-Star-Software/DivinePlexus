import type { ObjectSchemaSelectInput } from "Types/schemas";
import { SEBaseInput } from "../../Components/SEBaseInput";
import { useSEInputValue } from "../Hooks/useSEInputValue";
import { SchemaEditorInputRegister } from "../SchemaEditorInputRegister";
import { DropDownList } from "Components/Form/FormComponents";
SchemaEditorInputRegister.register("select", (props) => {
  const [value, setValue] = useSEInputValue(props);
  const input = props.data.input as ObjectSchemaSelectInput;
  const options = input.options;
  return (
    <SEBaseInput {...props}>
      <DropDownList
            defaultValue={value}
        disabled={props.data.input?.disabled}
        options={options}
        onChange={({ target }) => {
          const value = String(target.value);
          setValue(value);
        }}
      />
    </SEBaseInput>
  );
});
