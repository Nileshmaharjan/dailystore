<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h3>Bill List</h3>
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
                        <template v-slot:cell(actions)="data">
                            <button>
                                <b-icon @click="billDetail(data.item.key)" icon="eye-fill"></b-icon>
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
            name: 'BillListItem'
        },
        data() {
            return {
                perPage: 20,
                currentPage: 1,
                items: [],
                fields: [
                    { key: 'sn', label: 'SN' },
                    { key: 'customerId' },
                    { key: 'totalAmount' },
                    { key: 'discount' },
                    { key: 'purchasedDate' },
                    { key: 'actions', label: 'Actions'},
                ],
                sortBy: '',
                sortDesc: false,
            }
        },
        created() {
            db.collection('Bill').onSnapshot((snapshotChange) => {
                this.items = [];
                snapshotChange.forEach((doc) => {
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
            billDetail(id){
                this.$router.push(`/bill/detail/${id}`);
            }
        },
        computed: {
            rows() {
                return this.items.length
            }
        }
    }
</script>