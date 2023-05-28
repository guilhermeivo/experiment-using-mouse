import { dataTypes, isLiteral, isLogicalOperator, literal, operators } from "./dataTypes"

// https://sqlite.org/
// https://sqlite.org/lang_createtable.html
export const constraint = {
    primaryKey: 'PRIMARY KEY',
    notNull: 'NOT NULL',
    unique: 'UNIQUE',
    autoIncrement: 'AUTOINCREMENT'
}

export type optionsCreateTable = {
    ifNotExists?: boolean,
    reference?: any
}

export const createTableStatement = (tableName: string, columnDefinitions: any, options: optionsCreateTable) => {
    const {
        ifNotExists,
        reference
    } = options

    const columnDefinitionsSQL = getColumnDefinitions(columnDefinitions)
    const tableConstraintSQL = getTableConstraint(reference)

    const sql = ['CREATE', 'TABLE', ifNotExists ? 'IF NOT EXISTS' : '', tableName, '(', [columnDefinitionsSQL, tableConstraintSQL].filter(value => value).join(', '), ')']
        .filter(value => value).join(' ')

    return sql
}

// https://sqlite.org/lang_delete.html
export type optionsDelete = {
    where?: any,
}

export const deleteStatement = (table: string | Array<string>, options: optionsDelete): Array<string | Array<string>> => {
    const {
        where,
    } = options

    const tableSQL = getTable(table)
    const [ whereSQL, payloads ] = getWhere(where)

    const sql = ['DELETE', 'FROM', tableSQL, whereSQL].filter(value => value).join(' ')

    return [ sql, payloads ]
}

// https://sqlite.org/lang_update.html
export type optionsUpdate = {
    attributes?: any,
    where?: any,
}

export const updateStatement = (table: string | Array<string>, options: optionsUpdate): Array<string | Array<string>> => {
    const {
        attributes: setAttributes,
        where,
    } = options

    const [ setAttributesSQL, setPayloads ] = getSetAttributes(setAttributes)
    const tableSQL = getTable(table)
    const [ whereSQL, wherePayloads ] = getWhere(where)

    const sql = ['UPDATE', tableSQL, 'SET', setAttributesSQL, whereSQL].join(' ')

    return [ sql, [...setPayloads, ...wherePayloads] ]
}

// https://sqlite.org/lang_select.html
export type optionsSelect = {
    attributes?: any,
    where?: any,
    groupBy?: any,
    orderBy?: any,
    limit?: any
}

export const selectStatement = (table: string | Array<string>, options: optionsSelect): Array<string | Array<string>> => {
    const {
        attributes: resultColumns,
        where,
        groupBy,
        orderBy,
        limit
    } = options

    const resultColumnsSQL = getResultColumn(resultColumns)
    const tableSQL = getTable(table)
    const [ whereSQL, payloads ] = getWhere(where)
    const groupBySQL = getGroupBy(groupBy)
    const orderBySQL = getOrderBy(orderBy)
    const limitSQL = getLimit(limit)

    const sql = ['SELECT', resultColumnsSQL, 'FROM', tableSQL, whereSQL, groupBySQL, orderBySQL, limitSQL].join(' ')

    return [ sql, payloads ]
}

/* contents */
// column-def
const getColumnDefinitions = (columnDefinitions: any) => {
    return Object.keys(columnDefinitions).map(columnName => {
        let columnOptions = Object.keys(columnDefinitions[columnName]).map(key => {
            if (key === 'type') {
                // type-name
                const valueDataTypes = columnDefinitions[columnName][key] 
                if (Object.values(dataTypes).includes(valueDataTypes)) return valueDataTypes
            // column-constraint
            } else {
                if (Object.values(constraint).includes(key)) return key
            }
        }).join(' ')
        
        return `${ columnName } ${ columnOptions }`
    }).join(', ')
}

