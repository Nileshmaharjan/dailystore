import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login'
import Register from '../components/Register'
import Home from '../components/Home'
import AddItem from '../components/AddItem'
import EditItem from '../components/EditItem'
import ListItem from '../components/ListItem'
import BillingItem from '../components/outgoing/Billing';

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/dashboard',
        name: 'Home',
        component: Home
    },
        {
            name: 'Add',
            path: '/add',
            component: AddItem
        },
        {
            name: 'Billing',
            path: '/bill',
            component: BillingItem
        },
        {
            name: 'Edit',
            path: '/edit/:id',
            component: EditItem
        },
        {
            name: 'List',
            path: '/index',
            component: ListItem
        },
]
});

export default router