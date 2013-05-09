fs   = require 'fs'
glob = require 'glob'
path = require 'path'
yaml = require 'js-yaml'

module.exports =
    example: (title, url) ->
        """
          <p>
            <strong>Example:</strong>
            <a href="#{url}" title="See this example running!">#{title}</a>
          </p>
        """

    getExamples: ->
        dataFile = "#{process.cwd()}/data/examples.yml"
        yml = fs.readFileSync dataFile, encoding: 'utf8'
        yaml.load yml

    getOther: ->
        dataPattern = "#{process.cwd()}/src/documents/other/*.coffee"
        stuff = []
        for file in glob.sync dataPattern
            id = path.basename file, '.coffee'
            doc = require file
            stuff.push {
                title: doc.meta.title
                description: doc.meta.description
                url: "/other/#{id}.html"
            }

        stuff

    getPrograms: ->
        dataPattern = "#{process.cwd()}/data/programs/*.yml"
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

    getTutorials: ->
        dataPattern = "#{process.cwd()}/src/documents/tutorials/*.coffee"
        tutorials = []
        for file in glob.sync dataPattern
            id = path.basename file, '.coffee'
            doc = require file
            tutorials.push {
                title: doc.meta.title
                description: doc.meta.description
                url: "/tutorials/#{id}.html"
            }

        tutorials

    pjs: (id) ->
        url   = "http://processingjs.org/reference/#{id}/"
        name  = id.replace /_$/, ''
        title = "Processing.JS reference for #{name}"
        """<a href="#{url}" title="#{title}"><code>#{name}</code></a>"""

