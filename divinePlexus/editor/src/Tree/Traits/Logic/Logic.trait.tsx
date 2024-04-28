import { shortId } from "@divinestar/utils/Ids";

import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TreeNodeComponentTraitData } from "Types/NodeComponentTraitData.types";
import {
  LogicPlexusTrait,
  LogicPlexusTraitData,
} from "@divineplexus/core/Base/Traits/Logic/Logic.plexus.trait";
import { useWindow } from "Hooks/Windows/useWindow";
import { Button } from "Components/Button";
import { WindowedTrait } from "@divineplexus/core/Base/Traits/Interfaces/WindowedTrait.trait.interface";
import { LogicVariableCreateComponentTrait } from "./Variables/LogicVariablesCreate";
import { LogicImportsComponentTrait } from "./IO/LogicImports";
import { LogicImportComponentTrait } from "./IO/LogicImport";
import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { NumberComponentTrait } from "../Data/Types/Number.trait";
import { BooleanComponentTrait } from "../Data/Types/Boolean.trait";
import { StringComponentTrait } from "../Data/Types/String.trait";
import { NullComponentTrait } from "../Data/Types/Null.trait";
import { LogicArgumentsComponentTrait } from "./IO/LogicArguments";
import { LogicArgumentComponentTrait } from "./IO/LogicArgument";
import { Vec3ComponentTrait } from "../Data/Math/Vec3.data.trait";
import { Vec2ComponentTrait } from "../Data/Math/Vec2.data.trait";
import { TraitComponent } from "../TraitComponent";
import { LogicIOComponentTrait } from "./IO/LogicIO";
import { LogicOutputComponentTrait } from "./IO/LogicOutputs";
import { IOPositions, LogicGraphData } from "./Graph/LogicGraph.types";
import { LogicGraph } from "./Graph/Classes/LogicGraph";
import { LogicGraphComponent } from "./Graph";

type AllowedTraits = {
  dataType: DataTypes;
  traitType: string;
}[];
export type LogicComponentTraitData = TreeNodeComponentTraitData<
  LogicPlexusTraitData["properties"] & {
    allowedTraits: AllowedTraits;
    graph: LogicGraphData;
  }
>;

