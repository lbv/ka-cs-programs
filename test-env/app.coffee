express = require 'express'

app = express()

app.use express.logger()
app.use express.static "#{__dirname}/public"
app.listen 3333

console.log 'Listening on localhost:3333'
