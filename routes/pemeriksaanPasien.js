const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const path = require('path')
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

// TAMPILAN HOME DOKTER
router.get('/', (req, res) => {
    const pasien = "SELECT * FROM reg_pasien WHERE status_pasien = 'belum diperiksa' ORDER BY kode_reg_pasien ASC LIMIT 5"
    const pasienSudahPeriksa = "SELECT * FROM reg_pasien WHERE status_pasien = 'sudah periksa' ORDER BY kode_reg_pasien ASC LIMIT 1"
    const dokter = "SELECT * FROM dokter"
    const tindakan = "SELECT * FROM tindakan ORDER BY nama_tindakan"
    const ruangan = "SELECT * FROM ruangan"
    let query = conn.query(pasien, (err, pasien) => {
        conn.query(dokter, (err, dokter) => {
            conn.query(tindakan, (err, tindakan) => {
                conn.query(ruangan, (err, ruangan) => {
                conn.query(pasienSudahPeriksa, (err, pasienSudahPeriksa) => {
                    if (err) 
                        throw err;
                    if (!req.session.loggedin && !req.session.username) {
                        res.redirect('/login')
                    } else if (req.session.username == "admin") {
                        res.render('pemeriksaanPasien', {
                            title: "Pemeriksaan Pasien",
                            dokter,
                            tindakan,
                            ruangan,
                            pasien,pasienSudahPeriksa,
                            session: req.session.username,
                            moment
                        })
                    } else if (req.session.username == "perawat") {
                        res.sendFile(path.join(__dirname, '../views', 'hakAkses.html'))
                    }
                })
                })
            })
        })
    })
})

router.put('/:id', async (req, res) => {
    try {
        const status_pasien = "sudah periksa"
        const sql = await "UPDATE reg_pasien SET status_pasien = '" +
                status_pasien + "' WHERE kode_reg_pasien = '" + req.params.id + "' "

        const query = conn.query(sql, (err, result) => {
            if (err) 
                throw err;
            console.log("status pasien diupdate")
            res.redirect("/pemeriksaanPasien")
            res.end()
        })
    } catch (error) {
        console.log(error)
    }

})

// TAMBAH DOKTER
router.post("/", async (req, res) => {
    try {
        const tgl_pemeriksaan = req.body.tgl_pemeriksaan;
        const hasil_pemeriksaan = req.body.hasil_pemeriksaan;
        const kode_dokter = req.body.kode_dokter;
        const kode_pasien = req.body.kode_reg_pasien;
        const kode_tindakan = req.body.kode_tindakan;
        const status_pemeriksaan = req.body.status_pemeriksaan;
        const kode_ruang = req.body.kode_ruang;

        let sql = (await "INSERT INTO diagnosa VALUES ('','" + tgl_pemeriksaan + "','" +
                hasil_pemeriksaan + "','" + kode_dokter + "','" + kode_pasien + "','" + kode_tindakan +
                "','" + status_pemeriksaan + "', '" + kode_ruang + "')")
        const hapusAntrianPasien = `DELETE FROM reg_pasien WHERE reg_pasien.kode_reg_pasien = ${kode_pasien}`;

        const query = conn.query(sql, (err, result) => {
        conn.query(hapusAntrianPasien, (err, hapusAntrianPasien) => {
            if (err) 
                throw err;
            console.log('berhasil insert rows');
            res.redirect("/pemeriksaanPasien");
            res.end();
        })
    })
    } catch (error) {
        console.log(error);
    }
});

// DELETE DATA
router.delete('/:id', (req, res) => {
    const id = req.params.id
    const sql = `DELETE FROM dokter WHERE kode_dokter = ${id}`;

    conn.query(sql, [id], (error, result, field) => {
        if (error) {
            res.json({message: error.message})
        } else {
            console.log('deleted ' + result.affectedRows + ' rows');
            res.redirect('/dataDokter');
        }
    });
});

// DETAIL DOKTER
router.get('/detailDokter/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM dokter WHERE kode_dokter = ${id}`;

    let query = conn.query(sql, (err, result) => {
        if (err) 
            throw err;
        res.render('detailDokter', {
            title: "Detail Dokter",
            result,
            session: req.session.username,
            panjang: result.length
        });
    });
});

// EDIT DATA DOKTER
router.put('/:id', async (req, res) => {
    try {
        const nama_dokter = req.body.nama_dokter
        const alamat_dokter = req.body.alamat_dokter
        const no_telp = req.body.no_telp
        const spesialis = req.body.spesialis
        const jam_praktek = req.body.jam_praktek
        const no_praktek = req.body.no_praktek

        let sql = await "UPDATE dokter SET nama_dokter = '" + nama_dokter + "', alamat_" +
                "dokter = '" + alamat_dokter + "', no_telp = '" + no_telp +
                "', spesialis = '" + spesialis + "' , jam_praktek = '" + jam_praktek + "', no_p" +
                "raktek = '" + no_praktek + "' WHERE kode_dokter = '" + req.params.id + "'";
        const query = conn.query(sql, (err, result) => {
            if (err) 
                throw err;
            console.log("1 record updated");
            res.redirect('/dataDokter');
            res.end();
        });
    } catch (error) {
        console.log(error)
    }
})

module.exports = router