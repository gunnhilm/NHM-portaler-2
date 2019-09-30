const parse = require('csv-parse/lib/sync')
// const assert = require('assert')

const parseResults = (data) => {
    parse(data, {
        columns: true,
        quoting: false,
        delimiter: '\t',
        skip_empty_lines: true,
        header: true
    })
}

module.exports = parseResults