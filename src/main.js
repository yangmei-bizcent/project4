// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store/index'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import el from 'element-ui'
import ts from 'tesla-ui'
import 'tesla-ui/dist/index.css'
import './util/directives'
Vue.use(el)
Vue.use(ts)

Vue.use(Vuex)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
