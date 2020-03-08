const mysql = require('mysql')
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
                req.session.username = username
                console.log(req.session.username + ' telah login tanggal ' +  moment().format('LLLL') )
                res.redirect('/')
            } else {
                res.send('username dan password salah! <br> <a href="/login">kembali</a>')
            }
            res.end()
        })
    } else {
        res.send('tolong masukan username dan password!')
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
req.session.destroy((err) => {
    console.log('petugas logout tgl ' + moment().format('LLLL') + '\n')
    res.redirect('/login')
})
})


module.exports = router