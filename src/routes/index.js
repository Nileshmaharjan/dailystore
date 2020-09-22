import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login'
import Register from '../components/Register'
import Home from '../components/Home'
import AddItem from '../components/incoming/AddItem'
import EditItem from '../components/incoming/EditItem'
import ListItem from '../components/incoming/ListItem'
import BillingItem from '../components/outgoing/Billing';
import BillingListItem from '../components/outgoing/SoldItemList';
import EditBillItem from "../components/outgoing/EditBillItem";

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
            path: '/bill',
            component: BillingItem
        },
        {
            name: 'BillingList',
            path: '/bill/list',
            component: BillingListItem
        },
        {
            name: 'EditBilling',
            path: '/bill/edit/:id',
            component: EditBillItem
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