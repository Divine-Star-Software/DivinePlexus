import { ReactElement, useRef } from "react";
import { createRoot } from "react-dom/client";

type WindowProps = {
  width?: number;
  height?: number;
  toolbar?: boolean;
  menubar?: boolean;
  location?: boolean;
  resizable?: boolean;
  scrollbars?: boolean;
  status?: boolean;
  maximize?: boolean;
  title?: string;
  zoom?: number;
};

export function useWindow(props: WindowProps) {
  const windowRef = useRef<Window | null>(null);

  return [
    (element: ReactElement, beforeRender?: (window: Window) => void) => {
      let settingsString: string[] = [];
      if (props.maximize) {
        settingsString.push(`width=${screen.width}`, `height=${screen.height}`);
      } else {
        if (props.width) settingsString.push(`width=${props.width}`);
        if (props.height) settingsString.push(`height=${props.height}`);
      }
      // Additional options
      settingsString.push(`toolbar=${props.toolbar ? "yes" : "no"}`);
      settingsString.push(`menubar=${props.menubar ? "yes" : "no"}`);
      settingsString.push(`scrollbars=${props.scrollbars ? "yes" : "no"}`);
      settingsString.push(`resizable=${props.resizable ? "yes" : "no"}`);
      settingsString.push(`location=${props.location ? "yes" : "no"}`);
      settingsString.push(`status=${props.status ? "yes" : "no"}`);

      const newWindow = window.open("", "_blank", settingsString.join(","));

      if (!newWindow) return;
      newWindow.name = props.title ? props.title : "unnamed-window";
      windowRef.current = newWindow;
      if (beforeRender) beforeRender(newWindow);
      if (props.title) {
        newWindow.document.title = props.title;
      }

      if (props.zoom) {
        (newWindow.document.body.style as any).zoom = `${props.zoom}%`;
      }

      // Add meta tags and other necessary elements
      const metaViewport = newWindow.document.createElement("meta");
      metaViewport.name = "viewport";
      metaViewport.content = "width=device-width, initial-scale=1";
      newWindow.document.head.appendChild(metaViewport);

      const metaCharset = newWindow.document.createElement("meta");
      metaCharset.setAttribute("charset", "UTF-8");
      newWindow.document.head.appendChild(metaCharset);

      // Clone and append stylesheets
      const stylesheets = document.querySelectorAll(
        'style, link[rel="stylesheet"]'
      );
      stylesheets.forEach((linkOrStyle) => {
        newWindow.document.head.appendChild(linkOrStyle.cloneNode(true));
      });

      // Create root div for React app
      const root = newWindow.document.createElement("div");
      root.id = "root";
      newWindow.document.body.appendChild(root);

      // Render the React element in the new window
      const reactRoot = createRoot(root);
      reactRoot.render(element);
    },
    {
      maximize: () => {
        if (!windowRef.current) return;
        windowRef.current.moveTo(0, 0);
        windowRef.current.resizeTo(screen.width, screen.height);
      },
      close: () => {
        if (!windowRef.current) return;
        windowRef.current.close();
      },
    },
  ] as const;
}
