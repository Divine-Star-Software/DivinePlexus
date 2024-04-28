import { ReactElement } from "react";
import "./Window.css";
export function Window(props: { children?: ReactElement }) {
  return (
    <div className="window-container">
      <div className="window">{props.children}</div>
    </div>
  );
}
