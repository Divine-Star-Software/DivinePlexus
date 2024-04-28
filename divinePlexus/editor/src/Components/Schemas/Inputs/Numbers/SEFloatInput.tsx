import { Input } from "Components/Form/FormComponents";
import { SEBaseInput } from "../../Components/SEBaseInput";
import { useSEInputValue } from "../Hooks/useSEInputValue";
import { SchemaEditorInputRegister } from "../SchemaEditorInputRegister";
SchemaEditorInputRegister.register("float", (props) => {
  const [value, setValue] = useSEInputValue(props);
  return (
    <SEBaseInput {...props}>
      <Input
        type="number"
        className="input"
        defaultValue={value}
        disabled={props.data.input?.disabled}
        onInput={({ target }) => {
          const value = parseFloat((target as HTMLInputElement).value);
          setValue(Number.isNaN(value) ? 0 : value);
        }}
      />
    </SEBaseInput>
  );
});
