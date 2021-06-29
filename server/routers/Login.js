const express = require('express')
const router = express.Router();
const conn = require('../db');
const jwt = require('jsonwebtoken')
const config = require('../config')
const md5 = require('md5');


router.post('/login', (req, res) => {
    let psd = req.body.key;
    if (psd == '') {
        res.json({
            code: 400,
            msg: "请输入正确的号码！"
        })
        return;
    }
    let key = md5(psd + config.keystr);
    // 这个打印就是密钥
    // console.log(key);  
    conn.query('select * from users where `key` = ?', [key], (err, data) => {
        if (err) {
            res.json({
                code: 400,
                msg: "MySql error" + err
            })
            return;
        }
        if (data.length == 0) {
            res.json({
                code: 2002,
                msg: "口令错误!"
            })
            return;
        }
        let token = jwt.sign({
            ...data[0]
        }, config.keystr, { expiresIn: 60 * 60 * 24 })
        res.json({
            code: 2001,
            msg: "登录成功",
            token: token
        })
    })
})


router.get('/dataList', (req, res) => {
    conn.query('select * from data order by id desc', (err, data) => {
        if (err) {
            res.json({
                code: 400,
                msg: "MySql error" + err
            })
            return;
        }
        let clone = JSON.parse(JSON.stringify(data))
        clone.forEach(v => {
            let sign = JSON.parse(JSON.stringify(v.annex));
            
            v.annex = sign.split(',')
        });
        res.json({
            code: 200,
            data: clone
        })
    })
})


module.exports = router