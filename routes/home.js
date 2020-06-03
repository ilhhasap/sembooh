const express = require('express')
const router = express.Router()
const session = require('express-session')
const mysql = require('mysql')
const moment = require('moment')
const conn = mysql.createConnection(
    {host: 'localhost', user: 'root', password: '', database: 'hospital'}
);

router.use(
    session({secret: 'sosecret', resave: false, saveUninitialized: true})
)
//connect ke database
conn.connect((err) => {
    if (err)
        throw err;
    console.log('Mysql Connected...');
});


router.get('/', (req, res) => {
    const join = "SELECT * FROM diagnosa JOIN reg_pasien ON diagnosa.kode_reg_pasien = reg_pasien.kode_reg_pasien"
    const rekamMedis = "SELECT * FROM rekam_medis"
    const ruangan = "SELECT * FROM ruangan"
    const diagnosa = "SELECT * FROM diagnosa"
    const dokter = "SELECT * FROM dokter"
    const perawat = "SELECT * FROM perawat"
    const tindakan = "SELECT * FROM tindakan"
    const obat = "SELECT * FROM obat"
    const perawatRuangan = "SELECT kode_perawat, nama_perawat, ruangan.kode_ruang, ruangan.nama_ruang FROM perawat JOIN ruangan ON perawat.kode_ruang = ruangan.kode_ruang"
    const pasien = "SELECT * FROM reg_pasien WHERE status_pasien = 'belum diperiksa'"
    const pasienSudahPeriksa = "SELECT * FROM reg_pasien WHERE status_pasien = 'sudah periksa' ORDER BY kode_reg_pasien ASC LIMIT 5"
    const pasienSudahResep = "SELECT * FROM reg_pasien WHERE status_pasien = 'sudah diresep' ORDER BY kode_reg_pasien ASC LIMIT 5"
    const pasienSudahDiagnosa = "SELECT * FROM reg_pasien WHERE status_pasien = 'sudah didiagnosa' ORDER BY kode_reg_pasien ASC LIMIT 5"

    let query = conn.query(pasien, (err, pasien) => {
        conn.query(rekamMedis, (err, rekamMedis) => {
        conn.query(ruangan, (err, ruangan) => {
        conn.query(diagnosa, (err, diagnosa) => {
        conn.query(dokter, (err, dokter) => {
        conn.query(perawat, (err, perawat) => {
        conn.query(pasienSudahPeriksa, (err, pasienSudahPeriksa) => {
        conn.query(tindakan, (err, tindakan) => {
        conn.query(obat, (err, obat) => {
        conn.query(perawatRuangan, (err, perawatRuangan) => {
        conn.query(pasienSudahResep, (err, pasienSudahResep) => {
        conn.query(pasienSudahDiagnosa, (err, pasienSudahDiagnosa) => {
        conn.query(join, (err, join) => {
        if (err) 
            throw err;
        if ( !req.session.loggedin && !req.session.username ) {
            res.redirect('/login')
        } else if(req.session.username == "admin"){
            res.render('home', {
                title: "Home Admin",
                jumlahPasien:pasien.length,
                jumlahRuangan:ruangan.length,
                jumlahRekam:rekamMedis.length,
                jumlahDiagnosa:diagnosa.length,
                jumlahTindakan:tindakan.length,
                jumlahDokter:dokter.length,
                jumlahPerawat:perawat.length,
                jumlahObat:perawat.length,
                jumlahPasienSudahPeriksa:pasienSudahPeriksa.length,
                session: req.session.username,
                antrian: pasien.length, pasien
            })
        } else if(req.session.username == "perawat"){
            res.render('homePerawat', {
                title: "Home Perawat",
                perawat,pasien,pasienSudahPeriksa,
                pasienSudahResep,moment,diagnosa,
                obat,join,
                jumlahPasien:pasien.length,
                jumlahRuangan:ruangan.length,
                jumlahRekam:rekamMedis.length,
                jumlahPerawat:perawat.length,
                perawatRuangan,dokter,tindakan,
                session: req.session.username,ruangan,
                antrian: pasien.length, rekamMedis: rekamMedis.length
            })
        } else if(req.session.username == "dokter"){
            res.render('homeDokter', {
                title: "Home Dokter",
                perawat,pasien,pasienSudahPeriksa,
                pasienSudahResep,moment,pasienSudahDiagnosa,
                jumlahPasien:pasien.length,
                jumlahRuangan:ruangan.length,
                jumlahRekam:rekamMedis.length,
                jumlahDiagnosa:diagnosa.length,
                jumlahTindakan:tindakan.length,
                jumlahDokter:dokter.length,
                jumlahPerawat:perawat.length,
                jumlahObat:perawat.length,
                dokter,tindakan,obat,join,
                session: req.session.username,ruangan,
                rekamMedis: rekamMedis.length
            })
        }
    })
    })
    })
    })
    })
    })
    })
    })
    })
    })
    })
    })
})
})



