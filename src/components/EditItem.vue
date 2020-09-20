// EditItem.vue

<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h3>Edit Item</h3>
            </div>
            <div class="card-body">
                <form v-on:submit.prevent="updateItem">
                    <div class="form-group">
                        <label>Item Number:</label>
                        <input type="text" v-model="newItem.code" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label>Item Name:</label>
                        <input type="text" class="form-control" v-model="newItem.name"/>
                    </div>
                    <div class="form-group">
                        <label>Item Price:</label>
                        <input type="text" class="form-control" v-model="newItem.price" />
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
                        <input type="submit" class="btn btn-primary" value="Update Item"/>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>

    import { db } from '../config/db';

    export default {
        components: {
            name: 'EditItem'
        },
        data () {
            return {
                newItem: {}
            }
        },
        created() {
            let dbRef = db.collection('items').doc(this.$route.params.id);
            dbRef.get().then((doc) => {
                this.newItem = doc.data();
            }).catch((error) => {
                console.log(error)
            })
        },
        methods: {
            updateItem(event) {
                event.preventDefault()
                db.collection('items').doc(this.$route.params.id)
                    .update(this.newItem).then(() => {
                    console.log("Item successfully updated!");
                    this.$router.push('/index')
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
    }
</script>