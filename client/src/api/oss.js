import OSS from 'ali-oss'

function postImg(token, file, path = 'ibq') {

    return new Promise(async (resolve, rejext) => {
        let client = new OSS({
            region: 'oss-cn-shanghai',
            accessKeyId: token.AccessKeyId,
            accessKeySecret: token.AccessKeySecret,
            stsToken: token.SecurityToken,
            bucket: "itsse",
            secure: true
        })
        let filename = Date.now() + "." + file.name.replace(/.+\./, "");
        let newDate = new Date();
        let strData = `${newDate.getFullYear()}/${newDate.getMonth() + 1}/${newDate.getDate()}/`


        try {
            let res = await client.multipartUpload(`/${path}/` + strData + filename, file, {
                progress: function (p, checkpoint) {
                    console.log(p); // 序号 
                },
            });
            if (res.res.status == 200) {
                let resUrl = res.res.requestUrls[0];
                resolve(resUrl.split("?")[0])
            }
        } catch (e) {
            rejext(e)
            console.log(e);
        }
    })
}
export default postImg