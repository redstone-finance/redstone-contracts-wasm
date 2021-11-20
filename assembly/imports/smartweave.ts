export declare interface Contract {
  id(): string;
  owner: string;
};

export declare namespace SmartWeave {
  function id(): string;
  function contract(): Contract;
}





