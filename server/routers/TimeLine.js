const express = require('express')
const router = express.Router();
const conn = require('../db');
const jwt = require('jsonwebtoken')
const config = require('../config')
const md5 = require('md5');

router.use((req, res, next) => {
    let reqUrl = req.url;
    // 获取token
    try {
        let token = req.headers.authorization.substring(7);
        let decoded = jwt.verify(token, config.keystr)    // 解析
        req.userInfo = decoded   // 将解析的数据放到req上面
        next()
    } catch (err) {   // 解析错误就返回400
        res.json({
            code: 2002,
            msg: "TOKEN ERROR"
        })
    }
})

router.post('/dataList', (req, res) => {
    let title = req.body.title || '';
    let text = req.body.text || '';
    let annex = req.body.annex || '';
    let site = req.body.site || '';
    let date = req.body.date || '';
    let ctime = Date.now();
    if (title == '') {
        res.json({
            code: 400,
            msg: "数据缺失"
        })
        return;
    }
    conn.query('insert into data set ?', { title, text, annex, site, date, ctime }, (err, data) => {
        if (err) {
            res.json({
                code: 400,
                msg: "MySql error" + err
            })
            return;
        }
        res.json({
            code: 200,
            msg: "添加成功"
        })
    })
})

router.get('/dataList/:id', (req, res) => {
    let id = req.params.id;
    conn.query('select * from data where id = ?', [id], (err, data) => {
        if (err) {
            res.json({
                code: 400,
                msg: "MySql error" + err
            })
            return;
        }
        res.json({
            code: 200,
            data: data[0]
        })
    })
})

router.delete('/dataList/:id', (req, res) => {
    let id = req.params.id;
    conn.query('delete from data where id = ?', [id], (err, data) => {
        if (err) {
            res.json({
                code: 400,
                msg: "MySql error" + err
            })
            return;
        }
        res.json({
            code: 200,
            msg: "删除成功"
        })
    })
})

router.put('/dataList/:id', (req, res) => {
    let id = req.params.id;
    conn.query('update data set ? where id =' + id, { ...req.body }, (err, data) => {
        if (err) {
            res.json({
                code: 400,
                msg: "MySql error" + err
            })
            return;
        }
        res.json({
            code: 200,
            msg: "更新成功"
        })
    })
})


module.exports = router