// table-constraint
const getTableConstraint = (tableConstraint: any) => {
    if (!tableConstraint) return

    return Object.keys(tableConstraint).map(attribute => {
        return Object.keys(tableConstraint[attribute]).map(foreignTable => {
            // foreign-key-clause
            const columnName = tableConstraint[attribute][foreignTable]
            return `FOREIGN KEY (${ attribute }) REFERENCES ${ foreignTable } (${ columnName })`
        })        
    }).join(', ')
}

const getTable = (table: string | Array<string>): string => {
    if (!table) throw new Error(`It is not possible to execute the select function without passing the 'table' attribute`)

    if (!isLiteral(table)) {
        // table-name, table-alias
        return table.join(' AS ')
    }

    // expression
    return table
}

const getWhere = (where: any): Array<string | Array<any>> => {
    if (!where) return ['', []]

    const payloads: Array<any> = []
    const sql = Object.keys(where).map(value => {
        const destructureAttribute = (name: string, attribute: literal | Array<literal> | any): string => {
            // { foo: 'bar' }
            if (isLiteral(attribute)) {
                payloads.push(attribute)
                return `${ name } ${ operators.equal } ?`
            }
    
            // { foo: ['bar', 'bar'] }
            if (Array.isArray(attribute)) {
                payloads.push(...attribute)
                return `${ name } ${ operators.in } (${ attribute.map(() => '?').join(', ') })`
            }
    
            // { foo: { [LIKE]: 'bar' } }
            // { [OR]: ['bar', 'bar'] }
            return Object.keys(attribute).map(operator => {
                if (isLogicalOperator(operator)) {
                    return attribute[operator].map((_attribute: literal | Array<literal> | any) => {
                        return destructureAttribute(name, _attribute)
                    }).join(` ${ operator } `)                    
                }

                payloads.push(attribute[operator])
                return `${ name } ${ operator } ?`
            }).join(` ${ operators.and } `)
        }

        // [AND]: [Attribute]
        if (isLogicalOperator(value)) {
            return Object.keys(where[value]).map(attribute => {
                return destructureAttribute(attribute, where[value][attribute])
            }).join(` ${ value } `)
        }

        // [Attribute]
        return destructureAttribute(value, where[value])
    }).join(` ${ operators.and } `)

    return [`WHERE ${ sql }`, payloads]
}

const getSetAttributes = (setAttributes: any): Array<string | Array<string>> => {
    const payloads: Array<any> = []

    const sql = Object.keys(setAttributes).map(attributes => {
        payloads.push(setAttributes[attributes])
        return `${ attributes } = ?`
    }).join(', ')

    return [sql, payloads]
}

const getResultColumn = (resultColumns: Array<string | Array<string>>): string => {
    if (!resultColumns) return '*'

    return resultColumns.map(resultColumn => {
        if (!isLiteral(resultColumn)) {
            // expression, column-alias
            return resultColumn.join(' AS ')
        }

        // expression
        return resultColumn
    }).join(', ')
}

const getGroupBy = (groupBy: string | Array<string>): string => {
    if (!groupBy) return ''

    if (!isLiteral(groupBy)) {
        // expression, expression, ...
        return `GROUP BY ${ groupBy.join(', ') }`
    }

    // expression
    return `GROUP BY ${ groupBy }`
}

const getOrderBy = (orderingTerm: string | Array<any>): string => {
    if (!orderingTerm) return ''

    if (!isLiteral(orderingTerm)) {
        return ''.concat('ORDER BY ', orderingTerm.map(value => {
            if (!isLiteral(value)) {
                return value.join(' ')
            }

            return value
        }).join(', '))
    }

    // expression
    return `ORDER BY ${ orderingTerm }`
}

const getLimit = (limit: literal | Array<literal> ): string => {
    if (!limit) return ''

    if (!isLiteral(limit)) {
        const [ expression, offset ] = limit

        return `LIMIT ${ expression } OFFSET ${ offset }`
    }

    return `LIMIT ${ limit }`
}