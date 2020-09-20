<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h3>Add Item</h3>
            </div>
            <div class="card-body">
                <form v-on:submit.prevent="addItem">
                    <div class="form-group">
                        <label>Item Number:</label>
                        <input type="text" v-model="newItem.code" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label>Item Name:</label>
                        <input type="text" v-model="newItem.name" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label>Item Price:</label>
                        <input type="text" v-model="newItem.price" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label>Quantity:</label>
                        <input type="text" v-model="newItem.quantity" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label>Unit Amount:</label>
                        <input type="text" v-model="newItem.unitAmount" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label>Total Amount:</label>
                        <input type="text" v-model="newItem.totalAmount" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label>Supplier:</label>
                        <input type="text" v-model="newItem.supplier" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label>Supplied Date:</label>
                        <input type="text" v-model="newItem.purchasedDate" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <input type="submit" class="btn btn-primary" value="Add Item"/>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    /* eslint-disable no-console */


    import { db } from '../config/db';

    export default {
        components: {
            name: 'AddItem'
        },
        // firebase: {
        //     items: db.ref('items')
        // },
        data () {
            return {
                newItem: {
                    code: null,
                    name: '',
                    price: '',
                    quantity:'',
                    unitAmount: '',
                    totalAmount: '',
                    supplier: '',
                    purchasedDate: '',
                }
            }
        },

        mounted() {
           console.log(db);
        },
        methods: {
            addItem() {
                db.collection('items').add(this.newItem).then(() => {
                    alert("User successfully created!");
                    this.newItem.name = ''
                    this.newItem.price = ''
                }).catch((error) => {
                    console.log(error);
                });
                this.$router.push('/index')
            }
        }
    }
</script>