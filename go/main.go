package main

// Import the package to access the Wasm environment
import (
	"encoding/json"
	"syscall/js"
)

type State struct {
	ticker string
	owner  string
}

// Main function: it sets up our Wasm application
func main() {
	// Define the function "MyGoFunc" in the JavaScript scope
	js.Global().Set("MyGoFunc", MyGoFunc())
	// Prevent the function from returning, which is required in a wasm module
	select {}
}

type Bird struct {
	Species     string
	Description string
}

// MyGoFunc returns a JavaScript function
func MyGoFunc() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		birdJson := `{"species": "pigeon","description": "likes to perch on rocks"}`
		var bird Bird
		json.Unmarshal([]byte(birdJson), &bird)
        data, _ := json.Marshal(bird)

        return string(data)
		/*m := make(map[string]interface{})
		  // Return a JS dictionary with two keys (of heterogeneous type)
		  j, _ := json.Marshal(State {
		      "PST",
		      "ppe",
		  })
		  json.Unmarshal(j, &m)
		  return m*/
	})
}
