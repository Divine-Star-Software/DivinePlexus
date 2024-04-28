import { DropDownMenuItems } from "Components/DropDownMenu/DropDownMenu";
import { ObjectComponentTrait } from "../Types/Object.trait";
import {
  ExposedFunctionsData,
  ExposedObject,
  ExposedPropertiesData,
} from "../Types/ExposedObject";
import { ObjectRegister } from "Objects/ObjectRegister";

export const useExposedObject = Object.assign(
  ({ objectId }: { objectId: string }) => {
    const object = ObjectRegister._allObjects.get(objectId);
    if (!object) throw new Error(`Object with id ${objectId} does not exist`);

    return {
      object,
      getConstructor() {
        return object.getConstructor();
      },
      getFunction(path: string[]) {
        return object.getFunction(path);
      },
      getFunctios(
        run: (
          name: string,
          data: ExposedFunctionsData,
          path: string[],
          object: ExposedObject
        ) => void
      ): DropDownMenuItems {
        const traverse = (
          parent: DropDownMenuItems,
          path: string[],
          current: any
        ) => {
          for (const key of Object.keys(current)) {
            const newPath = [...path, key];
            if (object.isFunctionPath(newPath)) {
              const func = object.getFunction(newPath)!;
              parent.children?.push({
                name: key,
                action: () => {
                  run(key, func as ExposedFunctionsData, newPath, object);
                },
              });
              continue;
            }
            const newCurrent = current[key];
            if (
              !newCurrent ||
              typeof newCurrent === "function" ||
              typeof newCurrent != "object"
            )
              continue;
            traverse(
              {
                name: key,
                children: [],
              },
              newPath,
              current[key]
            );
          }
        };

        const top = {
          name: "Functions",
          children: [],
        };
        traverse(top, [], object.functions);
        return top;
      },
      getPropertie(path: string[]) {
        return object.getProperty(path);
      },
      getProperties(
        run: (
          name: string,
          data: ExposedPropertiesData,
          path: string[],
          object: ExposedObject
        ) => void
      ): DropDownMenuItems {
        const traverse = (
          parent: DropDownMenuItems,
          path: string[],
          current: any
        ) => {
          for (const key of Object.keys(current)) {
            const newPath = [...path, key];

            if (object.isPropertiesPath(newPath)) {
              const func = object.getProperty(newPath)!;
              parent.children!.push({
                name: key,
                action: () => {
                  run(key, func as ExposedPropertiesData, newPath, object);
                },
              });
              continue;
            }
            const newCurrent = current[key];

            if (
              !newCurrent ||
              typeof newCurrent === "function" ||
              typeof newCurrent != "object"
            )
              continue;
            traverse(
              {
                name: key,
                children: [],
              },
              newPath,
              current[key]
            );
          }
        };

        const top = {
          name: "Properties",
          children: [],
        };
        traverse(top, [], object.properties);
        return top;
      },
    };
  },
  {
    getConstructor: (objectId: string) => {
      const object = ObjectRegister._allObjects.get(objectId);
      if (!object) throw new Error(`Object with id ${objectId} does not exist`);

      return object.getConstructor();
    },
  }
);
