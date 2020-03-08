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

// ! halaman perawat
router.get('/', (req, res) => {
    let sql = "SELECT * FROM obat";
    let query = conn.query(sql, (err, result) => {
        if (err)
            throw err;
        res.render('dataObat', {
            title: "Halaman Obat",session:req.session.username,
            result
        });
    });
})


// ! tambah obat
router.post('/', async (req, res) => {
    try {
        const kode_obat = ''
        const kategori_obat = req.body.kategori_obat
        const jenis_obat = req.body.jenis_obat
        const nama_obat = req.body.nama_obat
        const tgl_exp = req.body.tgl_exp
        const harga_obat = req.body.harga_obat
        const jml_obat = req.body.jml_obat

        let sql = await "INSERT INTO obat VALUES ('" + kode_obat + "','" + kategori_obat + "','" +
            jenis_obat + "','" + nama_obat + "','" + tgl_exp + "','" + harga_obat + "','" +
            jml_obat + "')";
        const query = conn.query(sql, (err, result) => {
            if (err)
                throw err;
            console.log("1 record inserted");
            res.redirect('/dataObat');
            res.end();
        });
    } catch (error) {
        console.log(error)
    }
})


// ! detail obat
router.get('/detailObat/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM obat WHERE kode_obat = ${id}`;

    let query = conn.query(sql, (err, result) => {
        if (err)
            throw err;
        res.render('detailObat', {
            title: "Detail Obat",
            result, session:req.session.username
        });
    });
});

// ! edit obat
router.put('/:id', async (req, res) => {
    try {
        const kode_obat = req.params.id
        const kategori_obat = req.body.kategori_obat
        const jenis_obat = req.body.jenis_obat
        const nama_obat = req.body.nama_obat
        const tgl_exp = req.body.tgl_exp
        const harga_obat = req.body.harga_obat
        const jml_obat = req.body.jml_obat
        let sql = await "UPDATE obat SET kategori_obat = '" + kategori_obat + "',jenis_obat = '" + jenis_obat + "', nama_obat = '" + nama_obat + "', tgl_exp = '" +
            tgl_exp + "', harga_obat = '" + harga_obat + "', jml_obat = '" + jml_obat + "'  WHERE kode_obat = '" + kode_obat + "'";
        const query = conn.query(sql, (err, result) => {
            if (err)
                throw err;
            console.log("1 record updated");
            res.redirect('/dataObat');
            res.end();
        });
    } catch (error) {
        console.log(error)
    }
})


router.delete('/:id', (req, res) => {
    const id = req.params.id
    const sql = `DELETE FROM obat WHERE kode_obat = ${id}`;

    conn.query(sql, [id], (error, result, field) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            console.log('deleted ' + result.affectedRows + ' rows');
            res.redirect('/dataObat');
        }
    });
});
module.exports = router