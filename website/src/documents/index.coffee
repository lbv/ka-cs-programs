ka = require '../lib/ka-cs'
(require 'phi-teacup').dsl()

template = (site) ->
  section '#intro.grid-100', ->
    h1 'Introduction'
    markdown """
      Welcome. This is the place where I've collected some of the things
      I've created using the [Computer
      Science](http://www.khanacademy.org/cs) platform in the [Khan
      Academy](http://www.khanacademy.org/). Everything here (code,
      documentation, etc.) is released into the public domain, and available
      on [GitHub](https://github.com/lbv/ka-cs-programs).

      If you want to get in touch with me, feel free to write a
      question/comment on any of my programs. Have fun...
    """
    p '.sig', ->
      span '.name', 'Leonardo B'
      a {
        title: 'my K.A. profile',
        href: 'https://www.khanacademy.org/profile/lbv0112358/'
      }, ->
        img src: 'img/ka-leaf.png', alt: 'my K.A. profile'

  section '#programs.grid-100', ->
    h1 'Programs'
    programs = ka.getPrograms()
    n = programs.length
    displayPrg = renderable (prg) ->
      div '.grid-50', ->
        a href: prg.url, ->
          img '.program-list-thumb', src: prg.img
        markdown """
          [**#{prg.title}**](#{prg.url})
        """
        markdown prg.description

    for i in [0...n] by 2
      div ->
        displayPrg programs[i]
        displayPrg programs[i+1] if i+1 < n
      div '.clear'

  section '#tutorials.grid-100', ->
    h1 'Short Tutorials'
    for tut in ka.getTutorials()
      div '.grid-30.tutorial-title', ->
        markdown """
          [**#{tut.title}**](#{tut.url})
        """
      div '.grid-70', ->
        markdown tut.description

  section '#examples.grid-100', ->
    h1 'Short Examples'
    examples = ""
    examples += "* [**#{ex.title}**](#{ex.url})\n" for ex in ka.getExamples()
    div ->
      markdown examples
    div '.clear'

  section '#other.grid-100', ->
    h1 'Other Resources'
    for stuff in ka.getOther()
      div '.grid-30.tutorial-title', ->
        markdown """
          [**#{stuff.title}**](#{stuff.url})
        """
      div '.grid-70', ->
        markdown stuff.description


module.exports = useLayout 'index', template, doc: meta
