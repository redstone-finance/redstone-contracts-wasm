export declare interface Contract {
  id(): string;
  owner: string;
};

declare function contract(a: any): any;

export declare namespace SmartWeave {
  function id(): string;
  function contract(): Contract;
}





