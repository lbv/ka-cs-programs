doctype 5
html ->
  head ->
    @getBlock('meta').toHTML()
    @getBlock('styles').toHTML()
    (link rel: 'stylesheet', href: s) for s in @site.styles
    (script src: s) for s in @site.scripts
    meta charset: 'utf-8'
    title @document.title

  body ->
    header class: 'grid-container', ->
      div class: 'grid-100', ->
        span class: 'title', "lbv's Khan Academy Corner"
    text @content
    @getBlock('scripts').toHTML()
