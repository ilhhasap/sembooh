const express = require('express')
const router = express.Router()
const session = require('express-session')
const mysql = require('mysql')
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
    const pasien = "SELECT * FROM reg_pasien WHERE status_pasien = 'belum diperiksa'";
    const pasienDiperiksa = "SELECT * FROM reg_pasien WHERE status_pasien = 'sudah periksa'";
    const rekamMedis = "SELECT * FROM rekam_medis"
    const ruangan = "SELECT * FROM ruangan"
    const diagnosa = "SELECT * FROM diagnosa"
    const dokter = "SELECT * FROM dokter"
    const perawat = "SELECT * FROM perawat"
    const tindakan = "SELECT * FROM tindakan"
    let query = conn.query(pasien, (err, pasien) => {
        conn.query(rekamMedis, (err, rekamMedis) => {
        conn.query(ruangan, (err, ruangan) => {
        conn.query(diagnosa, (err, diagnosa) => {
        conn.query(dokter, (err, dokter) => {
        conn.query(perawat, (err, perawat) => {
        conn.query(pasienDiperiksa, (err, pasienDiperiksa) => {
        conn.query(tindakan, (err, tindakan) => {
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
                jumlahPasienDiperiksa:pasienDiperiksa.length,
                session: req.session.username,
                antrian: pasien.length, pasien
            })
        } else if(req.session.username == "perawat"){
            res.render('homePerawat', {
                title: "Home Perawat",
                perawat,
                jumlahPasien:pasien.length,
                jumlahRuangan:ruangan.length,
                jumlahRekam:rekamMedis.length,
                jumlahPerawat:perawat.length,
                session: req.session.username,ruangan,
                antrian: pasien.length, rekamMedis: rekamMedis.length
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

module.exports = router