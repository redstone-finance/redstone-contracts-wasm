export class Car {
  static readonly MAX_DOORS: i32 = 5;
  static readonly usualDoors: i32 = 3;

  numDoors: i32;
  private doorsOpen: bool = false;

  get isDoorsOpen(): bool { return this.doorsOpen; }
  set isDoorsOpen(value: bool) { this.doorsOpen = value; }

  constructor(numDoors: i32) {
    trace("WASM: car constructor");
    this.numDoors = numDoors;
  }

  openDoors(): bool {
    trace("WASM: openDoors");
    if (this.doorsOpen) return false;
    this.doorsOpen = true;
    return true;
  }

  closeDoors(): bool {
    trace("WASM: closeDoors");
    if (!this.doorsOpen) return false;
    this.doorsOpen = false;
    return true;
  }
}
