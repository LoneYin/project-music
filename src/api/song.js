import { ERR_OK, commonParams, server } from 'api/config'
import { getUid } from 'utils/uid'
import axios from 'axios'

export function getSongsUrl(songs) {
    const url = server + '/api/getPurlUrl'

    let mids = []
    let types = []

    songs.forEach(song => {
        mids.push(song.mid)
        types.push(0)
    })

    const urlMidParam = genUrlMid(mids, types)

    const data = {
        ...commonParams,
        ...{
            g_tk: 5381,
            format: 'json',
            platform: 'h5',
            needNewCode: 1,
            uin: 0
        }
    }

    return new Promise((resolve, reject) => {
        let tryTime = 3

        function request() {
            return axios
                .post(url, {
                    comm: data,
                    url_mid: urlMidParam
                })
                .then(response => {
                    const res = response.data
                    if (res.code === ERR_OK) {
                        let urlMid = res.url_mid
                        if (urlMid && urlMid.code === ERR_OK) {
                            const info = urlMid.data.midurlinfo[0]
                            if (info) {
                                res.guid = urlMidParam.param.guid
                                resolve(res)
                            } else {
                                retry()
                            }
                        } else {
                            retry()
                        }
                    } else {
                        retry()
                    }
                })
        }

        function retry() {
            if (--tryTime >= 0) {
                request()
            } else {
                reject(new Error('Can not get the songs url'))
            }
        }

        request()
    })
}

function genUrlMid(mids, types) {
    const guid = getUid()
    return {
        module: 'vkey.GetVkeyServer',
        method: 'CgiGetVkey',
        param: {
            guid,
            songmid: mids,
            songtype: types,
            uin: '0',
            loginflag: 0,
            platform: '23'
        }
    }
}
