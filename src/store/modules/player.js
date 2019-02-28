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

    },
    getters: {
        playing(state) {
            return state.playing
        },
        fullScreen(state) {
            return state.fullScreen
        },
        currentSong (state) {
            return state.playList[state.currentIndex] || {}
        }
    },
    actions: {

    }
}
