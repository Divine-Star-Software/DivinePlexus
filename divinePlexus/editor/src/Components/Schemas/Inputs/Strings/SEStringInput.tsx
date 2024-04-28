import { Input } from "Components/Form/FormComponents";
import { SEBaseInput } from "../../Components/SEBaseInput";
import { useSEInputValue } from "../Hooks/useSEInputValue";
import { SchemaEditorInputRegister } from "../SchemaEditorInputRegister";
SchemaEditorInputRegister.register("string", (props) => {
  const [value, setValue] = useSEInputValue(props);
  return (
    <SEBaseInput {...props}>
      <Input
        type="text"
        className="input"
        defaultValue={value}
        disabled={props.data.input?.disabled}
        autoComplete="on"
        onInput={({ target }) => {
          const value = (target as HTMLInputElement).value;
          setValue(value);
        }}
      />
    </SEBaseInput>
  );
});
