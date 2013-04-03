docpadConfig = {

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


            # -----------------------------
            # Helper Functions

            # Get the prepared site/document title
            # Often we would like to specify particular formatting to our
            # page's title we can apply that formatting here
            getPreparedTitle: ->
                # if we have a document title, then we should use that and
                # suffix the site's title onto it
                if @document.title
                    "#{@document.title} | #{@site.title}"
                # if our document does not have it's own title, then we
                # should just use the site's title
                else
                    @site.title

                # Get the prepared site/document description
                getPreparedDescription: ->
                    # if we have a document description, then we should use
                    # that, otherwise use the site's description
                    @document.description or @site.description

                # Get the prepared site/document keywords
                getPreparedKeywords: ->
                    # Merge the document keywords with the site keywords
                    @site.keywords.concat(@document.keywords or []).join(', ')


    # =================================
    # DocPad Events

    # Here we can define handlers for events that DocPad fires
    # You can find a full listing of events on the DocPad Wiki
    events:

        # Server Extend
        # Used to add our own custom routes to the server before the docpad
        # routes are added
        serverExtend: (opts) ->
            # Extract the server from the options
            {server} = opts
            docpad = @docpad

            # As we are now running in an event,
            # ensure we are using the latest copy of the docpad configuraiton
            # and fetch our urls from it
            latestConfig = docpad.getConfig()
            oldUrls = latestConfig.templateData.site.oldUrls or []
            newUrl = latestConfig.templateData.site.url

            # Redirect any requests accessing one of our sites oldUrls to the new site url
            server.use (req,res,next) ->
                if req.headers.host in oldUrls
                    res.redirect(newUrl+req.url, 301)
                else
                    next()
}

# Export our DocPad Configuration
module.exports = docpadConfig
