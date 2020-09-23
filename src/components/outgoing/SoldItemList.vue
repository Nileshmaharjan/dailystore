// ListItem.vue

<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h3>Billing List</h3>
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
                    { key: 'sn', label: 'SN' },
                    { key: 'code', sortable: true },
                    { key: 'name', sortable: true },
                    { key: 'quantity', sortable: true },
                    { key: 'unit', sortable: false },
                    { key: 'unitAmount', label: 'Rate', sortable: false },
                    { key: 'discount', sortable: false },
                    { key: 'totalAmount', sortable: true },
                    { key: 'customerId', sortable: true },
                    { key: 'purchasedDate', sortable: true },
                ],
                sortBy: 'code',
                sortDesc: false,
            }
        },
        created() {
            db.collection('SoldItems').onSnapshot((snapshotChange) => {
                this.items = [];
                snapshotChange.forEach((doc) => {
                    this.items.push({
                        key: doc.id,
                        code: doc.data().code,
                        name: doc.data().name,
                        quantity: doc.data().quantity,
                        unit: doc.data().unit,
                        unitAmount: doc.data().unitAmount,
                        discount: doc.data().discount,
                        totalAmount: doc.data().totalAmount,
                        customerName: doc.data().customerName,
                        purchasedDate: doc.data().purchasedDate

                    })
                });
            })
        },

        methods: {
        },
        computed: {
            rows() {
                return this.items.length
            }
        }
    }
</script>