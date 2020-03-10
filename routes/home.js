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
    const pasien = "SELECT * FROM reg_pasien WHERE status_pasien = 'belum periksa'";
    const rekamMedis = "SELECT * FROM rekam_medis"
    let query = conn.query(pasien, (err, pasien) => {
        conn.query(rekamMedis, (err, rekamMedis) => {
        if (err) 
            throw err;
        if ( !req.session.loggedin && !req.session.username ) {
            res.redirect('/login')
        } else if(req.session.username == "admin"){
            res.render('home', {
                title: "Home Admin",
                session: req.session.username,
                antrian: pasien.length
            })
        } else if(req.session.username == "perawat"){
            res.render('homePerawat', {
                title: "Home Perawat",
                session: req.session.username,
                antrian: pasien.length, rekamMedis: rekamMedis.length
            })
        }

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
            res.redirect("/daftarPasien")
            res.end()
        })
    } catch (error) {
        console.log(error)
    }

})

module.exports = router