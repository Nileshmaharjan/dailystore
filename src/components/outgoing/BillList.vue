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
                            :per-page="perPage"
                            :current-page="currentPage"
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
            name: 'BillListItem'
        },
        data() {
            return {
                perPage: 20,
                currentPage: 1,
                items: [],
                fields: [
                    { key: 'sn', label: 'SN' },
                    { key: 'discount' },
                    { key: 'totalAmount' },
                    { key: 'customerId' },
                    { key: 'purchasedDate' },
                ],
                sortBy: '',
                sortDesc: false,
            }
        },
        created() {
            db.collection('Bill').onSnapshot((snapshotChange) => {
                this.items = [];
                snapshotChange.forEach((doc) => {
                    console.log('data', doc.data());
                    this.items.push({
                        key: doc.id,
                        discount: doc.data().discount,
                        totalAmount: doc.data().totalAmount,
                        customerId: doc.data().customerId,
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