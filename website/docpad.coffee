rs   = require 'robotskirt'
util = require 'util'

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
}

# Export our DocPad Configuration
module.exports = docpadConfig
