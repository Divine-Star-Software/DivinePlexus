import { useState } from "react";
import "./SwitchBar.css";
import { Button } from "Components/Button";
import { IconNames } from "Components/Icon";

export function SwitchBar(props: {
  items: {
    id: string;
    active?: boolean;
    text?: string;
    icon?: IconNames;
    title?:string
    onClick: Function;
  }[];
}) {
  const [active, setActive] = useState<undefined | string>(
    props.items.find((_) => _.active)?.id
  );
  return (
    <div className="switch-bar">
      {props.items.map((_) => (
        <Button
          key={_.id}
          title={_.title}
          className={active == _.id ? "switch-item-active" : undefined}
          onClick={(event) => {
            setActive(_.id);
            _.onClick(event);
          }}
          icon={_.icon}
        >
          {_.text}
        </Button>
      ))}
    </div>
  );
}
