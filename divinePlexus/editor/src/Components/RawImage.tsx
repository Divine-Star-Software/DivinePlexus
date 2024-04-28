import { useEffect, useRef } from "react";

export function RawImage({
  src,
  width,
  height,
  flipY,
}: {
  src: Uint8ClampedArray;
  width?: number;
  height?: number;
  flipY?: boolean;
}) {
  height = height ? height : 250;
  width = width ? width : 250;

  const ref = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawImage = async () => {
    if (!contextRef.current) return;
    contextRef.current.clearRect(0, 0, width!, height!);
    const bitmap = await createImageBitmap(
      new ImageData(src, Math.sqrt(src.length / 4), Math.sqrt(src.length / 4)),
      {
        resizeWidth: width,
        resizeHeight: height,
        resizeQuality: "pixelated",
        imageOrientation: flipY ? "flipY" : undefined,
      }
  );
    contextRef.current.drawImage(bitmap, 0, 0, width!, height!);
  };
  useEffect(() => {
    (async () => {
      if (!ref.current) return;
      await drawImage();
    })();
  });
  useEffect(() => {
    (async () => {
      if (!ref.current) return;
      const canvas = ref.current;
      canvas.width = width!;
      canvas.height = height!;
      const context = canvas.getContext("2d", { willReadFrequently: true })!;
      context.imageSmoothingEnabled = false;

      contextRef.current = context;
      await drawImage();
    })();
  }, []);
  return <canvas ref={ref} />;
}
