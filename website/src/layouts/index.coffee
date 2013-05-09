(require 'phi-teacup').dsl()

template = (content, data) ->
  doctype 5
  html ->
    head ->
      docHead data
      googleWebFont 'Roboto:700'

    body ->
      header '.grid-container.site-header', ->
        div '.grid-100', ->
          span '.ka', 'KA'
          span '.cs', 'CS'
        div '.grid-100.tagline', ->
          span 'Coding for the Khan Academy computer science platform'
        docNav data

      section '.grid-container.site-body', ->
        content data

      footer '.grid-container', ->
        div '.grid-100.site-footer', ->
          lastUpdate()
          license()

module.exports = renderable template
