// Code generated by easyjson for marshaling/unmarshaling. DO NOT EDIT.

package easyjson

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

func easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson(in *jlexer.Lexer, out *TransferAction) {
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
		case "function":
			out.Function = string(in.String())
		case "target":
			out.Target = string(in.String())
		case "qty":
			out.Qty = uint64(in.Uint64())
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
func easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson(out *jwriter.Writer, in TransferAction) {
	out.RawByte('{')
	first := true
	_ = first
	{
		const prefix string = ",\"function\":"
		out.RawString(prefix[1:])
		out.String(string(in.Function))
	}
	{
		const prefix string = ",\"target\":"
		out.RawString(prefix)
		out.String(string(in.Target))
	}
	{
		const prefix string = ",\"qty\":"
		out.RawString(prefix)
		out.Uint64(uint64(in.Qty))
	}
	out.RawByte('}')
}

// MarshalJSON supports json.Marshaler interface
func (v TransferAction) MarshalJSON() ([]byte, error) {
	w := jwriter.Writer{}
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson(&w, v)
	return w.Buffer.BuildBytes(), w.Error
}

// MarshalEasyJSON supports easyjson.Marshaler interface
func (v TransferAction) MarshalEasyJSON(w *jwriter.Writer) {
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson(w, v)
}

// UnmarshalJSON supports json.Unmarshaler interface
func (v *TransferAction) UnmarshalJSON(data []byte) error {
	r := jlexer.Lexer{Data: data}
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson(&r, v)
	return r.Error()
}

// UnmarshalEasyJSON supports easyjson.Unmarshaler interface
func (v *TransferAction) UnmarshalEasyJSON(l *jlexer.Lexer) {
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson(l, v)
}
func easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson1(in *jlexer.Lexer, out *PstState) {
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
		case "ticker":
			out.Ticker = string(in.String())
		case "name":
			out.Name = string(in.String())
		case "owner":
			out.Owner = string(in.String())
		case "evolve":
			out.Evolve = string(in.String())
		case "canEvolve":
			out.CanEvolve = bool(in.Bool())
		case "balances":
			if in.IsNull() {
				in.Skip()
			} else {
				in.Delim('{')
				out.Balances = make(map[string]uint64)
				for !in.IsDelim('}') {
					key := string(in.String())
					in.WantColon()
					var v1 uint64
					v1 = uint64(in.Uint64())
					(out.Balances)[key] = v1
					in.WantComma()
				}
				in.Delim('}')
			}
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
func easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson1(out *jwriter.Writer, in PstState) {
	out.RawByte('{')
	first := true
	_ = first
	{
		const prefix string = ",\"ticker\":"
		out.RawString(prefix[1:])
		out.String(string(in.Ticker))
	}
	{
		const prefix string = ",\"name\":"
		out.RawString(prefix)
		out.String(string(in.Name))
	}
	{
		const prefix string = ",\"owner\":"
		out.RawString(prefix)
		out.String(string(in.Owner))
	}
	{
		const prefix string = ",\"evolve\":"
		out.RawString(prefix)
		out.String(string(in.Evolve))
	}
	{
		const prefix string = ",\"canEvolve\":"
		out.RawString(prefix)
		out.Bool(bool(in.CanEvolve))
	}
	{
		const prefix string = ",\"balances\":"
		out.RawString(prefix)
		if in.Balances == nil && (out.Flags&jwriter.NilMapAsEmpty) == 0 {
			out.RawString(`null`)
		} else {
			out.RawByte('{')
			v2First := true
			for v2Name, v2Value := range in.Balances {
				if v2First {
					v2First = false
				} else {
					out.RawByte(',')
				}
				out.String(string(v2Name))
				out.RawByte(':')
				out.Uint64(uint64(v2Value))
			}
			out.RawByte('}')
		}
	}
	out.RawByte('}')
}

// MarshalJSON supports json.Marshaler interface
func (v PstState) MarshalJSON() ([]byte, error) {
	w := jwriter.Writer{}
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson1(&w, v)
	return w.Buffer.BuildBytes(), w.Error
}

// MarshalEasyJSON supports easyjson.Marshaler interface
func (v PstState) MarshalEasyJSON(w *jwriter.Writer) {
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson1(w, v)
}

// UnmarshalJSON supports json.Unmarshaler interface
func (v *PstState) UnmarshalJSON(data []byte) error {
	r := jlexer.Lexer{Data: data}
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson1(&r, v)
	return r.Error()
}

// UnmarshalEasyJSON supports easyjson.Unmarshaler interface
func (v *PstState) UnmarshalEasyJSON(l *jlexer.Lexer) {
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson1(l, v)
}
func easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson2(in *jlexer.Lexer, out *ForeignCallAction) {
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
		case "contractTxId":
			out.ContractTxId = string(in.String())
		case "function":
			out.Function = string(in.String())
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
func easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson2(out *jwriter.Writer, in ForeignCallAction) {
	out.RawByte('{')
	first := true
	_ = first
	{
		const prefix string = ",\"contractTxId\":"
		out.RawString(prefix[1:])
		out.String(string(in.ContractTxId))
	}
	{
		const prefix string = ",\"function\":"
		out.RawString(prefix)
		out.String(string(in.Function))
	}
	out.RawByte('}')
}

// MarshalJSON supports json.Marshaler interface
func (v ForeignCallAction) MarshalJSON() ([]byte, error) {
	w := jwriter.Writer{}
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson2(&w, v)
	return w.Buffer.BuildBytes(), w.Error
}

// MarshalEasyJSON supports easyjson.Marshaler interface
func (v ForeignCallAction) MarshalEasyJSON(w *jwriter.Writer) {
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson2(w, v)
}

// UnmarshalJSON supports json.Unmarshaler interface
func (v *ForeignCallAction) UnmarshalJSON(data []byte) error {
	r := jlexer.Lexer{Data: data}
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson2(&r, v)
	return r.Error()
}

// UnmarshalEasyJSON supports easyjson.Unmarshaler interface
func (v *ForeignCallAction) UnmarshalEasyJSON(l *jlexer.Lexer) {
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson2(l, v)
}
func easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson3(in *jlexer.Lexer, out *EvolveAction) {
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
		case "target":
			out.Value = string(in.String())
		case "function":
			out.Function = string(in.String())
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
func easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson3(out *jwriter.Writer, in EvolveAction) {
	out.RawByte('{')
	first := true
	_ = first
	{
		const prefix string = ",\"target\":"
		out.RawString(prefix[1:])
		out.String(string(in.Value))
	}
	{
		const prefix string = ",\"function\":"
		out.RawString(prefix)
		out.String(string(in.Function))
	}
	out.RawByte('}')
}

// MarshalJSON supports json.Marshaler interface
func (v EvolveAction) MarshalJSON() ([]byte, error) {
	w := jwriter.Writer{}
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson3(&w, v)
	return w.Buffer.BuildBytes(), w.Error
}

// MarshalEasyJSON supports easyjson.Marshaler interface
func (v EvolveAction) MarshalEasyJSON(w *jwriter.Writer) {
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson3(w, v)
}

// UnmarshalJSON supports json.Unmarshaler interface
func (v *EvolveAction) UnmarshalJSON(data []byte) error {
	r := jlexer.Lexer{Data: data}
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson3(&r, v)
	return r.Error()
}

// UnmarshalEasyJSON supports easyjson.Unmarshaler interface
func (v *EvolveAction) UnmarshalEasyJSON(l *jlexer.Lexer) {
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson3(l, v)
}
func easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson4(in *jlexer.Lexer, out *BalanceResult) {
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
		case "balance":
			out.Balance = uint64(in.Uint64())
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
func easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson4(out *jwriter.Writer, in BalanceResult) {
	out.RawByte('{')
	first := true
	_ = first
	{
		const prefix string = ",\"balance\":"
		out.RawString(prefix[1:])
		out.Uint64(uint64(in.Balance))
	}
	out.RawByte('}')
}

// MarshalJSON supports json.Marshaler interface
func (v BalanceResult) MarshalJSON() ([]byte, error) {
	w := jwriter.Writer{}
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson4(&w, v)
	return w.Buffer.BuildBytes(), w.Error
}

// MarshalEasyJSON supports easyjson.Marshaler interface
func (v BalanceResult) MarshalEasyJSON(w *jwriter.Writer) {
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson4(w, v)
}

// UnmarshalJSON supports json.Unmarshaler interface
func (v *BalanceResult) UnmarshalJSON(data []byte) error {
	r := jlexer.Lexer{Data: data}
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson4(&r, v)
	return r.Error()
}

// UnmarshalEasyJSON supports easyjson.Unmarshaler interface
func (v *BalanceResult) UnmarshalEasyJSON(l *jlexer.Lexer) {
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson4(l, v)
}
func easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson5(in *jlexer.Lexer, out *BalanceAction) {
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
		case "target":
			out.Target = string(in.String())
		case "function":
			out.Function = string(in.String())
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
func easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson5(out *jwriter.Writer, in BalanceAction) {
	out.RawByte('{')
	first := true
	_ = first
	{
		const prefix string = ",\"target\":"
		out.RawString(prefix[1:])
		out.String(string(in.Target))
	}
	{
		const prefix string = ",\"function\":"
		out.RawString(prefix)
		out.String(string(in.Function))
	}
	out.RawByte('}')
}

// MarshalJSON supports json.Marshaler interface
func (v BalanceAction) MarshalJSON() ([]byte, error) {
	w := jwriter.Writer{}
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson5(&w, v)
	return w.Buffer.BuildBytes(), w.Error
}

// MarshalEasyJSON supports easyjson.Marshaler interface
func (v BalanceAction) MarshalEasyJSON(w *jwriter.Writer) {
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson5(w, v)
}

// UnmarshalJSON supports json.Unmarshaler interface
func (v *BalanceAction) UnmarshalJSON(data []byte) error {
	r := jlexer.Lexer{Data: data}
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson5(&r, v)
	return r.Error()
}

// UnmarshalEasyJSON supports easyjson.Unmarshaler interface
func (v *BalanceAction) UnmarshalEasyJSON(l *jlexer.Lexer) {
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson5(l, v)
}
func easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson6(in *jlexer.Lexer, out *Action) {
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
		case "function":
			out.Function = string(in.String())
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
func easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson6(out *jwriter.Writer, in Action) {
	out.RawByte('{')
	first := true
	_ = first
	{
		const prefix string = ",\"function\":"
		out.RawString(prefix[1:])
		out.String(string(in.Function))
	}
	out.RawByte('}')
}

// MarshalJSON supports json.Marshaler interface
func (v Action) MarshalJSON() ([]byte, error) {
	w := jwriter.Writer{}
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson6(&w, v)
	return w.Buffer.BuildBytes(), w.Error
}

// MarshalEasyJSON supports easyjson.Marshaler interface
func (v Action) MarshalEasyJSON(w *jwriter.Writer) {
	easyjson8d5c760EncodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson6(w, v)
}

// UnmarshalJSON supports json.Unmarshaler interface
func (v *Action) UnmarshalJSON(data []byte) error {
	r := jlexer.Lexer{Data: data}
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson6(&r, v)
	return r.Error()
}

// UnmarshalEasyJSON supports easyjson.Unmarshaler interface
func (v *Action) UnmarshalEasyJSON(l *jlexer.Lexer) {
	easyjson8d5c760DecodeGithubComRedstoneFinanceRedstoneContractsWasmGoEasyjson6(l, v)
}
