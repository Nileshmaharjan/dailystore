import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login'
import Register from '../components/Register'
import Home from '../components/Home'
import AddItem from '../components/incoming/AddItem'
import EditItem from '../components/incoming/EditItem'
import ListItem from '../components/incoming/ListItem'
import SoldListItem from '../components/outgoing/SoldItemList';
import BillList from "../components/outgoing/BillList";
import AddNewBill from "../components/outgoing/AddNewBill";
import BillDetail from "../components/outgoing/BillDetail";

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
            name: 'SoldList',
            path: '/sold/list',
            component: SoldListItem
        },
        {
            name: 'BillList',
            path: '/bill/list',
            component: BillList
        },
        {
            name: 'BillDetail',
            path: '/bill/detail/:id',
            component: BillDetail
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