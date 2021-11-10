const fs = require("fs");
const loader = require("@assemblyscript/loader");

// https://github.com/AssemblyScript/assemblyscript/issues/261
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/optimized.wasm"),
  {}
);

const wasmExports = wasmModule.exports;

var car = new wasmExports.Car(5);
console.log("new car", car.isDoorsOpen);
car.openDoors();
console.log("open", car.isDoorsOpen);
car.closeDoors();
console.log("close", car.isDoorsOpen);
