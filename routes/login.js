const mysql = require('mysql')
const path = require('path');
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const router = express.Router()
const app = express()
const moment = require('moment')
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital'
});

//connect ke database
conn.connect((err) => {
    if (err)
        throw err;
    console.log('Mysql Connected...');
});

router.use(session({
    secret: 'sosecret',
    resave: false,
    saveUninitialized: false
}))

router.use(bodyParser.urlencoded({
    extended: true
}))
router.use(bodyParser.json())

router.get('/', (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})

router.post('/auth', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    if (username && password) {
        conn.query("SELECT * FROM admin WHERE username = ? AND password = ?",[username,password],  (err, results, fields) => {
            if (results.length > 0) {
                req.session.loggedin = true
                if(username == "admin") {
                    req.session.admin = "admin"
                    console.log(req.session.admin + ' telah login ' +  moment().format('LLLL') )
                res.redirect('/')
            } else if(username == "perawat") {
                req.session.perawat = "perawat"
                console.log(req.session.perawat + ' telah login ' +  moment().format('LLLL') )
                res.redirect('/homePerawat')
            } else if(username == "dokter") {
                req.session.dokter = "dokter"
                console.log(req.session.dokter + ' telah login ' +  moment().format('LLLL') )
                res.redirect('/homeDokter')
            } else if(username == "kasir") {
                req.session.kasir = "kasir"
                console.log(req.session.kasir + ' telah login ' +  moment().format('LLLL') )
                res.redirect('/homeKasir')
            } 
            } else {
                res.send('username dan password salah! <br> <a class="btn btn-primary" href="/login" role="button">kembali login</a> ')
            }
            res.end()
        })
    } else {
        res.send('tolong masukan username dan password!  <br> <a href="/login">kembali login</a>')
        res.end()
    }
})


router.get('/home', (req, res) => {
    console.log('sudah berhasil login' + req.session.username)
    if (req.session.loggedin) {
        res.send('Selamat Datang kembali, ' + req.session.username + '! ')
        // res.render('/', {
        //     title: "Home",
        //     username: req.session.username
        // });
    } else {
        res.send('tolong login kembali!')
    }
    res.end()
})


router.get('/logout', (req, res) => {
    if(req.session.username == "admin"){
        req.session.destroy((admin) => {
            console.log('Admin telah logout ' + moment().format('LLLL') + '\n')
            res.redirect('/login')
        })
    } else if(req.session.dokter == "dokter"){
        req.session.destroy((dokter) => {
            console.log('Dokter telah logout ' + moment().format('LLLL') + '\n')
            res.redirect('/login')
        })
    } else if(req.session.username == "perawat"){
        req.session.destroy((perawat) => {
            console.log('Perawat telah logout ' + moment().format('LLLL') + '\n')
            res.redirect('/login')
        })
    } else if(req.session.username == "kasir"){
        req.session.destroy((kasir) => {
            console.log('Kasir telah logout ' + moment().format('LLLL') + '\n')
            res.redirect('/login')
        })
    }
})


module.exports = router