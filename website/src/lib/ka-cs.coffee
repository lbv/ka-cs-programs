fs   = require 'fs'
glob = require 'glob'
path = require 'path'
yaml = require 'js-yaml'

module.exports =
    getPrograms: ->
        dataPattern = "#{process.cwd()}/data/*.yml"
        prgs = []
        for file in glob.sync dataPattern
            id = path.basename file, '.yml'
            yml = fs.readFileSync file, encoding: 'utf8'
            json = yaml.load yml
            prgs.push {
                img : "/img/programs/#{id}.png"
                url : "/programs/#{id}.html"
                title: json.title
                description: json.description
            }
        prgs
