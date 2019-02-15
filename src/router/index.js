import Vue from 'vue'
import Router from 'vue-router'

import Rank from 'views/Rank'
import Recommend from 'views/Recommend'
import Search from 'views/Search'
import Singer from 'views/Singer'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: '/recommend'
        },
        {
            path: '/rank',
            component: Rank
        },
        {
            path: '/recommend',
            component: Recommend
        },
        {
            path: '/search',
            component: Search
        },
        {
            path: '/singer',
            component: Singer
        }
    ]
})
