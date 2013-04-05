fs   = require 'fs'
glob = require 'glob'
nomo = require 'node-monkey'
path = require 'path'
rs   = require 'robotskirt'
util = require 'util'
yaml = require 'js-yaml'

# nomo.start()
mdParser = rs.Markdown.std()

docpadConfig = {

    watchOptions:
        preferredMethods: [
            'watchFile',
            'watch'
        ]

    templateData:

        site:
            url: "http://lbv.github.com/ka-cs-programs"

            title: "Khan Academy CS Programs"

            description: """
                Programs written for the Khan Academy Computer Science
                platform.
            """

            keywords: """
                khan-academy, javascript, processing.js, programming
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

        # MarkDown parser utility
        md: (str) ->
            str = rs.smartypantsHtml str
            mdParser.render str

        getUrl: (relUrl) ->
            "#{@site.url}#{relUrl}"

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

        getNav: (nav) ->
            html = ''
            for n in nav
                html += "<span> &#8883; </span>" if html != ''
                if n.url?
                    html += """<a href="#{@getUrl n.url}">#{n.name}</a>"""
                else
                    html += """<span>#{n.name}</span>"""
            html = """
              <nav class="grid-100">
                #{html}
              </nav>
            """

        googleWebFont: (name) ->
            "<link href=\"http://fonts.googleapis.com/css?family=#{name}\"" +
            "rel=\"stylesheet\" type=\"text/css\" />"

        lastUpdate: ->
            d = new Date

            yy = d.getFullYear()
            mm = d.getMonth().toString()
            dd = d.getDay().toString()

            mm = "0#{mm}" if mm.length < 2
            dd = "0#{dd}" if dd.length < 2
            "Last update: #{yy}-#{mm}-#{dd}"

    environments:
        development:
            templateData:
                site:
                    url: 'http://localhost:9778'

    plugins:
        robotskirt:
            robotskirtOptions:
                HTML_HARD_WRAP: false
}

# Export our DocPad Configuration
module.exports = docpadConfig
