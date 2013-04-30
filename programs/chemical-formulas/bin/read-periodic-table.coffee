#! /usr/bin/env coffee

fs     = require 'fs'
{puts} = require 'util'

# Data taken from
# https://github.com/diniska/chemistry/blob/master/PeriodicalTable/periodicTable.json

puts "hi"
puts __dirname

json = fs.readFileSync "#{__dirname}/../data/periodicTable.json", encoding: 'utf8'
table = JSON.parse json

result = {}

for period, periodIdx in table.table
	for elem in period.elements
		abb  = elem.small
		result[abb] = [
			elem.name,
			elem.molar,
			elem.number,
			periodIdx + 1,
			elem.position + 1,
			elem.group
		]

out = JSON.stringify result, null, "\t"
puts "var Elements = #{out};"
