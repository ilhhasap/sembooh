const express = require('express')
const app = express()
const ejs = require('ejs')
const mysql = require('mysql')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const myConnection = require('express-myconnection')
const path = require('path')    

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

// Koneksi Database
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital'
});
conn.connect((err) => {
    if (err)
        throw err;
    console.log('Mysql Connected...');
});


// LINK
app.use('/', require('./routes/home.js'))
app.use('/homePerawat', require('./routes/homePerawat.js'))
app.use('/homeDokter', require('./routes/homeDokter.js'))
app.use('/homeKasir', require('./routes/homeKasir.js'))
app.use('/daftarPasien', require('./routes/daftarPasien.js'))
app.use('/pemeriksaanPasien', require('./routes/pemeriksaanPasien.js'))
app.use('/rekamMedis', require('./routes/rekamMedis.js'))
app.use('/dataResep', require('./routes/dataResep.js'))
app.use('/dataDiagnosa', require('./routes/dataDiagnosa.js'))
app.use('/dataPerawat', require('./routes/dataPerawat.js'))
app.use('/dataDokter', require('./routes/dataDokter.js'))
app.use('/dataRuangan', require('./routes/dataRuangan.js'))
app.use('/dataObat', require('./routes/dataObat.js'))
app.use('/login', require('./routes/login.js'))

app.listen(3000, () => {
    console.log('Server running at port 3000: http://127.0.0.1:3000')
})