import { Label } from "Components/Form/FormComponents";
import { SEInputBaseProps } from "../Types/SEInputElement";
import { useState, ReactElement } from "react";

export const SEBaseInput = ({
 data,
 editor,
 children,
}: SEInputBaseProps & { children: ReactElement }) => {
 const [enabled, setEnabled] = useState(editor.current._isEnabled(data));
 editor.current.observers.conditionsChange.subscribe(data.id.toString(), () => {
  setEnabled(editor.current._isEnabled(data));
 });
 return (
  <div className="form-group" key={data.id.toString()}>
   <Label>{data.name}</Label>
   {children}
  </div>
 );
};
