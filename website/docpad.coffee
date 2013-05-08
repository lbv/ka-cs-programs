
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
