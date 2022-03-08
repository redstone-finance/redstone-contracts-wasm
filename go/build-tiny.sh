mkdir -p .out
tinygo build -o .out/contract_tiny.wasm -no-debug -target wasm main.go
