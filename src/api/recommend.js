import jsonp from '../utils/jsonp'
import { commonParams, defaultOptions, server } from './config'
import axios from 'axios'

export function getRecommend() {
    const url =
        'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

    const params = {
        ...commonParams,
        ...{
            platform: 'h5',
            uin: 0,
            needNewCode: 1
        }
    }

    return jsonp(url, params, defaultOptions)
}

export function getSongsheets() {
    const url = server + '/api/songsheets'

    const params = {
        ...commonParams,
        ...{
            platform: 'yqq',
            hostUin: 0,
            sin: 0,
            ein: 29,
            sortId: 5,
            needNewCode: 0,
            categoryId: 10000000,
            rnd: Math.random(),
            format: 'json'
        }
    }

    return axios
        .get(url, {
            params
        })
        .then(
            res => {
                return Promise.resolve(res.data)
            },
            err => {
                console.log(err)
            }
        )
}
