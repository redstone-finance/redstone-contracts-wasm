# tinygo build -o out/impl.wasm -target wasm impl.go
GOOS=js GOARCH=wasm go build -o out/contract.wasm main.go
