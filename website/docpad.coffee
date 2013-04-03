rs = require 'robotskirt'

mdParser = rs.Markdown.std()

docpadConfig = {

    watchOptions:
        preferredMethods: [
            'watchFile',
            'watch'
        ]

    templateData:

        site:
            # The production url of our website
            url: "http://lbv.github.com/ka-cs-programs/"

            # The default title of our website
            title: "Khan Academy CS Programs"

            # The website description (for SEO)
            description: """
                Programs written for the Khan Academy Computer Science
                platform.
            """

            # The website keywords (for SEO) separated by commas
            keywords: """
                khan-academy, javascript, processing.js, programming
            """

            # The website's styles
            styles: [
                '/vendor/normalize.css'
                '/vendor/unsemantic.css'
                '/styles/global.css'
            ]

            # The website's scripts
            scripts: [
                '/vendor/jquery.js'
            ]

        # MarkDown parser utility
        md: (str) ->
            str = rs.smartypantsHtml str
            mdParser.render str

}

# Export our DocPad Configuration
module.exports = docpadConfig
