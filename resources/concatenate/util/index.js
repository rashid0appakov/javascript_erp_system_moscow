import Vue from 'vue'
import Vuex from 'vuex'
import { config } from '@/config'
Vue.use( Vuex )
export default new Vuex.Store( {
    state: {
        token: window.localStorage.getItem( 'token' ),
        globalsLoaded: false,
        connected: false,
        loading: false,
        user: null,
        newMessage: false,
        newNotification: false,
        // globals
        users: [],
        notifications: [],
        messages: [],
        settings: {},
        departaments: [],
        permissions: [],
        roles: [],
        leads: [],
        // ws
        onlineUsers: []
    },
    getters: {
        subdepartaments: state => parent_id => state.departaments.filter( d => d.parent_id == parent_id),
        departament: state => id => state.departaments.find( d => d.id == id),
        departaments: state => state.departaments.filter( d => !d.parent_id),
        allDepartaments: state => state.departaments,
        globalsLoaded: state => state.globalsLoaded,
        leads: state => state.leads,
        onlineUsers: state => state.onlineUsers,
        roles: state => state.roles,
        permissions: state => state.permissions,
        settings: state => state.settings,
        connected: state => state.connected,
        users: state => state.users,
        messages: state => state.messages,
        newMessage: state => state.newMessage,
        notifications: state => state.notifications,
        token: state => state.token,
        loading: state => state.loading,
        check: state => state.user,
        user: state => state.user,
        can: ( state ) => p => state.user && ( state.user.role.permissions.indexOf( p ) > -1 || ( state.user.role && state.user.role.id == 1 ) ),
    },
    actions: {
        // ws
        disconnect({commit}){
            Vue.ws.disconnect()
            commit('disconnect')
        },
        connect({commit}, user){
            if(!config.enableWs) return false
            Vue.ws.disconnect()
            const token = window.localStorage.getItem( 'token' )
            Vue.ws.connect({
                wsDomain: config.ws,
                jwtToken: token
            }, {
                path: 'adonis-ws',
                reconnectionAttempts: 300,
                reconnectionDelay: 5000
            });
            Vue.ws.socket.on("open", () => {
                commit('connect')
                const myChannel = Vue.ws.subscribe('user:' + user.id)
                myChannel.on('notifications', data => {
                    commit('notifications', data)
                })
                const mainChannel = Vue.ws.subscribe('main')
                mainChannel.on('update_users', data => {
                    commit('update_users', data)
                })
                mainChannel.on('update_user', data => {
                    commit('setUser', data)
                })
                mainChannel.on('update_departaments', data => {
                    commit('loadDepartaments', data)
                })
                const chatChannel = Vue.ws.subscribe('chat')
                chatChannel.on('error', err => {
                    console.log(err)
                })
                chatChannel.on('message', data => {
                    commit('chat_message', data)
                    commit('new_message', true)
                })
            });
            Vue.ws.socket.on("close", () => {
                commit('disconnect')
            })
            Vue.ws.socket.on("error", err => {
                console.log(err)
                commit('disconnect')
            })
        },
        toggleNewMessage({commit}){ commit('new_message', false)},
        // 
        load( { commit } ) { commit( 'load' ) },
        unload( { commit } ) { commit( 'unload' ) },
        saveToken( { commit }, payload ) { commit( 'setToken', payload ) },
        setUser( { commit }, payload ) { commit( 'setUser', payload ) },
        destroy( { commit } ) { commit( 'logout' ) },
        async close_notification({commit}, payload) {
            await axios.delete('/notifications/'+payload)
            commit('close_notification', payload)
        },
        async loadGlobals({commit}, user) {
            try{
                const settings = await axios.get('/settings')
                const users = await axios.get('/users')
                const departaments = await axios.get('/departaments')
                const permissions = await axios.get('/permissions')
                const roles = await axios.get('/roles')
                const messages = await axios.get('/messages/getChat')
                const notifications = await axios.get('/users/'+user.id+'/notifications')
                commit('loadSettings', settings.data)
                commit('loadUsers', users.data)
                commit('loadDepartaments', departaments.data)
                commit('loadRoles', roles.data)
                commit('loadPermissions', permissions.data)
                commit('loadMessages', messages.data)
                commit('loadNotifications', notifications.data)
            }catch(e){
                console.log(e)
            }
        },
        globalsLoaded( {commit} ) {
            commit('globalsLoaded')
        },
        async setSettings( {commit}, payload ) {
            try {
                const {data} = axios.post('/settings', payload)
                commit('setSettings', data)
            }catch(e){}
        },
        async fetchUser( { commit } ) {
            try {
                const { data } = await axios.get( '/me' )
                commit( 'setUser', data )
            } catch ( e ) {
                commit( 'fetchFail' )
            }
        }
    },
    mutations: {
        chat_message(state, data){
            state.messages.push(data)
            if(state.messages.length > 20) state.messages.splice(0, 1)
        },
        close_notification(state, id){ state.notifications.splice(state.notifications.findIndex(n => n.id == id), 1)},
        notifications(state, data){ state.notifications = data},
        new_message(state, data){ state.newMessage = data},
        globalsLoaded(state){ state.globalsLoaded = 1 },
        update_users(state, data) { state.onlineUsers = data},
        connect(state){ state.connected = true },
        disconnect(state){state.connected = false},
        load( state ) { state.loading = true },
        unload( state ) { state.loading = false },
        setUser( state, data ) { state.user = data },
        setSettings( state, data) { state.settings[data.key] = data.value },
        loadSettings(state, data) { state.settings = data },
        loadUsers(state, data) { state.users = data },
        loadRoles(state, data) { state.roles = data },
        loadDepartaments(state, data) { state.departaments = data },
        loadNotifications(state, data) { state.notifications = data },
        loadMessages(state, data) { state.messages = data },
        loadPermissions(state, data) { state.permissions = data },
        loadLeads(state, data) { state.leads = data},
        loadNotifications(state, data) { state.notifications = data },
        logout( state ) {
            state.user = null
            state.token = null
            state.globalsLoaded = false
            window.localStorage.removeItem( 'token' )
        },
        fetchFail( state ) {
            state.user = null
            window.localStorage.removeItem( 'token' )
        },
        setToken( state, token ) {
            state.token = token
            window.localStorage.setItem( 'token', token )
        }
    }
} )
