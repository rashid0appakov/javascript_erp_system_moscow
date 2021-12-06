import Vue from 'vue'
import Vuetify from 'vuetify'
import ru from 'vuetify/es5/locale/ru'
import VueToast from 'vue-toast-notification'
Vue.use(Vuetify);
Vue.use(VueToast, { position: 'top-right' })

export default new Vuetify({
    lang: {
        locales: { ru },
        current: 'ru',
    },
	theme: {
        dark: window.localStorage.getItem('theme') != 'light',
        themes: {
            dark: {
                primary: '#3e6b93',
                secondary: '#333',
                accent: '#37474F',
                appbar: '#18222c',
                drawer: '#18222c',
            },
			light: {
			}
        }
    }
});