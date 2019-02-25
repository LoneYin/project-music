import * as types from '../mutation-types'
 
export default {
    state: {
        currentSinger: undefined
    },
    mutations: {
        [types.SET_SINGER](state, singer) {
            state.currentSinger = singer
        }
    }
}
