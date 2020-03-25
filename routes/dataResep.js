const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const moment = require('moment')
const conn = mysql.createConnection(
    {host: "localhost", user: "root", password: "", database: "hospital"}
)
//connect ke database
conn.connect(err => {
    if (err) 
        throw err;
    console.log("Mysql Connected...")
})

router.get("/", (req, res) => {
    let sql = "SELECT kode_resep, reg_pasien.kode_reg_pasien,reg_pasien.nama_pasien, dokter.kode_dokter, dokter.nama_dokter, obat.kode_obat, obat.nama_obat FROM resep JOIN obat ON resep.kode_obat = obat.kode_obat JOIN dokter ON resep.kode_dokter = dokter.kode_dokter JOIN reg_pasien ON resep.kode_reg_pasien = reg_pasien.kode_reg_pasien";
    const pasien = "SELECT * FROM reg_pasien ORDER BY nama_pasien"
    const dokter = "SELECT * FROM dokter ORDER BY nama_dokter"
    const ruangan = "SELECT * FROM ruangan ORDER BY nama_ruang"
    const obat = "SELECT * FROM obat ORDER BY nama_obat"
    let query = conn.query(sql, (err, join) => {
        conn.query(pasien, (err, pasien) => {
            conn.query(dokter, (err, dokter) => {
                    conn.query(ruangan, (err, ruangan) => {
                    conn.query(obat, (err, obat) => {
                        if (err)
                            throw err
                        if ( !req.session.loggedin && !req.session.username ) {
                            res.redirect('/login') 
                        } else if(req.session.username) {
                        res.render("dataResep", {
                            title: "Resep Pasien",
                            join, moment: moment,session:req.session.username,
                            pasien, dokter, ruangan, obat
                        })
                    }
                    })
                })
                })
        })
    })
    
})

router.post("/", async (req, res) => {
    try {
        const tgl_resep = req.body.tgl_resep;
        const kode_reg_pasien = req.body.kode_reg_pasien;
        const kode_dokter = req.body.kode_dokter;
        const kode_obat = req.body.kode_obat;
        const aturan_pakai = req.body.aturan_pakai;
        const harga_obat = req.body.harga_obat;

        let sql = (await "INSERT INTO resep VALUES ('','" + tgl_resep + "','" +
                kode_reg_pasien + "','" + kode_dokter + "','" + kode_obat + "','" + aturan_pakai +
                "','" + harga_obat + "')")
        const query = conn.query(sql, (err, result) => {
            if (err) 
                throw err;
            console.log("1 record inserted");
            res.redirect("/dataResep");
            res.end();
        });
    } catch (error) {
        console.log(error);
    }
});

// DELETE PASIEN
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM reg_pasien WHERE kode_reg_pasien = ${id}`;

    conn.query(sql, [id], (error, result, field) => {
        if (error) {
            res.json({message: error.message});
        } else {
            console.log("deleted " + result.affectedRows + " rows");
            res.redirect("/daftarPasien");
        }
    });
});

router.get('/detailResep/:id', (req, res) => {
    const id = req.params.id;
    let sql = `SELECT kode_resep, tgl_resep, harga_obat, aturan_pakai, reg_pasien.kode_reg_pasien, reg_pasien.nama_pasien, dokter.kode_dokter, dokter.nama_dokter,obat.kode_obat, obat.nama_obat, FROM resep JOIN reg_pasien ON resep.kode_reg_pasien = reg_pasien.kode_reg_pasien JOIN dokter ON resep.kode_dokter = dokter.kode_dokter WHERE kode_resep = ${id}`;
    const dokter = "SELECT * FROM dokter"
    const obat = "SELECT * FROM obat"
    // const sql = `SELECT * FROM diagnosa WHERE kode_diagnosa = ${id}`;

    let query = conn.query(sql, (err, result) => {
        conn.query(dokter, (err, dokter) => {
            conn.query(obat, (err, obat) => {
        if (err) 
            throw err;
        res.render("detailResep", {
            title: "Detail Resep", dokter,obat,
            result, session:req.session.username
        })
        })
        });
    });
});

router.put("/:id", async (req, res) => {
    try {
        const nik = req.body.nik;
        const nama_pasien = req.body.nama_pasien;
        const alamat_pasien = req.body.alamat_pasien;
        const no_telp = req.body.no_telp;
        const usia = req.body.usia;
        const tgl_daftar = req.body.tgl_daftar;
        const tempat_pemeriksaan = req.body.tempat_pemeriksaan;

        let sql = (await "UPDATE reg_pasien SET nama_pasien = '") +
                nama_pasien + "', alamat_pasien = '" + alamat_pasien + "', no_telp = '" +
                no_telp + "', usia = '" + usia + "', tgl_daftar = '" + tgl_daftar + "', tempat_" +
                "pemeriksaan = '" + tempat_pemeriksaan + "'  WHERE kode_reg_pasien = '" + req.params.id +
                "'";
        const query = conn.query(sql, (err, result) => {
            if (err) 
                throw err;
            console.log("1 record updated");
            res.redirect("/daftarPasien");
            res.end();
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
