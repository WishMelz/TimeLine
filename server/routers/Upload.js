const express = require('express')
const router = express.Router();
const conn = require('../db');
const jwt = require('jsonwebtoken')
const config = require('../config')
let { alists } = require('../config')
let OSS = require('ali-oss');
let STS = OSS.STS;
let sts = new STS({
    accessKeyId: alists.accessKeyId,
    accessKeySecret: alists.accessKeySecret
});
router.get('/getSts', async (req, res) => {
    try {
        let token = await sts.assumeRole(alists.ram, null, '3600', 'demo-bucket');
        res.json({
            code: 200,
            data: token.credentials
        })
    } catch (e) {
        console.log(e);
        res.json({
            code: 400,
            msg: "系统异常"
        })
    }
})


module.exports = router;