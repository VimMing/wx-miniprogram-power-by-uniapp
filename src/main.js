import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Vue.prototype.$color = { primary: "#ff272e" };
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
