doctype 5
html ->
  head ->
    meta charset: 'utf-8'
    title 'Khan Academy CS Programs'
  body ->
    div id: 'intro', class: 'grid-container', ->
      div class: 'grid-100', ->
        h1 'Introduction'
        p """
          Welcome. This is the list of programs I've created for the <a
          href="http://www.khanacademy.org/cs">Computer Science</a> platform
          in the <a href="http://www.khanacademy.org/">Khan Academy</a>.
        """
        p """
          All these programs are released into the public domain, and
          available on <a
            href="https://github.com/lbv/ka-cs-programs">GitHub</a>. You may
          also visit my <a
            href="https://www.khanacademy.org/profile/lbv0112358/">public
            profile</a> on K.A., and if you want to get in touch with me,
          feel free to write a question/comment on any of my programs.
        """
        p 'Have fun...'
        p class: 'sig', 'Leonardo B'
