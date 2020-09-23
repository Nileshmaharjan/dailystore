<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h3>Billing Detail</h3>
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
                    <div class="label label-danger">Customer Id: {{ customerId }}</div>
                    <div class="label label-danger">Total Paid Amount: {{ totalAmount }}</div>
                    <div class="label label-danger">Total Discount: {{ discount }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import { db } from '../../config/db';

    export default {
        components: {
            name: 'BillDetail'
        },
        data() {
            return {
                perPage: 20,
                currentPage: 1,
                items: [],
                fields: [
                    { key: 'sn', label: 'SN' },
                    { key: 'code', },
                    { key: 'name' },
                    { key: 'quantity' },
                    { key: 'unit' },
                    { key: 'rate' },
                    { key: 'totalAmount' },
                ],
                sortBy: '',
                sortDesc: false,
                totalAmount: 0,
                discount: 0,
                customerId: ''
            }
        },
        created() {
            let dbRef = db.collection("Bill").doc(this.$route.params.id);
            dbRef.get().then((doc) => {
               const itemCollection = doc.data();
               this.totalAmount = doc.data().totalAmount;
               this.discount = doc.data().discount;
               this.customerId = doc.data().customerId;

               itemCollection.itemList.forEach((val) => {
                   this.items.push({
                       code: val.code,
                       name: val.name,
                       purchasedDate: val.purchasedDate,
                       quantity: val.quantity,
                       rate: val.rate,
                       totalAmount: val.totalAmount,
                       unit: val.unit
                   })
               })
            }).catch((error) => {
                console.log(error)
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