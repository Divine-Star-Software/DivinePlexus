import { Input } from "Components/Form/FormComponents";
import { SEBaseInput } from "../../Components/SEBaseInput";
import { useSEInputValue } from "../Hooks/useSEInputValue";
import { SchemaEditorInputRegister } from "../SchemaEditorInputRegister";
SchemaEditorInputRegister.register("color", (props) => {
  const [value, setValue] = useSEInputValue(props);
  return (
    <SEBaseInput {...props}>
      <Input
        type="color"
        className="input"
        defaultValue={value}
        disabled={props.data.input?.disabled}
        autoComplete="on"
        onClick={(event) => {
          event.stopPropagation();
        }}
        onInput={({ target }) => {
          const value = (target as HTMLInputElement).value;
          setValue(value);
        }}
      />
    </SEBaseInput>
  );
});
