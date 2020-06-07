const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const moment = require('moment')
const conn = mysql.createConnection(
    {host: "localhost", user: "root", password: "", database: "hospital"}
);
const path = require('path')

//connect ke database
conn.connect(err => {
    if (err) 
        throw err;
    console.log("Mysql Connected...");
});

router.get("/", (req, res) => {
    let sql = "SELECT * FROM reg_pasien";
    let query = conn.query(sql, (err, result) => {
        if (err) 
            throw err;
        if ( !req.session.loggedin && !req.session.username) {
                res.redirect('/login') 
        } else if(req.session.admin == "admin") {
        res.render("daftarPasien", {
            title: "Halaman Home",
            result, moment,session:req.session.admin,
            panjang: result.length
        }) 
    } else if(req.session.perawat == "perawat") {
        res.sendFile(path.join(__dirname, '../views', 'hakAkses.html'))
    }
    });
});

router.post("/", async (req, res) => {
    try {
        const nik = req.body.nik;
        const nama_pasien = req.body.nama_pasien;
        const alamat_pasien = req.body.alamat_pasien;
        const jeniskel = req.body.jeniskel;
        const no_telp = req.body.no_telp;
        const usia = req.body.usia;
        const tgl_daftar = req.body.tgl_daftar;
        const tempat_pemeriksaan = req.body.tempat_pemeriksaan;
        const status_pasien = "belum diperiksa";

        let sql = (await "INSERT INTO reg_pasien VALUES ('','") + nik + "','" +
                nama_pasien + "','" + alamat_pasien + "','" + jeniskel + "','" + no_telp +
                "','" + usia + "', '" + tgl_daftar + "', '" +
                tempat_pemeriksaan + "', '" + status_pasien + "')";
        const query = conn.query(sql, (err, result) => {
            if (err) 
                throw err;
            console.log("1 record inserted");
            res.redirect("/pemeriksaanPasien");
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

router.get("/detailPasien/:id", (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM reg_pasien WHERE kode_reg_pasien = ${id}`;
    const statusHeader = "active"

    let query = conn.query(sql, (err, result) => {
        if (err) 
            throw err;
        res.render("detailPasien", {
            title: "Halaman Detail",
            result, statusHeader,session:req.session.username,
            panjang: result.length
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
        const status_pasien = req.body.status_pasien

        let sql = (await "UPDATE reg_pasien SET nama_pasien = '") +
                nama_pasien + "', alamat_pasien = '" + alamat_pasien + "', no_telp = '" +
                no_telp + "', usia = '" + usia + "', tgl_daftar = '" + tgl_daftar + "', tempat_" +
                "pemeriksaan = '" + tempat_pemeriksaan + "', status_pasien = '"+ status_pasien +"'  WHERE kode_reg_pasien = '" + req.params.id +
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
