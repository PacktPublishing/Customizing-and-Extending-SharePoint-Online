declare interface IArchiveItemCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'ArchiveItemCommandSetStrings' {
  const strings: IArchiveItemCommandSetStrings;
  export = strings;
}
