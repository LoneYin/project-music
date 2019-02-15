import originJsonp from 'jsonp'

export default function jsonp(url, param, option) {
    return new Promise((resolve, reject) => {
        originJsonp(paramUrl(url, param), option, (err, res) => {
            if (!err) {
                resolve(res)
            } else {
                reject(err)
            }
        })
    })
}

function paramUrl(url, param) {
    let paramStr = ''
    for (let key in param) {
        let value = param[key] !== undefined ? param[key] : ''
        paramStr += `&${key}=${encodeURIComponent(value)}`
    }
    url.indexOf('?') < 0 ? (url += '?') : (url += '&')
    return paramStr ? url + paramStr.substring(1) : url
}
