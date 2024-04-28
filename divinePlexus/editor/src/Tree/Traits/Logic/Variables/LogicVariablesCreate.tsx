import { shortId } from "@divinestar/utils/Ids";
import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import {
  LogicVariableCreateTraitData,
  LogicVariableCreatePlexusTrait,
} from "@divineplexus/core/Base/Traits/Logic/Variables/LogicVariableCreate.plexus.trait";
import { SchemaEditor } from "Components/Schemas/SchemaEditor";
import { LogicComponentTrait } from "../Logic.trait";
import {
  LogicBadge,
  LogicRow,

} from "../Components/LogicEditor";
import { VariableTraitInterface } from "@divineplexus/core/Base/Traits/Interfaces/Functions/VariableTrait.trait.interface";
import { LogicErrorCheck } from "../Interfaces/LogicErrorCheck";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { LogicErrorCheckComponent } from "../Components/LogicErrorCheckComponent";

export type LogicVariableCreateComponentTraitData = TreeNodeComponentTraitData<
  LogicVariableCreateTraitData["properties"]
>;

export class LogicVariableCreateComponentTrait
  extends TreeNodeComponentTraitBase<LogicVariableCreateComponentTraitData>
  implements VariableTraitInterface
{
  static Meta = {
    ...LogicVariableCreatePlexusTrait.Meta,
    icon: "variable",
    description: "Creates a variable.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({
    trait,
  }: {
    trait: LogicVariableCreateComponentTrait;
  }) {
    return (
      <LogicRow
        trait={trait}
        frontContent={
          <>
            <SchemaEditor
              nodes={[
                {
                  id: "name",
                  name: "Name",
                  input: {
                    type: "string",
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER,
                    default: trait.data.properties.name,
                    onUpdate: (varname) => {
                      trait.data.properties.name = varname;
                    },
                  },
                },
              ]}
            />
            <LogicBadge>
              <p>=</p>
            </LogicBadge>
          </>
        }
      />
    );
  }

  static CreateNew(
    overrides: Partial<LogicVariableCreateComponentTraitData>
  ): LogicVariableCreateComponentTraitData {
    return {
      id: shortId(),
      properties: {
        name: "",
        dataType: "",
      },
      traits: [],
      traitType: LogicVariableCreateComponentTrait.Meta.id,
      ...overrides,
    };
  }

  static LeftSidebarComponent({
    trait,
  }: {
    trait: LogicVariableCreateComponentTrait;
  }) {
    return <LogicErrorCheckComponent trait={trait} />;
  }

  logicErrorCheck: LogicErrorCheck;
  logicParent: LogicComponentTrait;
  constructor(data: LogicVariableCreateComponentTraitData, parent: any) {
    super(data, parent);
    for (const trait of this.traverseTraits("up")) {
      if (trait instanceof LogicComponentTrait) {
        this.logicParent = trait;
        break;
      }
    }
    this.logicErrorCheck = new LogicErrorCheck(this);
  }

  async init() {}

  get dataType() {
    return this.logicErrorCheck.evulatedType?.dataType || DataTypes.Null;
  }
  getDataTypeTraitId(): string {
    return this.logicErrorCheck.evulatedType?.traitType || DataTypes.Null;
  }

  getClass() {
    return LogicVariableCreateComponentTrait;
  }

  getMeta() {
    return LogicVariableCreateComponentTrait.Meta;
  }
}
