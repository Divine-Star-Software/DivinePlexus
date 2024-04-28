export interface WindowedTrait {
  isParentWidnow?(): boolean;
  isChildOfWindow?(): boolean;
  getParentWidnow?(): Window;
}
