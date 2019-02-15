import jsonp from '../utils/jsonp'
import { commonParams, defaultOptions } from './config'

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
