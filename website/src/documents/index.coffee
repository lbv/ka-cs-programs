ka = require '../lib/ka-cs'
(require 'phi-teacup').dsl()

template = (site) ->
  section '#intro.grid-100', ->
    h1 'Introduction'
    markdown """
      Welcome. This is the place where I've collected some of the things
      I've created using the [Computer
      Science](http://www.khanacademy.org/cs) platform in the [Khan
      Academy](http://www.khanacademy.org/).

      Everything here (code, documentation, etc.) is released into the
      public domain, and available on
      [GitHub](https://github.com/lbv/ka-cs-programs).

      If you want to get in touch with me, feel free to write a
      question/comment on any of my programs.

      Have fun...
    """
    p '.sig', ->
      span '.name', 'Leonardo B'
      a {
        title: 'my K.A. profile',
        href: 'https://www.khanacademy.org/profile/lbv0112358/'
      }, ->
        img src: '/img/ka-leaf.png', alt: 'my K.A. profile'

  section '#programs.grid-100', ->
    h1 'Programs'
    for prg in ka.getPrograms()
      div ->
        img '.program-list-thumb', src: prg.img
        markdown """
          [**#{prg.title}**](#{prg.url})
        """
        markdown prg.description
      div '.clear'

  section '#tutorials.grid-100', ->
    h1 'Short Tutorials'
    for tut in ka.getTutorials()
      div '.grid-20.tutorial-title', ->
        markdown """
          [**#{tut.title}**](#{tut.url})
        """
      div '.grid-80', ->
        markdown tut.description

  section '#examples.grid-100', ->
    h1 'Short Examples'
    for ex in ka.getExamples()
      div ->
        markdown "[**#{ex.title}**](#{ex.url})"
      div '.clear'

module.exports = useLayout 'default', template, doc: meta
