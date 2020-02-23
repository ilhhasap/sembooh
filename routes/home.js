const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital'
});

//connect ke database
conn.connect((err) => {
    if (err)
        throw err;
    console.log('Mysql Connected...');
});

router.get('/', (req, res) => {
    let pasien = "SELECT * FROM reg_pasien";
    let query = conn.query(pasien, (err, results) => {
        if (err)
            throw err;
        res.render('home', {
            title: "Halaman Home",
            results,
            antrian: results.length
        });
    });
})


module.exports = router