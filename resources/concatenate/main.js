import Vue from 'vue'
import '@/plugins/ws'
import '@/plugins/axios'
import vuetify from '@/plugins/vuetify'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import moment from 'moment'
import VuetifyConfirm from 'vuetify-confirm'
import VuetifyUpload from '@/plugins/vuetify-upload'
import DatetimePicker from 'vuetify-datetime-picker'
import VueMask from 'v-mask'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import { config } from '@/config'

Vue.use(VueLodash, { lodash: lodash })

Vue.prototype.d_sale = 1
Vue.prototype.d_logistic = 2
Vue.prototype.d_legal = 3
Vue.prototype.d_project = 4
Vue.prototype.d_production = 5
Vue.prototype.d_mount = 6
Vue.prototype.d_supply = 7
Vue.prototype.d_accounting = 8
Vue.prototype.d_hr = 9
Vue.use(DatetimePicker)
Vue.use(VueMask);
Vue.use(VuetifyUpload, { vuetify })
Vue.use(VuetifyConfirm, {
	vuetify,
	buttonTrueText: 'Принять',
	buttonFalseText: 'Отменить',
})
moment.locale('ru');
window.moment = moment
Vue.config.productionTip = false
const sounds = {
	auth: '/sounds/1.wav'
}
Vue.mixin({
	data(){
		return {
			storage: config.storage,
			enableWs: config.enableWs
		}
	},
	methods: {
		play(key) {
			if(!key) return false
			const sound = sounds[key] || key
			var audio = new Audio(sound);
			audio.play();
		}
	}
})
Vue.filter('moment', (date, format) => {
	if(!date) return ''
	return format == 'fromNow' ? moment(date).fromNow() : moment(date).format(format || 'DD.MM.YYYY HH:mm');
})
export const app = new Vue({
  el: '#app',
  router,
  vuetify,
  store,
  components: { App },
  template: '<App/>'
})