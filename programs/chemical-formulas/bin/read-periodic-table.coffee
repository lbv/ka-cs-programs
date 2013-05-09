#! /usr/bin/env coffee

fs     = require 'fs'
{puts} = require 'util'

# Data taken from
# https://github.com/diniska/chemistry/blob/master/PeriodicalTable/periodicTable.json

json = fs.readFileSync "#{__dirname}/../data/periodicTable.json", encoding: 'utf8'
table = JSON.parse json

result = {}

readElement = (elem) ->
    abb  = elem.small
    result[abb] = [
        elem.name,
        elem.molar,
        elem.number,
        periodIdx + 1,
        elem.position + 1,
        elem.group
    ]

for section of table
    # puts "Processing #{section}..."
    for period, periodIdx in table[section]
        if period.elements?
            readElement elem for elem in period.elements
        else
            readElement period


out = JSON.stringify result, null, "\t"
puts "var Elements = #{out};"
