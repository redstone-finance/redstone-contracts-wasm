// Code generated by easyjson for marshaling/unmarshaling. DO NOT EDIT.

package demo

import (
	json "encoding/json"
	easyjson "github.com/mailru/easyjson"
	jlexer "github.com/mailru/easyjson/jlexer"
	jwriter "github.com/mailru/easyjson/jwriter"
)

// suppress unused package warning
var (
	_ *json.RawMessage
	_ *jlexer.Lexer
	_ *jwriter.Writer
	_ easyjson.Marshaler
)

func easyjson70e345a5DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoDemo(in *jlexer.Lexer, out *AwesomeStruct) {
	isTopLevel := in.IsStart()
	if in.IsNull() {
		if isTopLevel {
			in.Consumed()
		}
		in.Skip()
		return
	}
	in.Delim('{')
	for !in.IsDelim('}') {
		key := in.UnsafeFieldName(false)
		in.WantColon()
		if in.IsNull() {
			in.Skip()
			in.WantComma()
			continue
		}
		switch key {
		case "Foo":
			out.Foo = string(in.String())
		case "Bar":
			out.Bar = string(in.String())
		default:
			in.SkipRecursive()
		}
		in.WantComma()
	}
	in.Delim('}')
	if isTopLevel {
		in.Consumed()
	}
}
func easyjson70e345a5EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoDemo(out *jwriter.Writer, in AwesomeStruct) {
	out.RawByte('{')
	first := true
	_ = first
	{
		const prefix string = ",\"Foo\":"
		out.RawString(prefix[1:])
		out.String(string(in.Foo))
	}
	{
		const prefix string = ",\"Bar\":"
		out.RawString(prefix)
		out.String(string(in.Bar))
	}
	out.RawByte('}')
}

// MarshalJSON supports json.Marshaler interface
func (v AwesomeStruct) MarshalJSON() ([]byte, error) {
	w := jwriter.Writer{}
	easyjson70e345a5EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoDemo(&w, v)
	return w.Buffer.BuildBytes(), w.Error
}

// MarshalEasyJSON supports easyjson.Marshaler interface
func (v AwesomeStruct) MarshalEasyJSON(w *jwriter.Writer) {
	easyjson70e345a5EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoDemo(w, v)
}

// UnmarshalJSON supports json.Unmarshaler interface
func (v *AwesomeStruct) UnmarshalJSON(data []byte) error {
	r := jlexer.Lexer{Data: data}
	easyjson70e345a5DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoDemo(&r, v)
	return r.Error()
}

// UnmarshalEasyJSON supports easyjson.Unmarshaler interface
func (v *AwesomeStruct) UnmarshalEasyJSON(l *jlexer.Lexer) {
	easyjson70e345a5DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoDemo(l, v)
}
