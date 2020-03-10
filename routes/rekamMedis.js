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
    let sql = "SELECT * FROM rekam_medis";
    let query = conn.query(sql, (err, result) => {
        if (err)
            throw err;
        res.render('rekamMedis', {
            title: "Rekam Medis",session: req.session.username,
            result
        });
    });
})

router.post('/', async (req, res) => {
    try {
        const kode_reg_pasien = ''
        const nik = req.body.nik
        const nama_pasien = req.body.nama_pasien
        const alamat_pasien = req.body.alamat_pasien
        const jeniskel = req.body.jeniskel
        const no_telp = req.body.no_telp
        const usia = req.body.usia
        const tgl_daftar = req.body.tgl_daftar

        let sql = await "INSERT INTO reg_pasien VALUES ('','" + nik + "','" +
            nama_pasien + "','" + alamat_pasien + "','" + jeniskel + "','" + no_telp +
            "','" + usia + "', '" + tgl_daftar + "', '', '')";
        const query = conn.query(sql, (err, result) => {
            if (err)
                throw err;
            console.log("1 record inserted");
            res.redirect('/');
            res.end();
        });
    } catch (error) {
        console.log(error)
    }
})

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

module.exports = router