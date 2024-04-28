import { useRef } from "react";

class FileWrap {
  get metaData() {
    return {
      name: this.file.name,
      mimeType: this.file.type,
    };
  }
  constructor(public file: File) {}

  getAsDataURL(): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") resolve(result);
        else reject(new Error("Could not read file as data URL."));
      };
      fileReader.onerror = () =>
        reject(new Error("Error reading file as data URL."));
      fileReader.readAsDataURL(this.file);
    });
  }

  getAsString(): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") resolve(result);
        else reject(new Error("Could not read file as string."));
      };
      fileReader.onerror = () =>
        reject(new Error("Error reading file as string."));
      fileReader.readAsText(this.file);
    });
  }

  getAsArrayBuffer(): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const result = event.target?.result;
        if (result instanceof ArrayBuffer) resolve(result);
        else reject(new Error("Could not read file as array buffer."));
      };
      fileReader.onerror = () =>
        reject(new Error("Error reading file as array buffer."));
      fileReader.readAsArrayBuffer(this.file);
    });
  }

  async getAsJSON<T>(): Promise<T> {
    const string = await this.getAsString();
    try {
      return JSON.parse(string);
    } catch (error) {
      throw new Error("Could not parse file as JSON.");
    }
  }

  getAsBlob(): Promise<Blob> {
    return Promise.resolve(this.file);
  }
}

export function useFindFile() {
  const ref = useRef<HTMLInputElement>(null);
  const currentFile = useRef<File | undefined>();

  return [
    <>
      <input
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (!file) {
            currentFile.current = undefined;
            return;
          }
          currentFile.current = file;
        }}
        style={{ display: "none" }}
        type="file"
        ref={ref}
      />
    </>,
    (): Promise<FileWrap | undefined> => {
      return new Promise((resolve, reject) => {
        if (!ref.current) {
          reject(new Error("Hidden file input not rendered."));
          return;
        }
        const input = ref.current;
        const onChange = () => {
          resolve(
            currentFile.current ? new FileWrap(currentFile.current) : undefined
          );
          input.removeEventListener("change", onChange);
        };
        input.addEventListener("change", onChange);
        input.click();
      });
    },
  ] as const;
}
