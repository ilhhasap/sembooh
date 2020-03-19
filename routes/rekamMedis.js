const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const moment = require('moment')
const conn = mysql.createConnection(
    {host: 'localhost', user: 'root', password: '', database: 'hospital'}
);

//connect ke database
conn.connect((err) => {
    if (err) 
        throw err;
    console.log('Mysql Connected...');
});

router.get('/', (req, res) => {
    let sql = "SELECT no_rekam_medis, tgl_rekam_medis, reg_pasien.kode_reg_pasien,reg_pasien." +
            "nama_pasien, dokter.kode_dokter, dokter.nama_dokter, obat.kode_obat, obat.nama" +
            "_obat, diagnosa.kode_diagnosa, diagnosa.hasil_pemeriksaan FROM rekam_medis JOI" +
            "N reg_pasien ON rekam_medis.kode_reg_pasien = reg_pasien.kode_reg_pasien JOIN " +
            "dokter ON rekam_medis.kode_dokter = dokter.kode_dokter JOIN obat ON rekam_medi" +
            "s.kode_obat = obat.kode_obat JOIN diagnosa ON rekam_medis.kode_diagnosa = diag" +
            "nosa.kode_diagnosa";
    const pasien = "SELECT * FROM reg_pasien ORDER BY nama_pasien";
    const dokter = "SELECT * FROM dokter"
    const diagnosa = "SELECT * FROM diagnosa JOIN reg_pasien ON diagnosa.kode_reg_pasien = reg_pasien.kode_reg_pasien"
    const obat = "SELECT * FROM obat"
    let query = conn.query(sql, (err, result) => {
        conn.query(dokter, (err, dokter) => {
            conn.query(pasien, (err, pasien) => {
            conn.query(diagnosa, (err, diagnosa) => {
            conn.query(obat, (err, obat) => {
                if (err) 
                    throw err;
                res.render('rekamMedis', {
                    title: "Rekam Medis",
                    session: req.session.username,
                    result,moment,
                    dokter,obat,
                    pasien, diagnosa
                })
                })
                })
            })
        })
    })
})

router.get("/detailRekamMedis/:id", (req, res) => {
    const id = req.params.id
    let sql = `SELECT no_rekam_medis, tgl_rekam_medis, reg_pasien.kode_reg_pasien, reg_pasien.nama_pasien, dokter.kode_dokter, dokter.nama_dokter, obat.kode_obat, obat.nama_obat, diagnosa.kode_diagnosa, diagnosa.hasil_pemeriksaan FROM rekam_medis JOIN reg_pasien ON rekam_medis.kode_reg_pasien = reg_pasien.kode_reg_pasien JOIN dokter ON rekam_medis.kode_dokter = dokter.kode_dokter JOIN obat ON rekam_medis.kode_obat = obat.kode_obat JOIN diagnosa ON rekam_medis.kode_diagnosa = diagnosa.kode_diagnosa WHERE no_rekam_medis = ${id}`;
    const dokter = `SELECT * FROM dokter`
    const obat = `SELECT * FROM obat`
    const diagnosa = `SELECT * FROM diagnosa`

    let query = conn.query(sql, (err, result) => {
        conn.query(dokter, (err, dokter) => {
        conn.query(obat, (err, obat) => {
        conn.query(diagnosa, (err, diagnosa) => {
        if (err) 
            throw err
        res.render("detailRekamMedis", {
            title: "Detail Rekam Medis",dokter,obat,diagnosa,
            result, session:req.session.username
        })
    })
        })
    })
    })
})

router.post('/', async (req, res) => {
    try {
        const kode_reg_pasien = req.body.kode_reg_pasien
        const kode_dokter = req.body.kode_dokter
        const kode_diagnosa = req.body.kode_diagnosa
        const kode_obat = req.body.kode_obat
        const tgl_rekam_medis = req.body.tgl_rekam_medis

        let sql = await "INSERT INTO rekam_medis VALUES ('','" + tgl_rekam_medis + "','" +
                kode_reg_pasien + "','" + kode_dokter + "','" + kode_obat + "','" + kode_diagnosa +
                "')";
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
            res.json({message: error.message})
        } else {
            console.log('deleted ' + result.affectedRows + ' rows');
            res.redirect('/');
        }
    });
});

router.put("/:id", async (req, res) => {
    try {
        const kode_reg_pasien = req.body.kode_reg_pasien;
        const tgl_rekam_medis = req.body.tgl_rekam_medis;
        const kode_dokter = req.body.kode_dokter;
        const kode_obat = req.body.kode_obat;
        const kode_diagnosa = req.body.kode_diagnosa;

        let sql = (await "UPDATE rekam_medis SET kode_reg_pasien = '") +
                kode_reg_pasien + "', tgl_rekam_medis = '" + tgl_rekam_medis + "', kode_dokter = '" +
                kode_dokter + "', kode_obat = '" + kode_obat + "', kode_diagnosa = '" + kode_diagnosa + "'  WHERE no_rekam_medis = '" + req.params.id +
                "'";
        const query = conn.query(sql, (err, result) => {
            if (err) 
                throw err;
            console.log("1 record updated");
            res.redirect("/rekamMedis");
            res.end();
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router