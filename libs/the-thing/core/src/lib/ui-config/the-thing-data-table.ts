export interface DataTableColumnConfig {
  name: string;
  label: string;
  valueSource: 'cell' | 'meta' | 'function' | 'users'
  value?: any;
}

export interface DataTableConfig {
  columns: {
    [key: string]: DataTableColumnConfig;
  };
}
