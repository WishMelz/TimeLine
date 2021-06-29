const express = require('express');
const app = express();
const { server } = require('./config')
const bodyParser = require('body-parser');
app.use(require('cors')())
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())
app.use(express.static('./public'))

app.use(server.pre, require('./routers/Login'))
app.use(server.pre, require('./routers/TimeLine'))
app.use(server.pre, require('./routers/Upload'))

app.listen(server.port, () => {
    console.log('sever run to http://127.0.0.1:' + server.port);
})