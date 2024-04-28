import { MouseEvent, ReactElement } from "react";

import { IconNames } from "./Icon";
import { Icon } from "./Icon";
export function Button(props: {
  className?: string;
  icon?: IconNames;
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
      {props.icon && <Icon icon={props!.icon} />}
      {props.children}
    </button>
  );
}
