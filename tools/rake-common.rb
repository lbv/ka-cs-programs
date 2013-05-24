require 'rake/clean'

CLOBBER.include("out/#{PRG}.js")
CLEAN.include('gen/top-summary.md')

tool_doc_top = "#{File.dirname(__FILE__)}/doc-top"

task :default => "out/#{PRG}.js"

@coffeeGen ||= []

@deps.push('gen/top-summary.md', "#{PRG}.m4")


@coffeeGen.each do |coffee|
	@deps.push "gen/#{coffee}.js"
	file "gen/#{coffee}.js" => [ "src/#{coffee}.coffee" ] do
		sh "coffee -b -o gen/ src/#{coffee}.coffee"
	end
end

file 'gen/top-summary.md' => [ 'info.yml' ] do
	sh tool_doc_top
end

file "out/#{PRG}.js" => @deps do
	sh "m4 -I ../../lib -P #{PRG}.m4 > out/#{PRG}.js"
end