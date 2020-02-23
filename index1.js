const express = require('express')
const mysql = require('mysql')
const app = express()
const JSON = require('circular-json')
const exphbs = require('express-handlebars')
// const connection  = require('express-myconnection')


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hospital'
})

connection.connect()

const conn = connection.query('SELECT * FROM reg_pasien', function (err, rows, fields) {
  if (err) throw err

  return console.log('The solution is: ', rows)
})

app.get('/', (req, res) => {
    res.render('index', JSON.stringify(conn))
})


connection.end()

app.listen(3000)