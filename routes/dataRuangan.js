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
    let sql = "SELECT * FROM ruangan";
    let query = conn.query(sql, (err, result) => {
        if (err)
            throw err;
        if ( !req.session.loggedin && !req.session.username ) {
            res.redirect('/login') 
        } else if(req.session.username) {
        res.render('dataRuangan', {
            title: "Data Ruangan",
            result,session:req.session.username,
            panjang: result.length
        })
    }
    })
})

router.post('/', async (req, res) => {
    try {
        const kode_ruang = req.body.kode_ruang
        const nama_ruang = req.body.nama_ruang
        const kelas = req.body.kelas
        const no_kamar = req.body.no_kamar
        const tarif_kamar = req.body.tarif_kamar
        const status_kamar = req.body.status_kamar

        let sql = await "INSERT INTO ruangan VALUES ('" + kode_ruang + "', '" + nama_ruang + "', '" + kelas + "', '" + no_kamar + "', '" + tarif_kamar + "', '" + status_kamar + "')";

        const query = conn.query(sql, (err, result) => {
            if (err)
                throw err;
            console.log("1 record inserted");
            res.redirect('/dataRuangan');
            res.end();
        });
    } catch (error) {
        console.log(error)
    }
})

router.get('/detailRuangan/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM ruangan WHERE kode_ruang = ${id}`;

    let query = conn.query(sql, (err, result) => {
        if (err)
            throw err;
        res.render('detailRuangan', {
            title: "Detail Ruangan",
            result,session:req.session.username,
            panjang: result.length
        });
    });
});

// DELETE PASIEN
router.delete('/:id', (req, res) => {
    const id = req.params.id
    const sql = `DELETE FROM reg_pasien WHERE kode_reg_pasien = ${id}`;

    conn.query(sql, [id], (error, result, field) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            console.log('deleted ' + result.affectedRows + ' rows');
            res.redirect('/');
        }
    });
});

// EDIT DATA
router.put('/:id', async (req, res) => {
    try {
        const nama_ruang = req.body.nama_ruang
        const tarif_kamar = req.body.tarif_kamar
        const no_kamar = req.body.no_kamar
        const status_kamar = req.body.status_kamar

        let sql = await "UPDATE ruangan SET nama_ruang = '" + nama_ruang + "', tarif_kamar = '" + tarif_kamar + "', no_kamar = '" + no_kamar + "', status_kamar = '" + status_kamar + "'  WHERE kode_ruang = '" + req.params.id + "'";

        const query = conn.query(sql, (err, result) => {
            if (err)
                throw err;
            console.log("1 record updated");
            res.redirect('/dataRuangan');
            res.end();
        });
    } catch (error) {
        console.log(error)
    }
})

module.exports = router