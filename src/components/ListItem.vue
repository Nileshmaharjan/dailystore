// ListItem.vue

<template>
    <div>
        <h1>List Item</h1>
        <table class="table table-striped">
            <thead>
            <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Item Price</th>
                <th>Quantity</th>
                <th>Unit Amount</th>
                <th>Total Amount</th>
                <th>Supplier</th>
                <th>Purchased Date</th>
                <th colspan="2">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item of items" :key="item['.key']">
                <td>{{ item.code }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.unitAmount }}</td>
                <td>{{ item.totalAmount }}</td>
                <td>{{ item.supplier }}</td>
                <td>{{ item.purchasedDate }}</td>

                <td>
                    <router-link :to="{ name: 'Edit', params: {id: item.key} }" class="btn btn-warning">
                        Edit
                    </router-link>
                    <button @click.prevent="deleteItem(item.key)" class="btn btn-danger">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

    import { db } from '../config/db';

    export default {
        components: {
            name: 'ListItem'
        },
        data() {
            return {
                items: []
            }
        },
        created() {
            db.collection('items').onSnapshot((snapshotChange) => {
                this.items = [];
                snapshotChange.forEach((doc) => {
                    this.items.push({
                        key: doc.id,
                        code: doc.data().code,
                        name: doc.data().name,
                        price: doc.data().price,
                        quantity: doc.data().price,
                        unitAmount: doc.data().price,
                        totalAmount: doc.data().price,
                        supplier: doc.data().price,
                        purchasedDate: doc.data().purchasedDate

                    })
                });
            })
        },

        methods: {
            deleteItem(id){
                if (window.confirm("Do you really want to delete?")) {
                    db.collection("items").doc(id).delete().then(() => {
                        console.log("Document deleted!");
                    })
                        .catch((error) => {
                            console.error(error);
                        })
                }
            }
        }
    }
</script>