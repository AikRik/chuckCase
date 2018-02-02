"use strict"
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const session = require("express-session")
const pg = require("pg")
app.use("/public", express.static("public"))

require("dotenv").load()

const Client = pg.Client

const client = new Client({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port
})

client.connect()

app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
	secret: '2C44-4D44-WppQ38S',
	resave: true,
	saveUnititialized: true
}))

app.set("view engine", "pug")
require("./routes/index.js")(app,client)
require("./routes/addFavorite.js")(app,client)
require("./routes/signup.js")(app, client, bcrypt)
require("./routes/login.js")(app, client, bcrypt)
require("./routes/logout.js")(app)
require("./routes/deleteJoke.js")(app,client)

app.listen(process.env.webport || 3004)