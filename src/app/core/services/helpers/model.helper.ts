export interface IXosModelHelpersService {
  urlFromCoreModel(name: string): string;
}

export class ModelHelpers {
  urlFromCoreModel(name: string): string {
    return `/core/${name.toLowerCase()}s`;
  }
}
