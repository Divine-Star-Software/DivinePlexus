import { TextArea } from "Components/Form/FormComponents";
import { SEBaseInput } from "../../Components/SEBaseInput";
import { useSEInputValue } from "../Hooks/useSEInputValue";
import { SchemaEditorInputRegister } from "../SchemaEditorInputRegister";
SchemaEditorInputRegister.register("textarea", (props) => {
  const [value, setValue] = useSEInputValue(props);
  return (
    <SEBaseInput {...props}>
      <TextArea
        className="input"
        defaultValue={value}
        disabled={props.data.input?.disabled}
        onInput={({ target }) => {
          const value = (target as HTMLInputElement).value;
          setValue(value);
        }}
      />
    </SEBaseInput>
  );
});
