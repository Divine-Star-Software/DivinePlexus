import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./DropDownMenu.css";
import { Icon, IconNames } from "Components/Icon";

export type DropDownMenuItems = {
  name?: string;
  icon?: IconNames;
  iconColor?: string;
  title?: string;
  action?: Function;
  children?: DropDownMenuItems[];
};

// A simplified DropDownMenuChildrenItem that doesn't need direct DOM manipulation
const DropDownMenuChildrenItem = ({
  item,
  depth,
  rootWindow,
  id,
}: {
  item: DropDownMenuItems;
  depth: number;
  key: string;
  id: string;
  rootWindow: Window;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutId = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutId.current) {
      clearTimeout(closeTimeoutId.current);
      closeTimeoutId.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutId.current = setTimeout(() => {
      setIsOpen(false);
    }, 50); // Adjust the delay as needed
  };
  const liRef = useRef<HTMLLIElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const dropdownContent =
    isOpen && item.children
      ? ReactDOM.createPortal(
          <ul
            style={{
              zIndex: 1000 * depth,
              position: "absolute",
            }}
            ref={ulRef}
            className="drop-down-menu-item-children"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {item.children.map((child, index) => (
              <DropDownMenuChildrenItem
                id={`${index}`}
                key={`${index}`}
                item={child}
                rootWindow={rootWindow}
                depth={depth + 1}
              />
            ))}
          </ul>,
          rootWindow.document.body
        )
      : null;

  useEffect(() => {
    if (!liRef.current || !ulRef.current) return;
    const liRect = liRef.current.getBoundingClientRect();
    const viewportWidth = rootWindow.innerWidth;
    const ulWidth = ulRef.current.offsetWidth;

    // Initially position to the right of the parent item, considering depth
    let horizontal = liRect.right + 200 * depth;

    // Check if positioning to the right causes overflow
    if (horizontal + ulWidth > viewportWidth) {
      // If so, adjust to position to the left of the parent item instead
      horizontal = liRect.left - ulWidth; // Position to the left
      // Ensure it does not go off-screen on the left side
      horizontal = Math.max(0, horizontal);
    }

    const viewportHeight = rootWindow.innerHeight;
    const ulHeight = ulRef.current.offsetHeight;
    let vertical = liRect.top;
    if (vertical + ulHeight > viewportHeight) {
      // Adjust vertically to avoid going off the bottom of the screen
      vertical = viewportHeight - ulHeight;
      // Ensure it does not go off-screen on the top side
      vertical = Math.max(0, vertical);
    }

    ulRef.current.style.position = "absolute";
    ulRef.current.style.left = `${horizontal}px`;
    ulRef.current.style.top = `${vertical}px`;
  }, [isOpen]);

  return (
    <>
      <li
        key={id}
        ref={liRef}
        className="drop-down-menu-item"
        title={item.title}
        onClick={() => item.action && item.action()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="drop-down-menu-item-content">
          {item.icon && <Icon icon={item.icon} stroke={item.iconColor} />}
          {item.name}
        </span>
      </li>
      {dropdownContent}
    </>
  );
};

const DropDownMenuTopItem = ({
  item,
  rootWindow,
  id,
}: {
  item: DropDownMenuItems;
  rootWindow: Window;
  key: string;
  id: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const liRef = useRef<HTMLLIElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const closeTimeoutId = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutId.current) {
      clearTimeout(closeTimeoutId.current);
      closeTimeoutId.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutId.current = setTimeout(() => {
      setIsOpen(false);
    }, 50); // Adjust the delay as needed
  };

  // Use a portal to render the dropdown to body
  const dropdownContent =
    isOpen && item.children
      ? ReactDOM.createPortal(
          <ul
            ref={ulRef}
            className="drop-down-menu-item-children"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {item.children?.map((_, index) => {
              if (!_) return <></>;
              return (
                <DropDownMenuChildrenItem
                  id={`${id}-${index}`}
                  key={`${id}-${index}`}
                  item={_}
                  rootWindow={rootWindow}
                  depth={0}
                />
              );
            })}
          </ul>,
          rootWindow.document.body
        )
      : null;

  useEffect(() => {
    if (!liRef.current || !ulRef.current) return;
    const scrollableContainer = liRef.current.closest(".scrollable");
    const scrollLeft = scrollableContainer ? scrollableContainer.scrollLeft : 0;
    const scrollTop = scrollableContainer ? scrollableContainer.scrollTop : 0;
    const liPosition = liRef.current.getBoundingClientRect();
    const ulWidth = ulRef.current.offsetWidth;
    const ulHeight = ulRef.current.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newLeft = liPosition.left + scrollLeft;
    let newTop = liPosition.bottom + scrollTop;

    // Adjust for viewport width
    if (newLeft + ulWidth > viewportWidth) {
      newLeft -= newLeft + ulWidth - viewportWidth;
    }

    // Adjust for viewport height
    if (newTop + ulHeight > viewportHeight) {
      newTop -= ulHeight + liPosition.height;
    }

    ulRef.current.style.left = `${newLeft}px`;
    ulRef.current.style.top = `${newTop}px`;
  }, [isOpen]);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (closeTimeoutId.current) {
        clearTimeout(closeTimeoutId.current);
      }
    };
  }, []);

  return (
    <>
      <li
        key={id}
        ref={liRef}
        className="drop-down-menu-item"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => item.action && item.action()}
        title={item.title}
      >
        <span className="drop-down-menu-item-content">
          {item.icon && <Icon icon={item.icon} stroke={item.iconColor} />}
          {item.name}
        </span>
      </li>
      {dropdownContent}
    </>
  );
};

export const DropDownMenu = ({
  items,
  direction,
  rootWindow,
  id,
}: {
  direction: string;
  items: DropDownMenuItems[];
  rootWindow?: Window;
  id?: string;
}) => {
  return (
    <ul className={`drop-down-menu ${direction}`}>
      {items.map((item, index) => (
        <DropDownMenuTopItem
          id={`${id}-${index}`}
          key={`${id}-${index}`}
          item={item}
          rootWindow={rootWindow ? rootWindow : window}
        />
      ))}
    </ul>
  );
};