router.post("/daftarPasien", async (req, res) => {
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


router.put('/:id', async (req, res) => {
    try {
        const status_pasien = "sudah periksa"
        const sql = await "UPDATE reg_pasien SET status_pasien = '" +
                status_pasien + "' WHERE kode_reg_pasien = '" + req.params.id + "' "

        const query = conn.query(sql, (err, result) => {
            if (err) 
                throw err;
            console.log("status pasien diupdate")
            res.redirect("/")
            res.end()
        })
    } catch (error) {
        console.log(error)
    }

})


router.post("/pasienSudahDiagnosa", async (req, res) => {
    try {
        const tgl_pemeriksaan = req.body.tgl_pemeriksaan;
        const hasil_pemeriksaan = req.body.hasil_pemeriksaan;
        const kode_dokter = req.body.kode_dokter;
        const kode_pasien = req.body.kode_reg_pasien;
        const kode_tindakan = req.body.kode_tindakan;
        const status_pemeriksaan = req.body.status_pemeriksaan;
        const kode_ruang = req.body.kode_ruang;
        const status_pasien = "sudah didiagnosa"
        const update = await "UPDATE reg_pasien SET status_pasien = '" +
            status_pasien + "' WHERE kode_reg_pasien = '" + kode_pasien + "' "
        let sql = (await "INSERT INTO diagnosa VALUES ('','" + tgl_pemeriksaan + "','" +
                hasil_pemeriksaan + "','" + kode_dokter + "','" + kode_pasien + "','" + kode_tindakan +
                "','" + status_pemeriksaan + "', '" + kode_ruang + "')")
        
        const query = conn.query(sql, (err, result) => {
            if (err) 
                throw err;
            console.log('berhasil didiagnosa');
                const query = conn.query(update, (err, update) => {
                    if (err) 
                        throw err;
                    console.log("status pasien sudah didiagnosa")
                    res.redirect("/")
                    res.end();
                })
            
        })
    } catch (error) {
        console.log(error);
    }
});



router.post("/pasienSudahResep", async (req, res) => {
    try {
        const tgl_resep = req.body.tgl_resep;
        const kode_reg_pasien = req.body.kode_reg_pasien;
        const kode_dokter = req.body.kode_dokter;
        const kode_obat = req.body.kode_obat;
        const aturan_pakai = req.body.aturan_pakai;
        const harga_obat = req.body.harga_obat;
        const kode_pasien = req.body.kode_reg_pasien;
        const status_pasien = "sudah diresep"
        const update = await "UPDATE reg_pasien SET status_pasien = '" +
            status_pasien + "' WHERE kode_reg_pasien = '" + kode_pasien + "' "
        let sql = (await "INSERT INTO resep VALUES ('','" + tgl_resep + "','" +
            kode_reg_pasien + "','" + kode_dokter + "','" + kode_obat + "','" + aturan_pakai +
            "','" + harga_obat + "')")
        
        const query = conn.query(sql, (err, result) => {
            if (err) 
                throw err;
            console.log('berhasil diresep');
                const query = conn.query(update, (err, update) => {
                    if (err) 
                        throw err;
                    console.log("status pasien sudah diresep")
                    res.redirect("/")
                    res.end();
                })
            
        })
    } catch (error) {
        console.log(error);
    }
});



router.post("/pasienSudahRekam", async (req, res) => {
    try {
        const kode_pasien = req.body.kode_reg_pasien
        const kode_reg_pasien = req.body.kode_reg_pasien
        const kode_dokter = req.body.kode_dokter
        const kode_diagnosa = req.body.kode_diagnosa
        const kode_obat = req.body.kode_obat
        const tgl_rekam_medis = req.body.tgl_rekam_medis
        const status_pasien = "sudah direkam"
        const update = await "UPDATE reg_pasien SET status_pasien = '" +
            status_pasien + "' WHERE kode_reg_pasien = '" + kode_pasien + "' "
        const sql = await "INSERT INTO rekam_medis VALUES ('','" + tgl_rekam_medis + "','" +
            kode_reg_pasien + "','" + kode_dokter + "','" + kode_obat + "','" + kode_diagnosa +
            "')";
        
        const query = conn.query(sql, (err, result) => {
            if (err) 
                throw err;
            console.log('berhasil direkam medis');
                const query = conn.query(update, (err, update) => {
                    if (err) 
                        throw err;
                    console.log("status pasien sudah direkam medis")
                    res.redirect("/")
                    res.end();
                })
            
        })
    } catch (error) {
        console.log(error);
    }
});


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
module.exports = router