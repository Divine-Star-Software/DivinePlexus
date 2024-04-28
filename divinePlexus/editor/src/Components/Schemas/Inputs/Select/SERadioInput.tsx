import { SEBaseInput } from "../../Components/SEBaseInput";
import { useSEInputValue } from "../Hooks/useSEInputValue";
import { SchemaEditorInputRegister } from "../SchemaEditorInputRegister";
SchemaEditorInputRegister.register("radio", (props) => {
  const [value, setValue] = useSEInputValue(props);
  return (
    <SEBaseInput {...props}>
      <input
        type="radio"
        className="input"
        defaultValue={value}
        disabled={props.data.input?.disabled}
        onInput={({ target }) => {
          const value = Boolean((target as HTMLInputElement).value);
          setValue(value);
        }}
      />
    </SEBaseInput>
  );
});
