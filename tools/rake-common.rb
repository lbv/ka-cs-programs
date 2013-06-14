require 'rake/clean'

CLOBBER.include "out/#{PRG}.js"
CLEAN.include 'gen/top-summary.md'

tool_doc_top = "#{File.dirname(__FILE__)}/doc-top"

defaultFiles = [ "out/#{PRG}.js" ]

@coffee ||= []
@html   ||= []
@less   ||= []

dir_css = "assets/out/css"
dir_gen = "gen"
dir_htm = "assets/out/htm"
dir_out = "out"

directory dir_css
directory dir_gen
directory dir_htm
directory dir_out


@deps.push('gen/top-summary.md', "#{PRG}.m4", dir_out)


@coffee.each do |coffee|
	@deps.push "gen/#{coffee}.js"
	file "gen/#{coffee}.js" => [ "src/#{coffee}.coffee" ] do
		sh "coffee -b -o gen/ src/#{coffee}.coffee"
	end
end

@html.each do |htm|
	from = "assets/src/htm/#{htm}.htm"
	to   = "assets/out/htm/#{htm}.htm"

	defaultFiles.push to
	file to => [ from, dir_htm ] do
		sh "/opt/htmlcompressor/htmlcompressor -o #{to} #{from}"
	end
end

@less.each do |less|
	from = "assets/src/css/#{less}.less"
	to   = "assets/out/css/#{less}.css"

	defaultFiles.push to
	file to => [ from, dir_css ] do
		sh "lessc --yui-compress #{from} #{to}"
	end
end

file 'gen/top-summary.md' => [ 'info.yml', dir_gen ] do
	sh tool_doc_top
end

file "out/#{PRG}.js" => @deps do
	sh "m4 -I ../../lib -P #{PRG}.m4 > out/#{PRG}.js"
end

task :default => defaultFiles

desc 'Dropbots'
task :dropbox do
	from = "assets/out/"
	to   = "~/Dropbox/Public/assets/#{PRG}/"
	sh "rsync -vur --delete #{from} #{to}"
end
