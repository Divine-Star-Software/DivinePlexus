import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";
import { TraitComponent } from "../Traits/TraitComponent";

export function useComponentTrait({
  traits,
}: {
  traits: TreeNodeComponentTraitBase[];
}) {
  return traits.map((_) => () => {
    if (!_) {
      console.warn("TRAIT NOT FOUND");
      return <></>;
    }
    return <TraitComponent trait={_} />;
  });
}
