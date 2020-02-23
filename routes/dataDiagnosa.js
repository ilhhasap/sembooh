const express = require("express");
const router = express.Router();
const mysql = require("mysql");

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
    let join = "SELECT kode_diagnosa, reg_pasien.kode_reg_pasien,reg_pasien.nama_pasien, dokter.kode_dokter, dokter.nama_dokter,0tindakan.kode_tindakan, .tindakan.nama_tindakan, ruangan.kode_ruang, ruangan.nama_ruang FROM diagnosa JOIN reg_pasien ON diagnosa.kode_reg_pasien = reg_pasien.kode_reg_pasien JOIN dokter ON diagnosa.kode_dokter = dokter.kode_dokter JOIN ruangan ON diagnosa.kode_ruang = ruangan.kode_ruang JOIN tindakan ON diagnosa.kode_tindakan = tindakan.kode_tindakan"
    const pasien = "SELECT * FROM reg_pasien"
    let query = conn.query(join, (err, join) => {
        let query = conn.query(pasien, (err, pasien) => {
            if (err) 
                throw err
            res.render("dataDiagnosa", {
                title: "Halaman Diagnosa",
                join,
                pasien
            })
        })
    })
})

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
            res.redirect("/");
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

    let query = conn.query(sql, (err, result) => {
        if (err) 
            throw err;
        res.render("detailPasien", {
            title: "Halaman Detail",
            result,
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
