// https://dev.mysql.com/doc/refman/8.0/en/data-types.html
export const dataTypes = {
    STRING: 'TEXT',
    NUMBER: 'INTEGER',
    BOOL: 'BOOLEAN',
    REAL: 'REAL',
    DATE: 'DATE',
    NUMERIC: 'NUMERIC'
}

export type literal = number | string

export const isLiteral = (x: any): x is literal => {
    return isNumber(x) || isString(x)
}

const isNumber = (x: any): x is number => {
    return typeof x === 'number'
}
   
const isString = (x: any): x is string => {
    return typeof x === 'string'
}

const isOperator = (x: any) => {
    return Object.values(operators).includes(x)
}

export const isLogicalOperator = (x: any) => {
    return isOperator(x) && (x === operators.and || x === operators.or)
}

// https://dev.mysql.com/doc/refman/8.0/en/non-typed-operators.html
export const operators = {
    and: 'AND',
    or: 'OR',
    equal: '=',
    notEqual: '!=',
    greater: '>',
    greaterEqual: '>=',
    less: '<',
    lessEqual: '<=',
    is: 'IS',
    not: 'NOT',
    like: 'LIKE',
    notLike: 'NOT LIKE',
    glob: 'GLOB',
    regexp: 'REGEXP',
    notRegexp: 'NOT REGEXP',
    in: 'IN'
}