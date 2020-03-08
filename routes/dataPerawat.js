const express = require("express")
const router = express.Router()
const mysql = require("mysql")
const moment = require('moment')
const conn = mysql.createConnection(
    {host: "localhost", user: "root", password: "", database: "hospital"}
);

//connect ke database
conn.connect(err => {
    if (err) 
        throw err;
    console.log("Mysql Connected...");
})

// ! HALAMAN PERAWAT
router.get("/", (req, res) => {
    let sql = "SELECT kode_perawat, nama_perawat, jeniskel, jam_jaga, ruangan.kode_ruang, rua" +
            "ngan.nama_ruang FROM perawat JOIN ruangan ON perawat.kode_ruang = ruangan.kode" +
            "_ruang";
    const ruangan = "SELECT * FROM ruangan"
    const query = conn.query(sql, (err, result) => {
        const query = conn.query(ruangan, (err, ruangan) => {
            if (err) 
                throw err;
            res.render("dataPerawat", {
                title: "Halaman Perawat",
                result,session:req.session.username,
                ruangan
            })
        })
    })
})
// ! AKHIR HALAMAN PERAWAT



// ! TAMBAH PERAWAT
router.post("/", async (req, res) => {
    try {
        const nama_perawat = req.body.nama_perawat
        const jeniskel = req.body.jeniskel
        const alamat_perawat = req.body.alamat_perawat
        const tgl_lahir = req.body.tgl_lahir
        const no_telp = req.body.no_telp
        const kode_ruang = req.body.kode_ruang
        const jam_jaga = req.body.jam_jaga

        let sql = (await "INSERT INTO perawat VALUES ('','") + nama_perawat + "','" +
                jeniskel + "','" + alamat_perawat + "','" + tgl_lahir + "','" + no_telp +
                "','" + kode_ruang + "', '" + jam_jaga + "')"
        const query = conn.query(sql, (err, result) => {
            if (err) 
                throw err
            console.log("1 record inserted")
            res.redirect("/dataPerawat")
            res.end()
        })
    } catch (error) {
        console.log(error)
    }
})
// ! AKHIR TAMBAH PERAWAT



// ! DELETE PASIEN
router.delete("/:id", (req, res) => {
    const id = req.params.id
    const sql = `DELETE FROM perawat WHERE kode_perawat = ${id}`

    conn.query(sql, [id], (error, result, field) => {
        if (error) {
            res.json({message: error.message})
        } else {
            console.log("deleted " + result.affectedRows + " rows")
            res.redirect("/dataPerawat")
        }
    });
});
// ! AKHIR DELETE PASIEN



// ! DETAIL PERAWAT
router.get("/detailPerawat/:id", (req, res) => {
    const id = req.params.id;
    const sql = `SELECT kode_perawat, nama_perawat, jeniskel, jam_jaga, ruangan.kode_ruang, ruangan.nama_ruang FROM perawat JOIN ruangan ON perawat.kode_ruang = ruangan.kode_ruang WHERE kode_perawat = ${id}`;
    const ruangan = "SELECT * FROM perawat"

    let query = conn.query(sql, (err, result) => {
        let query = conn.query(ruangan, (err, ruangan) => {
            if (err) 
                throw err;
            res.render("detailPerawat", {
                title: "Detail Perawat",
                result,session:req.session.username,
                ruangan
            });
        });
    });
});
// ! AKHIR DETAIL PERAWAT



// ! EDIT PERAWAT
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
