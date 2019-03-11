import * as types from '../mutation-types'
import playMode from 'utils/playMode'

export default {
    state: {
        playing: false,
        fullScreen: false,
        playList: [],
        sequenceList: [],
        mode: playMode.sequence,
        currentIndex: -1
    },
    mutations: {
        [types.SET_PLAYING](state, status) {
            state.playing = status
        },
        [types.SET_FULL_SCREEN](state, status) {
            state.fullScreen = status
        },
        [types.SET_PLAYLIST](state, list) {
            state.playList = list
        },
        [types.SET_SEQUENCE_LIST](state, list) {
            state.sequenceList = list
        },
        [types.SET_PLAY_MODE](state, mode) {
            state.mode = mode
        },
        [types.SET_CURRENT_INDEX](state, index) {
            state.currentIndex = index
        }
    },
    getters: {
        playing: state => state.playing,
        fullScreen: state => state.fullScreen,
        playList: state => state.playList,
        sequenceList: state => state.sequenceList,
        mode: state => state.mode,
        currentSong: state => state.playList[state.currentIndex] || {},
        currentIndex: state => state.currentIndex
    },
    actions: {
        playSongFromSingerDetail({ commit, state }, { list, index }) {
            commit(types.SET_SEQUENCE_LIST, list)
            commit(types.SET_PLAYLIST, list)
            commit(types.SET_CURRENT_INDEX, index)
            commit(types.SET_FULL_SCREEN, true)
            commit(types.SET_PLAYING, true)
        }
    }
}
