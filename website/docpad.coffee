fs   = require 'fs'
glob = require 'glob'
nomo = require 'node-monkey'
path = require 'path'
phi  = require 'docpad-phi'
util = require 'util'
yaml = require 'js-yaml'
_    = require 'underscore'

#nomo.start()

docpadConfig = {

    watchOptions:
        preferredMethods: [
            'watchFile',
            'watch'
        ]

    templateData:

        site:
            url: "http://lbv.github.io/ka-cs-programs"

            title: "KA CS"

            description: """
                Collection of assets created for the Khan Academy computer
                science platform.
            """

            keywords: """
                khan-academy, javascript, processing.js, programming, html,
                canvas, program, tutorial
            """

            styles: [
                '/vendor/normalize.css'
                '/vendor/unsemantic.css'
                '/vendor/zenburn.css'
                '/styles/global.css'
            ]

            scripts: [
                '/vendor/jquery.js'
            ]

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


    environments:
        development:
            templateData:
                site:
                    url: 'http://localhost:9778'

    plugins:
        robotskirt:
            robotskirtOptions:
                HTML_HARD_WRAP: false

        handlebars:
            helpers:
                pjsRef: (id) ->
                    url   = "http://processingjs.org/reference/#{id}/"
                    name  = id.replace /_$/, ''
                    title = "Processing.JS reference for #{name}"
                    """<a href="#{url}" title="#{title}">""" +
                    """<code>#{name}</code></a>"""

                kaExample: (title, url) ->
                    """
                      <p>
                        <strong>Example:</strong>
                        <a href="#{url}" title="See this example running!">
                          #{title}</a>
                      </p>
                    """

}

_.extend docpadConfig.templateData, phi

# Export our DocPad Configuration
module.exports = docpadConfig
