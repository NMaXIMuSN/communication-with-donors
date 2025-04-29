export type SegmentFilter = {
  not: boolean;
  rules: SegmentFilterElem[];
  condition: 'OR' | 'AND';
};

export type SegmentFilterData = {
  importAttrName?: string;
  importGroupName?: string;
};
export type SegmentFilterRule = {
  id: string;
  field: string;
  type: DataType;
  operator: Operators;
  value: string | boolean;
  data: SegmentFilterData;
};
export type SegmentFilterElem = SegmentFilter | SegmentFilterRule;

export enum Operators {
  equal = 'equal',
  greater = 'greater',
  greater_or_equal = 'greater_or_equal',
  less = 'less',
  less_or_equal = 'less_or_equal',
  not_equal = 'not_equal',
  begins_with = 'begins_with',
  not_begins_with = 'not_begins_with',
  contains = 'contains',
  not_contains = 'not_contains',
  in = 'in',
  not_in = 'not_in',
  is_null = 'is_null',
  is_not_null = 'is_not_null',
  regexp = 'regexp',
  between = 'between',
}

type OperatorMapping = {
  [key in Operators]: string;
};

export const operatorMapper: OperatorMapping = {
  [Operators.equal]: '=',
  [Operators.greater]: '>',
  [Operators.greater_or_equal]: '>=',
  [Operators.less]: '<',
  [Operators.less_or_equal]: '<=',
  [Operators.not_equal]: '!=',
  [Operators.begins_with]: 'LIKE',
  [Operators.not_begins_with]: 'NOT LIKE',
  [Operators.contains]: 'LIKE',
  [Operators.not_contains]: 'NOT LIKE',
  [Operators.in]: 'IN',
  [Operators.not_in]: 'NOT IN',
  [Operators.is_null]: 'IS NULL',
  [Operators.is_not_null]: 'IS NOT NULL',
  [Operators.regexp]: 'REGEXP',
  [Operators.between]: 'BETWEEN',
};

export enum DataType {
  integer = 'integer',
  string = 'string',
  boolean = 'boolean',
  stringSelectize = 'string_select',
  date = 'date',
}
