import { ERR_OK } from 'api/config'
import { getSongsUrl } from 'api/song'

export default class Song {
    constructor({ id, mid, singer, name, album, duration, image, url }) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }
}

export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
            musicData.albummid
        }.jpg?max_age=2592000`,
        url: musicData.url
    })
}

function filterSinger(singer) {
    const result = []
    if (!singer) {
        return ''
    }
    singer.forEach(item => {
        result.push(item.name)
    })
    return result.join('/')
}

export function processSongsUrl(songs) {
    if (!songs.length) {
        return Promise.resolve(songs)
    }
    return getSongsUrl(songs).then(res => {
        if (res.code === ERR_OK) {
            let midUrlInfo = res.url_mid.data.midurlinfo
            let _vkey = ''
            for (let item of midUrlInfo) {
                if (item.vkey) {
                    _vkey = item.vkey
                    break
                }
            }
            midUrlInfo.forEach((info, index) => {
                let song = songs[index]
                if (info.purl) {
                    song.url = info.purl
                } else if (_vkey) {
                    song.url = `http://dl.stream.qqmusic.qq.com/${
                        info.filename
                    }?guid=${res.guid}&vkey=${info.vkey || _vkey}&uin=0&fromtag=38`
                } else {
                    song.url = ''
                }
            })
        }
        return songs
    })
}
