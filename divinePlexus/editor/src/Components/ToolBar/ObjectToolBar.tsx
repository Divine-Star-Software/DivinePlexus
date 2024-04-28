import { ReactElement } from "react";

export function ObjectToolBar(props: {
  titleComponent?: string | ReactElement;
  startButtonComponent?: ReactElement;
  endButtonComponent?: ReactElement;
  toolBarProps?: React.HTMLProps<HTMLDivElement>;
}) {
  return (
    <div className="object-tool-bar" {...props.toolBarProps}>
      {props.startButtonComponent && (
        <div className="object-tool-bar-button-start">
          {props.startButtonComponent}
        </div>
      )}
      {props.titleComponent && (
        <div className="object-tool-bar-title">{props.titleComponent}</div>
      )}
      {props.endButtonComponent && (
        <div className="object-tool-bar-button-end">
          {props.endButtonComponent}
        </div>
      )}
    </div>
  );
}
