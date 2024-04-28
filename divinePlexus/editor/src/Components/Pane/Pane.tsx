import { ReactElement } from "react";
import "./Pane.css";
export function Pane(props: {
  titleComponent?: ReactElement;
  contentColor?: string;
  titleColor?: string;
  leftSideBar?: ReactElement;
  rightSideBar?: ReactElement;
  bottomBar?: ReactElement;
  paneConateinrProps?: React.HTMLProps<HTMLDivElement>;
  paneComponentProps?: React.HTMLProps<HTMLDivElement>;
  paneComponentTitleProps?: React.HTMLProps<HTMLDivElement>;
  overlayContent?: ReactElement;
  children: ReactElement | ReactElement[];
}) {
  return (
    <div
      className={`pane-container ${props?.paneComponentProps?.className}`}
      {...props.paneConateinrProps}
    >
      {props.overlayContent}
      <div className="pane-top">
        {props.leftSideBar && (
          <div
            {...(props.contentColor
              ? {
                  style: {
                    background: props.titleColor,
                  },
                }
              : {})}
            className="pane-side-bar left"
          >
            {props.leftSideBar}
          </div>
        )}
        <div {...props.paneComponentProps} className={`pane-component `}>
          {props.titleComponent && (
            <div
              {...(props.titleColor
                ? {
                    style: {
                      background: props.titleColor,
                    },
                  }
                : {})}
              {...props.paneComponentTitleProps}
              className="pane-component-title"
            >
              {props.titleComponent}
            </div>
          )}
          {props.children && (
            <div
              {...(props.contentColor
                ? {
                    style: {
                      background: props.contentColor,
                    },
                  }
                : {})}
              className="pane-component-content"
            >
              {props.children}
            </div>
          )}
        </div>
        {props.rightSideBar && (
          <div
            {...(props.contentColor
              ? {
                  style: {
                    background: props.titleColor,
                  },
                }
              : {})}
            className="pane-side-bar right"
          >
            {props.rightSideBar}
          </div>
        )}
      </div>
      {props.bottomBar && (
        <div
          {...(props.contentColor
            ? {
                style: {
                  background: props.titleColor,
                },
              }
            : {})}
          className="pane-side-bar bottom"
        >
          {props.bottomBar}
        </div>
      )}
    </div>
  );
}
