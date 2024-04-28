import { ReactElement, useState } from "react";
import "./CollapsePanel.css";
import { Icon } from "Components/Icon";
import { BaseHTMLAttributes } from "react";
export function CollapsePanel(props: {
  title: string | ReactElement;
  children?: string | ReactElement;
  className?: string;
  open?: boolean;
  titleContainerProps?: BaseHTMLAttributes<HTMLDivElement>;
  iconContainerProps?: BaseHTMLAttributes<HTMLDivElement>;
}) {
  const [open, setOpen] = useState(props.open ? true : false);
  return (
    <div
      className={`default-collapse-panel ${
        props.className ? props.className : ""
      }`}
    >
      <div
        className="default-collapse-panel-title"
        {...props.titleContainerProps}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div
          className="default-collapse-panel-icon"
          {...props.iconContainerProps}
        >
          {!open && <Icon icon="chevron_right" />}
          {open && <Icon icon="chevron_down" />}
        </div>
        {props.title}
      </div>
      {open && (
        <div className="default-collapse-panel-content">{props.children}</div>
      )}
    </div>
  );
}
