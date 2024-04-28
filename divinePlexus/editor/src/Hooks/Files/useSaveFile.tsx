import { useEffect, useRef } from "react";

export function useSaveFile() {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {});
  const save = (fileName: string, data: string) => {
    if (!anchorRef.current) throw new Error("Could not save file.");
    const anchor = anchorRef.current!;
    anchor.setAttribute("href", data);
    anchor.setAttribute("download", fileName);
    anchor.click();
  };
  return [
    <a
      ref={anchorRef}
      style={{
        display: "none",
      }}
    />,
    {
      saveJSON(fileName: string, json: any) {
        const dataStr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(json));
        save(fileName, dataStr);
      },
      saveBinary(fileName: string, binary: ArrayBuffer) {
        /*         const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(json)); */
        save(fileName, "dataStr");
      },
    },
  ] as const;
}
