doctype 5
html ->
  head ->
    @getBlock('meta').toHTML()
    @getBlock('styles').toHTML()
    text @googleWebFont 'Roboto:700'
    (link rel: 'stylesheet', href: @getUrl s) for s in @site.styles
    (script src: @getUrl s) for s in @site.scripts
    meta charset: 'utf-8'
    title @document.title

  body ->
    header class: 'grid-container site-header', ->
      div class: 'grid-100', ->
        span class: 'ka', 'KA'
        span class: 'cs', 'CS'
      div class: 'grid-100 tagline', ->
        span 'Coding for the Khan Academy computer science platform'
      text @getNav @document.nav if @document.nav?

    text @content

    footer class: 'grid-container', ->
      div class: 'grid-100 site-footer', ->
        p @lastUpdate()
        p ->
          a href: 'http://creativecommons.org/publicdomain/zero/1.0/',
            'No rights reserved'

    @getBlock('scripts').toHTML()
