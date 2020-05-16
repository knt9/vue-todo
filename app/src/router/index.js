import Vue from 'vue'
import VueRouter from 'vue-router'
import ToDo from '@/components/ToDo.vue'
import Edit from '@/components/Edit.vue'
import Login from '@/components/Login.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vuejsDatepicker from 'vuejs-datepicker'
Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(vuejsDatepicker)

const routes = [{
    path: '/',
    name: 'Login',
    component: Login
}, {
    path: '/todo',
    name: 'ToDo',
    component: ToDo
}, {
    path: '/edit/:id',
    name: 'Edit',
    component: Edit
}, ]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router