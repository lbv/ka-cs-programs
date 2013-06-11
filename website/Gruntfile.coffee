path = require 'path'

siteDev =
    base: 'http://localhost:11235/'
    title: 'KA CS'
    styles: [
        'css/vendor/normalize.css'
        'css/vendor/unsemantic.css'
        'css/vendor/highlight/pojoaque.css'
        'css/global.css'
    ]
    scripts: []

siteProduction =
    base: 'http://lbv.github.io/ka-cs-programs/'
    title: 'KA CS'
    description: """
        Collection of assets created for the Khan Academy computer science
        platform.
    """
    styles: [
        'css/vendor/normalize.css'
        'css/vendor/unsemantic.css'
        'css/vendor/zenburn.css'
        'css/global.css'
    ]
    scripts: []


module.exports = (grunt) ->
    getLayouts = ->
        layouts = {}
        grunt.file.recurse './src/layouts', (abs) ->
            id = path.basename abs, '.coffee'
            layouts[id] = require "./#{abs}"
        layouts

    teacupPlugin = ->
        opt = @options()
        layouts = getLayouts()

        for file in @files
            doc = ""
            for src in file.src
                tpl = require "./#{src}"
                tpl = tpl.template unless typeof tpl is 'function'
                doc += tpl layouts, site: opt.site

            dir = path.dirname file.dest
            grunt.file.mkdir dir
            grunt.log.writeln "Writing to #{file.dest}"
            grunt.file.write file.dest, doc


    grunt.initConfig

        pkg: grunt.file.readJSON 'package.json'

        copy:
            main:
                files: [
                    {
                        expand: true
                        cwd: 'src/files/'
                        src: [ '**' ]
                        dest: 'out/'
                    }
                ]

        express:
            server:
                options:
                    port: 11235
                    bases: 'out'

        less:
            dev:
                files: [
                    {
                        expand: true
                        cwd: 'src/documents/'
                        src: [ '**/*.less' ]
                        dest: 'out/'
                        ext: '.css'
                    }
                ]
            production:
                options:
                    yuicompress: true
                files: '<%= less.dev.files %>'

        teacup:
            dev:
                options:
                    site: siteDev

                files: [
                    {
                        expand: true
                        cwd: 'src/documents/'
                        src: [ '**/*.coffee' ]
                        dest: 'out/'
                        ext: '.html'
                    }
                ]
            production:
                options:
                    site: siteProduction
                files: '<%= teacup.dev.files %>'

        watch:
            coffeeFiles:
                files: 'src/documents/**/*.coffee'
                tasks: [ 'teacup:dev' ]
            staticFiles:
                files: 'src/files/**',
                tasks: [ 'copy' ]
            cssFiles:
                files: 'src/documents/**/*.less'
                tasks: [ 'less' ]

    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-less'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-express'

    grunt.registerMultiTask 'teacup', 'Render Teacup templates', teacupPlugin

    grunt.registerTask 'default', [ 'copy', 'less:dev', 'teacup:dev' ]

    grunt.registerTask 'production', [
        'copy', 'less:production', 'teacup:production' ]
