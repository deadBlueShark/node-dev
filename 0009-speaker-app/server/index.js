// System module
const express = require('express')

// Custom module
const routes = require('./routes')

const app = express()

// Middleware
app.use(express.static('public'))
app.use('/', routes())

app.listen(8000)

module.export = app
