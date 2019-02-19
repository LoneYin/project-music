import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'assets/style/base.less'

import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

fastclick.attach(document.body)
Vue.use(VueLazyload, {
    loading: require('./assets/image/default.jpg')
})
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
