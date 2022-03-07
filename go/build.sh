# tinygo build -o out/contract.wasm -target wasm contract.go
GOOS=js GOARCH=wasm go build -o out/contract.wasm contract.go
