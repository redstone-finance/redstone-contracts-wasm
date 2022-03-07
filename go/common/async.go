package common

import (
	"bytes"
	"encoding/gob"
	"encoding/json"
	"syscall/js"
)

func Await(awaitable js.Value) ([]js.Value, []js.Value) {
	then := make(chan []js.Value)
	defer close(then)
	thenFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		then <- args
		return nil
	})
	defer thenFunc.Release()

	catch := make(chan []js.Value)
	defer close(catch)
	catchFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		catch <- args
		return nil
	})
	defer catchFunc.Release()

	awaitable.Call("then", thenFunc).Call("catch", catchFunc)

	select {
	case result := <-then:
		return result, nil
	case err := <-catch:
		return nil, err
	}
}

func ConvertInto(action map[string]interface{}, into interface {}) {
	jsonStr, _ := json.Marshal(action)
	json.Unmarshal(jsonStr, into)
}

func DeepCopy(src, dist interface{}) (err error){
	buf := bytes.Buffer{}
	if err = gob.NewEncoder(&buf).Encode(src); err != nil {
		return
	}
	return gob.NewDecoder(&buf).Decode(dist)
}
