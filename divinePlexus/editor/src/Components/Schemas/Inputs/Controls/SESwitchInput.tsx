import { CheckBox } from "Components/Form/FormComponents";
import { SEBaseInput } from "../../Components/SEBaseInput";
import { useSEInputValue } from "../Hooks/useSEInputValue";
import { SchemaEditorInputRegister } from "../SchemaEditorInputRegister";
SchemaEditorInputRegister.register("switch", (props) => {
  const [value, setValue] = useSEInputValue(props);
  return (
    <SEBaseInput {...props}>
      <CheckBox
        defaultValue={value}
        disabled={props.data.input?.disabled}
        onChange={({ target }) => {
          const value = Boolean(target.value);
          setValue(value);
        }}
      />
    </SEBaseInput>
  );
});
