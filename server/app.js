const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    next()
})

app.use(bodyParser.text())

app.get('/api/songsheets', (req, res) => {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    axios
        .get(url, {
            headers: {
                referer: 'https://c.y.qq.com/',
                host: 'c.y.qq.com'
            },
            params: req.query
        })
        .then(response => {
            res.json(response.data)
        })
        .catch(err => {
            console.log(err)
        })
})

app.post('/api/getPurlUrl', bodyParser.json(), function(req, res) {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    axios
        .post(url, req.body, {
            headers: {
                referer: 'https://y.qq.com/',
                origin: 'https://y.qq.com',
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            res.json(response.data)
        })
        .catch(e => {
            console.log(e)
        })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
