import Vue from 'vue'
import WsPlugin from 'adonis-vue-websocket'
import { config } from '@/config'
if(config.enableWs)
    Vue.use(WsPlugin, { adonisWS: window.adonis.Ws })

export default {}