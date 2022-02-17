const SerialAsTransformer = require("@serial-as/transform");
console.log(SerialAsTransformer);

const {Parser} = require("visitor-as/as");
const {utils} = require("visitor-as");

class ContractTransform extends SerialAsTransformer {
  parser

  visitFunctionDeclaration(node) {
    if (utils.hasDecorator(node, "contract")) {
      node.name.text = "__inner_handle";
      //console.log(node.body);
    }

    return super.visitFunctionDeclaration(node);
  }

  // "inspired" by https://github.com/three-em/3em/blob/main/helpers/assemblyscript/transform.js ;-)
  afterParse(parser) {
    this.parser = parser;
    const p = new Parser(this.parser.diagnostics);

    let sources = this.parser.sources.filter(utils.not(utils.isLibrary));
    let contract = sources.find(
      (source) =>
        source.simplePath !== "index-stub" && utils.isUserEntry(source),
    );

    this.parser.sources = this.parser.sources.filter((s) =>
      !utils.isUserEntry(s)
    );
    this.program.sources = this.program.sources.filter((s) =>
      !utils.isUserEntry(s)
    );

    p.parseFile(
      `
      ${contract.text}
      ${handle_wrapper}`,
      contract.normalizedPath,
      true,
    );

    let entry = p.sources.pop();
    //console.log(entry.text);
    this.program.sources.push(entry);
    this.parser.sources.push(entry);
    this.visit(sources);

    super.afterParse(parser);
  }

}

module.exports = ContractTransform


const handle_wrapper = `
export function handle(_action: string): string {
  const action = parse<ActionSchema>(_action);

  const result = __inner_handle(action);

  return stringify(result);
}

export function initState(state: string): void {
  contractState = parse<StateSchema>(state);
}

export function currentState(): string {
  return stringify<StateSchema>(contractState);
}

export const lang = "assemblyscript";
`;
