const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const conn = mysql.createConnection(
    {host: 'localhost', user: 'root', password: '', database: 'hospital'}
);

//connect ke database
conn.connect((err) => {
    if (err) 
    throw err;
    console.log('Mysql Connected...');
});


router.get('/periksa', (req, res) => {
    let sql = "SELECT * FROM reg_pasien";
    let query = conn.query(sql, (err, result) => {
        if (err) 
            throw err;
        res.render('daftar', {
            title: "Halaman Periksa",
            result,
            panjang: results.length
        });
    });
})

module.exports = router