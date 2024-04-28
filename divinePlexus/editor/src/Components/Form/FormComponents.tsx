import {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import "./Form.css";

export function Label(
  props: {
    className?: string;
  } & LabelHTMLAttributes<any>
) {
  return (
    <label {...props} className={`label ${props.className}`}>
      {props.children}
    </label>
  );
}

export function Input(
  props: {
    className?: string;
  } & InputHTMLAttributes<any>
) {
  return <input {...props} className={`input ${props.className}`} />;
}
export function TextArea(
  props: {
    className?: string;
  } & TextareaHTMLAttributes<any>
) {
  return <textarea {...props} className={`textarea ${props.className}`} />;
}
export function CheckBox(
  props: {
    className?: string;
  } & InputHTMLAttributes<any>
) {
  return (
    <div className={`checkbox-container`} >
    <input
      type="checkbox"
      {...props}
      className={`checkbox ${props.className}`}
    />
    </div>
  );
}
export function Slider(
  props: {
    className?: string;
  } & InputHTMLAttributes<any>
) {
  return (
    <input type="range" {...props} className={`slider ${props.className}`} />
  );
}
export function DropDownList(
  props: {
    className?: string;
    options: string[];
  } & SelectHTMLAttributes<any>
) {
  return (
    <select {...props} className={`dropdown-list ${props.className}`}>
      {props.options.map((_) => (
        <option   className={`dropdown-list-option`} key={_}>{_}</option>
      ))}
    </select>
  );
}
