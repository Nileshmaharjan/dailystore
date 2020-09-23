// ListItem.vue

<template>
    <div class="container" style="padding: 0" >
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
                            <button>
                                <b-icon @click="editItem(data.item.key)" icon="pencil"></b-icon>
                            </button>
                            <button>
                                <b-icon @click.prevent="deleteItem(data.item.key)" icon="trash"></b-icon>
                            </button>
                        </template>

                    </b-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import { db } from '../../config/db';

    export default {
        components: {
            name: 'ListItem'
        },
        data() {
            return {
                perPage: 20,
                currentPage: 1,
                items: [],
                fields: [
                    { key: 'sn', label: 'SN', align: 'center' },
                    { key: 'code', sortable: true, align: 'center'},
                    { key: 'name', sortable: true, align: 'center' },
                    { key: 'quantity', sortable: true, align: 'center' },
                    { key: 'remainingQuantity', sortable: true, align: 'center' },
                    { key: 'unit', sortable: false, align: 'center' },
                    { key: 'rate', label: 'Rate', sortable: false, align: 'center'},
                    { key: 'totalAmount', sortable: true, align: 'center' },
                    { key: 'supplier', sortable: true, align: 'center' },
                    { key: 'purchasedDate', sortable: true, align: 'center' },
                    { key: 'actions', label: 'Actions'},
                ],
                sortBy: '',
                sortDesc: false,
            }
        },
        created() {
            db.collection("items").onSnapshot((snapshotChange) => {
                this.items = [];
                snapshotChange.forEach((doc) => {
                    this.items.push({
                        key: doc.id,
                        code: doc.data().code,
                        name: doc.data().name,
                        quantity: doc.data().quantity,
                        remainingQuantity: doc.data().remainingQuantity,
                        unit: doc.data().unit,
                        rate: doc.data().rate,
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
                this.$router.push(`/item/edit/${id}`);
            }
        },
        computed: {
            rows() {
                return this.items.length
            }
        }
    }
</script>