export class LogicComponentTrait
  extends TreeNodeComponentTraitBase<LogicComponentTraitData>
  implements WindowedTrait
{
  static Meta = {
    ...LogicPlexusTrait.Meta,
    icon: "logic",
    description: "Defines a block of logic.",
    flags: {},
    category: "logic",
    color: "#05cdff",
  };

  static PropertiesComponent({ trait }: { trait: LogicComponentTrait }) {
    const [openWindow, actions] = useWindow({
      title: trait.data.title ? trait.data.title : "Logic Editor",
      maximize: true,
      toolbar: false,
      location: false,
      menubar: false,
    });

    return (
      <>
        <Button
          onClick={() => {
            openWindow(
              <TraitComponent
                trait={trait}
                className="logic-editor"
                endButtons={
                  <>
                    <Button
                      icon="square"
                      onClick={() => {
                        actions.maximize();
                      }}
                    />
                    <Button
                      icon="delete"
                      onClick={() => {
                        actions.close();
                      }}
                    />
                  </>
                }
              >
                <LogicGraphComponent graph={trait.graph} />
              </TraitComponent>,
              (newWindow) => {
                trait.setWindow(newWindow);
              }
            );
          }}
        >
          Open Editor
        </Button>
      </>
    );
  }

  static GetBaseDataTypeTraits() {
    return {
      objects: [
        {
          dataType: DataTypes.Vector,
          traitType: Vec2ComponentTrait.Meta.id,
        },
        {
          dataType: DataTypes.Vector,
          traitType: Vec3ComponentTrait.Meta.id,
        },
      ],
      primitives: [
        {
          dataType: DataTypes.Number,
          traitType: NumberComponentTrait.Meta.id,
        },
        {
          dataType: DataTypes.Boolean,
          traitType: BooleanComponentTrait.Meta.id,
        },
        {
          dataType: DataTypes.String,
          traitType: StringComponentTrait.Meta.id,
        },
        {
          dataType: DataTypes.Null,
          traitType: NullComponentTrait.Meta.id,
        },
      ],
    } as const;
  }

  static CreateNew(
    overrides: Partial<LogicComponentTraitData>
  ): LogicComponentTraitData {
    return {
      id: shortId(),
      properties: {
        allowedTraits: [],
        graph: {
          transform: {
            zoom: 1,
            panX: 0,
            panY: 0,
          },
          nodes: [],
          edges: [],
        },
      },
      traits: [],
      traitType: LogicComponentTrait.Meta.id,
      ...overrides,
    };
  }

  graph: LogicGraph;

  constructor(data: LogicComponentTraitData, parent: any) {
    super(data, parent);
    this.graph = new LogicGraph(data.properties.graph, this);
    this.basePipelines.copy.regiser(this, (data) => {
      data.properties.graph = this.graph.toJSON();
      return data;
    });
    this.basePipelines.toJSON.regiser(this, (data) => {
      data.properties.graph = this.graph.toJSON();
      return data;
    });
  }
  async init() {
    if (!this.data.properties.graph.nodes.length) {
      const io = this.getTraitByClass<LogicIOComponentTrait>(
        LogicIOComponentTrait
      );
      if (!io) throw new Error(`Logic trait must have an io triat`);

      this.graph.nodes.add({
        id: io.id,
        name: io.data.title || io.getMeta().name,
        inputs: [],
        outputs: [
          {
            id: shortId(),
            name: "",
            type: "block",
            position: IOPositions.Bottom,
            maxConnections: 1,
            connectedEdges: [],
          },
        ],
        position: [LogicGraph.GraphCenter.x, LogicGraph.GraphCenter.y],
        scale: [1, 1],
      });
    }
  }

  logicParent: LogicComponentTrait = this;
  update(data: Partial<LogicComponentTraitData["properties"]>): void {
    this.data.properties = {
      ...this.data.properties,
      ...data,
    };
  }

  getClass() {
    return LogicComponentTrait;
  }

  getMeta() {
    return LogicComponentTrait.Meta;
  }

  getOutPuts() {
    return this.getTraitByClass(
      LogicIOComponentTrait
    )!.getTraitByClass<LogicOutputComponentTrait>(LogicOutputComponentTrait)!;
  }

  getArugments() {
    return this.getTraitByClass(
      LogicIOComponentTrait
    )!.getTraitByClass<LogicArgumentsComponentTrait>(
      LogicArgumentsComponentTrait
    )!;
  }

  getImports() {
    return this.getTraitByClass(
      LogicIOComponentTrait
    )!.getTraitByClass<LogicImportsComponentTrait>(LogicImportsComponentTrait)!;
  }

  getAllVariables(variable: any) {
    const vars: {
      name: string;
      dataType: DataTypes;
      traitType: string;
    }[] = [];
    for (const child of this.traverseTraits("down")) {
      if (variable == child) break;
      if (child instanceof LogicVariableCreateComponentTrait) {
        child.data.properties.name;
        vars.push({
          name: child.data.properties.name,
          dataType: child.dataType,
          traitType: child.getDataTypeTraitId(),
        });
      }
    }
    return vars;
  }

  getAllArguments() {
    const vars: {
      name: string;
      dataType: DataTypes;
      traitType: string;
    }[] = [];
    [];
    const inputsTrait = this.getTraitByClass(
      LogicIOComponentTrait
    )!.getTraitByClass<LogicArgumentsComponentTrait>(
      LogicArgumentsComponentTrait
    );
    if (!inputsTrait) return [];
    const inputs = inputsTrait.getTraitsByClass<LogicArgumentComponentTrait>(
      LogicArgumentComponentTrait
    )!;
    for (const trait of inputs) {
      vars.push({
        name: trait.data.properties.name,
        dataType: trait.dataType,
        traitType: trait.getDataTypeTraitId(),
      });
    }
    return vars;
  }

  getAllImports() {
    const vars: {
      name: string;
      dataType: DataTypes;
      importId: string;
      traitType: string;
    }[] = [];
    const inputsTrait = this.getTraitByClass(
      LogicIOComponentTrait
    )!.getTraitByClass<LogicImportsComponentTrait>(LogicImportsComponentTrait);
    if (!inputsTrait) return [];
    const inputs = inputsTrait.getTraitsByClass<LogicImportComponentTrait>(
      LogicImportComponentTrait
    )!;
    for (const trait of inputs) {
      vars.push({
        name: trait.data.properties.name,
        dataType: trait.dataType,
        traitType: trait.getDataTypeTraitId(),
        importId: trait.data.properties.importId,
      });
    }
    return vars;
  }
}
