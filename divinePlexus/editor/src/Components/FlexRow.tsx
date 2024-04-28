import { ReactElement } from "react";

export function FlexRow(props: {
  children?: ReactElement[] | ReactElement | string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      {Array.isArray(props.children) ? (
        <>{...props.children}</>
      ) : (
        props.children
      )}
    </div>
  );
}
