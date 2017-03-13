import {IXosServiceGraph} from '../interfaces';

export interface IXosServiceGraphReducers {
  coarse: IXosServiceGraphReducer[],
  finegrained: IXosServiceGraphReducer[]
}

export interface IXosServiceGraphReducer {
  name: string,
  reducer: IXosServiceGraphReducerFn
}

export interface IXosServiceGraphReducerFn {
  (graph: IXosServiceGraph): IXosServiceGraph
}

export interface IXosServiceGraphExtender {
  register(type: 'coarse' | 'finegrained', name: string, reducer: IXosServiceGraphReducerFn): boolean;
  getCoarse(): IXosServiceGraphReducer[];
  getFinegrained(): IXosServiceGraphReducer[];
}

export class XosServiceGraphExtender implements IXosServiceGraphExtender {

  static $inject = ['$log'];

  private reducers: IXosServiceGraphReducers = {
    coarse: [],
    finegrained: []
  };

  constructor (
    private $log: ng.ILogService
  ) {
  }

  public getCoarse(): IXosServiceGraphReducer[] {
    return this.reducers.coarse;
  }

  public getFinegrained(): IXosServiceGraphReducer[] {
    return this.reducers.finegrained;
  }

  public register(type: 'coarse' | 'finegrained', name: string, reducer: IXosServiceGraphReducerFn): boolean {
    this.$log.debug(`[XosServiceGraphExtender] Registering ${name} reducer in ${type} list`);
    this.reducers[type].push({
      name,
      reducer
    });
    return false;
  }
}