import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login'
import Register from '../components/Register'
import Home from '../components/Home'
import AddItem from '../components/incoming/AddItem'
import EditItem from '../components/incoming/EditItem'
import ListItem from '../components/incoming/ListItem'
import BillingListItem from '../components/outgoing/SoldItemList';
import AddNewBill from "../components/outgoing/AddNewBill";

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
    // {
    //     path: '/register',
    //     name: 'Register',
    //     component: Register
    // },
    {
        path: '/dashboard',
        name: 'Home',
        component: Home
    },
        {
            name: 'Add',
            path: '/item/add',
            component: AddItem
        },
        {
            name: 'Billing',
            path: '/bill/add',
            component: AddNewBill
        },
        {
            name: 'BillingList',
            path: '/bill/list',
            component: BillingListItem
        },

        {
            name: 'Edit',
            path: '/item/edit/:id',
            component: EditItem
        },
        {
            name: 'List',
            path: '/item/list',
            component: ListItem
        },
]
});

export default router