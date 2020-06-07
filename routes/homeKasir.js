const express = require('express')
const path = require('path');
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
    const rekamMedis = "SELECT * FROM rekam_medis"
    const ruangan = "SELECT * FROM ruangan"
    const diagnosa = "SELECT * FROM diagnosa JOIN reg_pasien ON diagnosa.kode_reg_pasien = reg_pasien.kode_reg_pasien JOIN ruangan ON diagnosa.kode_ruang = ruangan.kode_ruang ORDER BY kode_diagnosa DESC LIMIT 5"
    const dokter = "SELECT * FROM dokter"
    const perawat = "SELECT * FROM perawat"
    const tindakan = "SELECT * FROM tindakan"
    const obat = "SELECT * FROM obat"
    const resep = "SELECT * FROM resep JOIN reg_pasien ON resep.kode_reg_pasien = reg_pasien.kode_reg_pasien JOIN dokter ON resep.kode_dokter = dokter.kode_dokter JOIN obat ON resep.kode_obat = obat.kode_obat ORDER BY kode_resep DESC LIMIT 1"
    const perawatRuangan = "SELECT kode_perawat, nama_perawat, ruangan.kode_ruang, ruangan.nama_ruang FROM perawat JOIN ruangan ON perawat.kode_ruang = ruangan.kode_ruang"
    const pasien = "SELECT * FROM reg_pasien WHERE status_pasien = 'belum diperiksa'"
    const pasienSudahPeriksa = "SELECT * FROM reg_pasien WHERE status_pasien LIKE '%sudah%' ORDER BY kode_reg_pasien ASC LIMIT 5"
    const pasienSudahResep = "SELECT * FROM reg_pasien WHERE status_pasien = 'sudah diresep' ORDER BY kode_reg_pasien ASC LIMIT 5"
    const pasienSudahDiagnosa = "SELECT * FROM reg_pasien WHERE status_pasien = 'sudah didiagnosa' ORDER BY kode_reg_pasien ASC LIMIT 5"
    const pasienSudahDirekam = "SELECT * FROM reg_pasien WHERE status_pasien = 'sudah direkam' ORDER BY kode_reg_pasien ASC LIMIT 5"
    const join = "SELECT * FROM rekam_medis JOI" +
    "N reg_pasien ON rekam_medis.kode_reg_pasien = reg_pasien.kode_reg_pasien JOIN " +
    "dokter ON rekam_medis.kode_dokter = dokter.kode_dokter JOIN obat ON rekam_medi" +
    "s.kode_obat = obat.kode_obat JOIN diagnosa ON rekam_medis.kode_diagnosa = diag" +
    "nosa.kode_diagnosa";

    let query = conn.query(pasien, (err, pasien) => {
        conn.query(ruangan, (err, ruangan) => {
        conn.query(diagnosa, (err, diagnosa) => {
        conn.query(dokter, (err, dokter) => {
        conn.query(perawat, (err, perawat) => {
        conn.query(rekamMedis, (err, rekamMedis) => {
        conn.query(resep, (err, resep) => {
        conn.query(pasienSudahPeriksa, (err, pasienSudahPeriksa) => {
        conn.query(pasienSudahDirekam, (err, pasienSudahDirekam) => {
        conn.query(join, (err, join) => {
        if (err) 
            throw err;
        if ( !req.session.loggedin && !req.session.username ) {
            res.redirect('/login')
        } else if(req.session.kasir == "kasir"){
            res.render('homeKasir', {
                title: "Home Kasir",
                perawat,pasien,pasienSudahPeriksa,
                pasienSudahResep,moment,diagnosa,
                obat,join,pasienSudahDirekam,
                jumlahPasienSudahPeriksa:pasienSudahPeriksa.length,
                jumlahPasien:pasien.length,
                perawatRuangan,dokter,tindakan,
                session: req.session.kasir,ruangan,
                antrian: pasien.length,resep
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



router.post("/tambahPasien", async (req, res) => {
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
            res.redirect("/homeKasir");
            res.end();
        });
    } catch (error) {
        console.log(error);
    }
});



router.post("/pasienDitagih", async (req, res) => {
    try {
        const kode_reg_pasien = req.body.kode_reg_pasien
        const tgl_administrasi = req.body.tgl_administrasi
        const kode_diagnosa = req.body.kode_diagnosa
        const kode_resep = req.body.kode_resep
        const kode_obat = req.body.kode_obat
        const harga_obat = req.body.harga_obat
        const biaya_administrasi = 15000
        const tarif_kamar = req.body.tarif_kamar
        const lama_menginap = req.body.lama_menginap
        const ppn10 = (tarif_kamar * lama_menginap + harga_obat) * 10/100
        const status_pasien = "sudah ditagih"
        const total_bayar = (tarif_kamar * lama_menginap / 0.5) + harga_obat + biaya_administrasi + ppn10

        const update = await "UPDATE reg_pasien SET status_pasien = '" +
            status_pasien + "' WHERE kode_reg_pasien = '" + kode_reg_pasien + "' "
        const sql = await "INSERT INTO administrasi VALUES ('','" + tgl_administrasi + "','" +
            kode_reg_pasien + "','" + kode_diagnosa + "','" + kode_resep + "','" + kode_obat +
            "', '"+ lama_menginap +"', '"+ biaya_administrasi +"', '"+ ppn10 +"', '"+ total_bayar +"')";
        
        const query = conn.query(sql, (err, result) => {
            if (err) 
                throw err;
                console.log('berhasil ditagih');
                const query = conn.query(update, (err, update) => {
                    if (err) 
                        throw err;
                    console.log("status pasien sudah ditagih")
                    res.redirect("/homeKasir")
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