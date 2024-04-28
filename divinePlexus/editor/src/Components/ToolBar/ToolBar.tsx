import { ReactElement } from "react";
import "./ToolBar.css";
export function ToolBar(props: {
  children?: ReactElement[] | ReactElement | string;
}) {
  return (
    <div className="tool-bar">
      {Array.isArray(props.children) ? (
        <>{...props.children}</>
      ) : (
        props.children
      )}
    </div>
  );
}
