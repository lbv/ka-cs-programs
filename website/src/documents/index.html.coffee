---
title: KA CS
layout: default
---
section id: 'intro', class: 'grid-container', ->
  div class: 'grid-100', ->
    h1 'Introduction'
    div @md """
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
    p class: 'sig', ->
      span class: 'name', 'Leonardo B'
      a {
        title: 'my K.A. profile',
        href: 'https://www.khanacademy.org/profile/lbv0112358/'
      }, ->
        img src: @getUrl '/img/ka-leaf.png', alt: 'my K.A. profile'

section id: 'programs', class: 'grid-container', ->
  div class: 'grid-100', ->
    h1 'Programs'
    for prg in @getPrograms()
      div ->
        img class: 'program-list-thumb', src: prg.img
        text @md """
          [**#{prg.title}**](#{@getUrl prg.url})
        """
        text @md prg.description
      div class: 'clear'
