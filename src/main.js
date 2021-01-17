import Vue from 'vue'
import App from './App'

// 引入sockte.io 模块
import io from './common/socket/weapp.socket.io.js'

Vue.config.productionTip = false
Vue.prototype.serverUrl = 'http://192.168.1.107:3000'
Vue.prototype.socket = io('http://192.168.1.107:8082') 

App.mpType = 'app' 

const app = new Vue({
	...App
})
app.$mount() 
