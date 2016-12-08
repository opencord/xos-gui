export interface IXosTableConfigColumn {
    label: string;
    prop: string;
}

export interface IXosTableConfigActionCallback {
    (item: string): void;
}

export interface IXosTableConfigAction {
    label: string;
    cb: IXosTableConfigActionCallback
}

export interface IXosTableConfig {
    columns: IXosTableConfigColumn[];
    actions?: IXosTableConfigAction[];
}