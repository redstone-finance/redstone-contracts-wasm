mkdir -p .out
GOOS=js GOARCH=wasm go build -o .out/contract.wasm main.go
