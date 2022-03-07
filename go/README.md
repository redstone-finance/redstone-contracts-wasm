# Go smartweave example contract

Note: we're using `tinygo` compiler, as the default compiler produces huuuuge binaries 
(`hello world` example - ~2MB)
![img.png](img.png)

## How to use (default Go compiler)
- [Install easyjson](https://github.com/mailru/easyjson#install)
- Run `easyjson -all easyjson/easyjson.go`
- Build wasm contract file: `bash build.sh` (it should create `out` folder)
- Run wasm contract simulation: `node run.js`

## How to use (tinygo compiler)
- [Install tinygo](https://tinygo.org/getting-started/install/)
- [Install easyjson](https://github.com/mailru/easyjson#install)
- Run `easyjson -all easyjson/easyjson.go`
- Build wasm contract file: `bash build-tiny.sh` (it should create `out` folder)
- Run wasm contract simulation: `node run-tiny.js`

Size comparison for PST contract:  
![img_1.png](img_1.png)