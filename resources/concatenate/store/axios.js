"use strict";

import Vue from 'vue';
import axios from "axios";
import store from '@/store'
import router from '@/router'
import { app } from '@/main'
import { config } from '@/config'
axios.defaults.baseURL = config.api;
axios.interceptors.request.use( config => {
    config.headers[ 'X-Requested-With' ] = 'XMLHttpRequest'
    const token = store.getters[ 'token' ]
    if ( token ) {
        config.headers[ 'Authorization' ] = 'Bearer ' + token
    }
    return config
}, error => {
    return Promise.reject( error )
} )
axios.interceptors.response.use( response => {
    return response
}, async error => {
	// if (store.getters['token']) {
    //     if (error.response.status === 401 && error.response.data.error.name === 'InvalidJwtToken') {
    //         const { data } = await axios.post('/login/refresh')
    //         store.dispatch('saveToken', data)
    //         return axios.request(error.config)
    //     } else if (error.response.status === 401) {
    //         store.dispatch('destroy')
    //         router.push({ name: 'login' })
    //     }
    // }
	if(error.response && error.response.data){
		if(error.response.data.info) app.$toast.info(error.response.data.info);
		else if(error.response.data.success) app.$toast.success(error.response.data.success);
		else if(error.response.data.warning) app.$toast.warning(error.response.data.warning);
		else if(error.response.data.danger) app.$toast.error(error.response.data.danger);
		else error.response.data.error && error.response.data.error.message !== undefined && app.$toast.error( error.response.data.error.message || 'Ошибка сервера' )
	}
    return Promise.reject( error )
})

Plugin.install = function(Vue, options) {
  Vue.axios = axios;
  window.axios = axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return axios;
      }
    },
    $axios: {
      get() {
        return axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
