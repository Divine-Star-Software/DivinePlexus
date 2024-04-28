import { MouseEvent, ReactElement } from "react";
export function Button(props: {
  className?: string;
  children?: ReactElement | string;
  onClick?: (event: MouseEvent) => void;
  key?: string;
  title?: string;
}) {
  return (
    <button
      title={props.title}
      key={props.key}
      onClick={props.onClick}
      className={`default-button ${props.className || ""}`}
    >
      {props.children}
    </button>
  );
}
