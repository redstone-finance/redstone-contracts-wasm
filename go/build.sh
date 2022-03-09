mkdir -p .out
GOOS=js GOARCH=wasm go1.18rc1 build -o .out/contract.wasm main.go
