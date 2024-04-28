import { ObjectToolBar } from "Components/ToolBar/ObjectToolBar";
import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import "./TraitComponent.css";
import { Button } from "Components/Button";
import { Icon } from "Components/Icon";
import { Pane } from "Components/Pane/Pane";
import { Color4, Tools } from "@babylonjs/core";
import React, { ReactElement, useRef } from "react";
import { TreeNodeRegister } from "Classes/Tree/TreeNodeRegister";

function LeftSidebarComponent({
  trait,
}: {
  trait: TreeNodeComponentTraitBase;
}) {
  const ref = useRef(trait.getClass().LeftSidebarComponent);
  const Component = ref.current!;
  return <Component trait={trait} />;
}

export function TraitComponent({
  trait,
  traitType,
  children,
  className,
  endButtons,
  startButtons,
  rightSideBar,
  leftSideBar,
  bottomSideBar,
  paneComponentProps,
  paneConateinrProps,
  overlayContent,
  paneTitleProps,
}: {
  trait?: TreeNodeComponentTraitBase;
  traitType?: string;
  children?: ReactElement;
  overlayContent?: ReactElement;
  endButtons?: ReactElement;
  startButtons?: ReactElement;
  rightSideBar?: ReactElement;
  leftSideBar?: ReactElement;
  bottomSideBar?: ReactElement;
  className?: string;
  key?: string;
  paneComponentProps?: React.HTMLProps<HTMLDivElement>;
  paneConateinrProps?: React.HTMLProps<HTMLDivElement>;
  paneTitleProps?: React.HTMLProps<HTMLDivElement>;
}) {
  if (!trait) {
    console.trace();
  }
  const traitClass = TreeNodeRegister.getComponentTraitsByType(
    traitType || trait?.getMeta().id || "failure"
  );

  const TraitComponent = traitClass.PropertiesComponent;
  const RightSideBar = traitClass.RightSidebarComponent;
  const BottomSideBar = traitClass.BottomBarComponent;

  const color = Color4.FromHexString(
    traitClass.Meta.color ? traitClass.Meta.color! : "#ffffff"
  );

  const titleColor = `rgba(${color.r * 256},${color.g * 256},${
    color.b * 256
  } ,.3`;
  const contentColor = `rgba(${color.r * 128},${color.g * 128},${
    color.b * 128
  } ,.15)`;

  return (
    <Pane
      overlayContent={overlayContent}
      paneComponentProps={{
        className: `trait-component ${className}`,
        ...paneComponentProps,
      }}
      paneComponentTitleProps={paneTitleProps}
      paneConateinrProps={paneConateinrProps}
      titleColor={titleColor}
      contentColor={contentColor}
      leftSideBar={
        (trait && trait.getClass().LeftSidebarComponent ? (
          <LeftSidebarComponent trait={trait} />
        ) : undefined) || leftSideBar
      }
      rightSideBar={
        (RightSideBar && trait ? <RightSideBar trait={trait} /> : undefined) ||
        rightSideBar
      }
      bottomBar={
        (BottomSideBar && trait ? (
          <BottomSideBar trait={trait} />
        ) : undefined) || bottomSideBar
      }
      titleComponent={
        <ObjectToolBar
          titleComponent={
            <>
              {!startButtons ? <></> : startButtons}
              <div
                className="node-component-trait-icon"
                title={traitClass.Meta.description}
              >
                <Icon
                  icon={traitClass.Meta.icon as any}
                  stroke={traitClass.Meta.color}
                  fill={traitClass.Meta.color}
                />
              </div>
              <p>
                {trait && trait.data.title
                  ? trait.data.title
                  : traitClass.Meta.name}
              </p>
            </>
          }
          endButtonComponent={
            <>
              {!endButtons && trait ? (
                <>
                  {!trait.data.permanent && (
                    <Button
                      onClick={() => {
                        trait.parent.removeTrait(trait.id);
                      }}
                      icon="delete"
                    />
                  )}
                  {trait.data.locked && (
                    <div
                      className="node-component-trait-lock-icon"
                      title="Component trait is locked and can not be deleted."
                    >
                      <Icon icon="lock" />
                    </div>
                  )}
                </>
              ) : (
                endButtons
              )}
            </>
          }
        />
      }
    >
      <>{!children ? trait && <TraitComponent trait={trait} /> : children}</>
    </Pane>
  );
}
