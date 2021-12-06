import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use( VueRouter )
import store from '@/store'
import guest from '@/router/middleware/guest'
import auth from '@/router/middleware/auth'
import can from '@/router/middleware/can'
import middlewarePipeline from '@/router/middlewarePipeline'
import Login from '@/views/login'
import NotFound from '@/views/404'
import Home from '@/views/home'
import Customers from '@/views/customers'
import Profile from '@/views/profile'
import Moderation from '@/views/moderation'
import Inbox from '@/views/inbox'
import Tasks from '@/views/tasks'
import Records from '@/views/records'
// Settings
import Roles from '@/views/settings/roles'
import Users from '@/views/settings/users'
import Lists from '@/views/settings/lists'
import Templates from '@/views/settings/templates'
import Funnels from '@/views/settings/funnels'
import Stocks from '@/views/stocks'
import Departaments from '@/views/departaments/index'
const router = new VueRouter( {
    mode: 'history',
    routes: [
		{ path:'/login', name: 'login', component: Login, meta: { middleware: [ guest ] } },
        { path:'/', name: 'home', component: Home, meta: { middleware: [ auth ] } },
        { path:'/customers', name: 'customers', component: Customers },
        { path:'/moderation', name: 'moderation', component: Moderation, meta: { middleware: [ can('moderation') ] } },
        { path:'/stocks', name: 'stocks', component: Stocks },
        { path:'/tasks', name: 'tasks', component: Tasks },
        { path:'/departaments/:id', name: 'departaments', component: Departaments, meta: { middleware: [ auth ] } },
        { path:'/settings/users', name: 'users', component: Users, meta: { middleware: [ can( 'control_users' ) ] } },
        { path:'/settings/lists', name: 'lists', component: Lists, meta: { middleware: [ can( 'control_lists' ) ] } },
        { path:'/settings/roles', name: 'roles', component: Roles, meta: { middleware: [ can( 'control_roles' ) ] } },
        { path:'/settings/templates', name: 'templates', component: Templates, meta: { middleware: [ can( 'control_templates' ) ] } },
        { path:'/settings/funnels', name: 'funnels', component: Funnels, meta: { middleware: [ can( 'control_funnels' ) ] } },
        // 
        { path:'/users/:id', name: 'profile', component: Profile, meta: { middleware: [ auth ] } },
        { path:'/inbox', name: 'inbox', component: Inbox, meta: { middleware: [ auth ] } },
        { path:'/records', name: 'records', component: Records, meta: { middleware: [ auth ] } },
        
		{ path:'*', name: '404', component: NotFound },
    ]
} )
router.beforeEach( async ( to, from, next ) => {
    if ( store.getters.token && !store.getters.check ) {
        store.dispatch('load')
        try {
            await store.dispatch( 'fetchUser' )
        } catch ( err ) {
        }finally{store.dispatch('unload')}
    }
    if ( store.getters.token && !store.getters.globalsLoaded ) {
        store.dispatch('load')
        try {
            await store.dispatch( 'loadGlobals', store.getters.user)
            store.dispatch('connect', store.getters.user)
            store.dispatch('globalsLoaded')
        } catch ( err ) {
        }finally{store.dispatch('unload')}
    }
    if ( !to.meta.middleware ) {
        return next()
    }
    const middleware = to.meta.middleware
    const context = { to, from, next, store }
    return middleware[ 0 ]( {
        ...context,
        next: middlewarePipeline( context, middleware, 1 )
    } )
} )
export default router
