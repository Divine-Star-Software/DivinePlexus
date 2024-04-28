import {
  PlexusComponentData,
  PlexusNodeData,
  PlexusNodeMetaData,
} from "../Types/PlexusNode.types";
import {
  PlexusNodeComponentBase,
  PlexusNodeComponentBaseClassInterface,
} from "./PlexusNodeComponentBase";
import { PlexusNodeRegister } from "./PlexusNodeRegister";
export interface PlexusNodeBaseClassInterface<
  Data extends PlexusNodeData = PlexusNodeData<any>,
  NodeClass extends PlexusNodeBase<Data> = PlexusNodeBase<Data>
> {
  Meta: PlexusNodeMetaData;
  new (data: Data): NodeClass;
}

export abstract class PlexusNodeBase<
  Data extends PlexusNodeData = PlexusNodeData<any>
> {
  abstract init(): void;
  components: PlexusNodeComponentBase<any>[] = [];

  constructor(public data: Data) {
    for (const component of data.components) {
      this.addComponent(component);
    }
  }
  initComponents() {
    this.components.forEach((_) => {
      _.init();
      _.initTraits();
    });
  }

  addComponent(data: PlexusComponentData<any>) {
    const componentClass = PlexusNodeRegister.getComponentsByType(
      data.componentType
    );
    if (!componentClass) return false;
    this.components.push(new componentClass(data, this));
  }
  getComponent<Component extends PlexusNodeComponentBase<any>>(
    type: string
  ): Component | undefined {
    return this.components.find((_) => _.data.componentType == type) as any;
  }
  getComponentByClass<Component extends PlexusNodeComponentBase<any>>(
    componentClass: PlexusNodeComponentBaseClassInterface
  ): Component | undefined {
    return this.components.find(
      (_) => _.data.componentType == componentClass.Meta.id
    ) as any;
  }
  removeComponent(type: string) {
    const componentIndex = this.components.findIndex(
      (_) => _.data.componentType == type
    );
    if (componentIndex === -1) return false;
    this.components.splice(componentIndex, 1);
    return true;
  }

  abstract getClass(): PlexusNodeBaseClassInterface<Data>;
}
