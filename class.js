const fs = require("fs");
const loader = require("@assemblyscript/loader");

// https://github.com/AssemblyScript/assemblyscript/issues/261
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/optimized.wasm"),
  {}
);

const wasmExports = wasmModule.exports;

// using pointer to a class - as in https://www.assemblyscript.org/loader.html#custom-classes
const tokenPtr = wasmExports.getToken();
const token = wasmExports.Token.wrap(tokenPtr);
const { __getString, __newString } = wasmExports;

console.log("token name", __getString(token.name));
token.name = __newString("foobar");
console.log("token name", __getString(token.name));
console.log("token supply", BigInt(token.totalSupply).toString());
console.log(JSON.stringify(token));

// using class "directly" - as in
// https://github.com/AssemblyScript/assemblyscript/blob/main/lib/loader/tests/index.js#L255
const token2 = new wasmExports.Token(
  __newString("RedStone Token 2"),
  __newString("RDST2"),
  BigInt(20001)
);
console.log("token name 2", __getString(token2.name));
token2.name = __newString("foobar2");
console.log("token name 2", __getString(token2.name));
console.log("token supply 2", BigInt(token2.totalSupply).toString());
console.log(JSON.stringify(token2));
