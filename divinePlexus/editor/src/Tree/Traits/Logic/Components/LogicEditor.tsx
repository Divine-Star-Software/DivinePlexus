import { ReactElement, useState } from "react";
import { DropDownMenu } from "Components/DropDownMenu/DropDownMenu";
import { TraitComponent } from "../../TraitComponent";
import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";

import "./LogicEditor.css";
import { useLogicComponent } from "../Hooks/useLogicComponent";
import { LogicComponentInterface } from "../Interfaces/LogicComponent.interface";

export function LogicBadge(props: { children?: ReactElement }) {
  return <div className="logic-badge">{props.children}</div>;
}

export enum StatusIndicatorTypes {
  Green = "green",
  Yellow = "yellow",
  Red = "red",
}

export function StatusIndicator({
  status,
  title,
}: {
  status: StatusIndicatorTypes;
  title?: string;
}) {
  return <div title={title} className={`indicator ${status}`}></div>;
}

export function LogicRow({
  trait,
  frontContent,
}: {
  trait: TreeNodeComponentTraitBase & LogicComponentInterface;
  frontContent?: ReactElement;
}) {
  const [traits, setTraits] = useState(trait.traits);
  trait.baseObservers.traitsUpdated.subscribe(trait, () => {
    setTraits([...trait.traits]);
  });

  const actions = useLogicComponent({ trait });
  return (
    <div className="logic-group scrollable">
      {frontContent && <>{frontContent}</>}
      {traits.map((_, index) => (
        <div className="logic-editor-node" key={`${_.id}-${index}`}>
          <TraitComponent trait={_ as any} key={_.id} />
        </div>
      ))}

      <DropDownMenu
        direction="horizontal"
        rootWindow={trait.getParentWindow()}
        items={actions.getNextItems()}
      />
    </div>
  );
}
export function LogicGroup({
  trait,
  frontContent,
}: {
  trait: TreeNodeComponentTraitBase & LogicComponentInterface;
  frontContent?: ReactElement;
}) {
  const [traits, setTraits] = useState(trait.traits);
  trait.baseObservers.traitsUpdated.subscribe(trait, () => {
    setTraits([...trait.traits]);
  });

  const actions = useLogicComponent({ trait });
  return (
    <div className="group">
      {frontContent && <>{frontContent}</>}
      {traits.map((_, index) => (
        <div className="logic-editor-node" key={`${_.id}-${index}`}>
          <TraitComponent trait={_ as any} key={_.id} />
        </div>
      ))}

      <DropDownMenu
        direction="horizontal"
        rootWindow={trait.getParentWindow()}
        items={actions.getNextItems()}
      />
    </div>
  );
}

export function LogicBlock({
  trait,
  endButtons,
}: {
  endButtons?: ReactElement;
  trait: TreeNodeComponentTraitBase & LogicComponentInterface;
}) {
  const [traits, setTraits] = useState(
    trait.traits as TreeNodeComponentTraitBase[]
  );
  trait.baseObservers.traitsUpdated.subscribe(trait, () => {
    setTraits([...trait.traits]);
  });
  const actions = useLogicComponent({ trait });
  return (
    <>
      {traits.map((_, index) => (
        <TraitComponent trait={_ as any} key={_.id} />
      ))}
    </>
  );
}
