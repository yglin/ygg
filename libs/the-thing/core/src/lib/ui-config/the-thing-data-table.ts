export interface DataTableColumnConfig {
  name: string;
  label: string;
  valueSource: 'cell' | 'meta' | 'function'
  value?: any;
}

export interface DataTableConfig {
  columns: {
    [key: string]: DataTableColumnConfig;
  };
}
