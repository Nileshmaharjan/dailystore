// ListItem.vue

<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h3>List Item</h3>
            </div>
            <div class="card-body">
                <div>
                    <b-pagination
                            v-model="currentPage"
                            :per-page="perPage"
                            aria-controls="my-table"
                            :total-rows="rows"
                    ></b-pagination>
                    <b-table
                            :items="items"
                            :fields="fields"
                            :sort-by.sync="sortBy"
                            :sort-desc.sync="sortDesc"
                            :per-page="perPage"
                            :current-page="currentPage"
                            sort-icon-left
                            responsive="sm"
                    >
                        <template v-slot:cell(sn)="data">
                            {{data.index + 1}}
                        </template>
                        <template v-slot:cell(actions)="data">
                            <button @click="editItem(data.item.key)" class="btn btn-warning">Edit</button>
                            <button @click.prevent="deleteItem(data.item.key)" class="btn btn-danger">Delete</button>
                        </template>

                    </b-table>
                </div>
            </div>
        </div>
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
                perPage: 5,
                currentPage: 1,
                items: [],
                fields: [
                    { key: 'sn', label: 'SN' },
                    { key: 'code', sortable: true },
                    { key: 'name', sortable: true },
                    { key: 'quantity', sortable: true },
                    { key: 'unit', sortable: false },
                    { key: 'unitAmount', sortable: false },
                    { key: 'totalAmount', sortable: true },
                    { key: 'supplier', sortable: true },
                    { key: 'purchasedDate', sortable: true },
                    { key: 'actions', label: 'Actions'},
                ],
                sortBy: 'code',
                sortDesc: false,
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
                        quantity: doc.data().quantity,
                        unit: doc.data().unit,
                        unitAmount: doc.data().unitAmount,
                        totalAmount: doc.data().totalAmount,
                        supplier: doc.data().supplier,
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
            },
            editItem(id){
                this.$router.push(`/edit/${id}`);
            }
        },
        computed: {
            rows() {
                return this.items.length
            }
        }
    }
</script>