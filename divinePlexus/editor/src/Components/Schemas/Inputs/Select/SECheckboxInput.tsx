import { CheckBox } from "Components/Form/FormComponents";
import { SEBaseInput } from "../../Components/SEBaseInput";
import { useSEInputValue } from "../Hooks/useSEInputValue";
import { SchemaEditorInputRegister } from "../SchemaEditorInputRegister";
SchemaEditorInputRegister.register("checkbox", (props) => {
  const [value, setValue] = useSEInputValue(props);
  return (
    <SEBaseInput {...props}>
      <CheckBox
        type="checkbox"
        className="input"
        disabled={props.data.input?.disabled}
        checked={value}
        onChange={({ target }) => {
          const value = Boolean((target as HTMLInputElement).checked);
          setValue(value);
        }}
      />
    </SEBaseInput>
  );
});
