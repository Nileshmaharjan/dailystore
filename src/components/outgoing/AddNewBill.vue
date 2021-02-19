<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h3>Billing System</h3>
            </div>
            <div class="card-body">
                <div class="col-12">
                         <span class="col-12">
                              <label>Supplied Date</label>
                              <b-form-datepicker style="width: 50%;display: inline-block" v-model="newBillingItem.purchasedDate" locale="en"></b-form-datepicker>
                         </span>
                </div>
                <div class="col-12" style="padding-bottom: 20px">
                        <span class="form-group col-6">
                            <label>Customer Id: </label>
                            <input
                                    v-model="customerId"
                                    type="number"
                                    class="ml-4"
                            />
                        </span>
                        <span class="form-group col-6">
                            <label>Customer Mobile Number: </label>
                            <input
                                    v-model="customerMobileNumber"
                                    type="number"
                                    class="ml-4"
                            />
                        </span>

                        <span class="col-6">
                             <b-button v-b-modal="'my-modal'" class="ml-2" @click="toggleModal" ref="btnToggle">Add Item</b-button>
                        </span>
                    </div>
                <b-modal id="my-modal"hide-footer no-close-on-backdrop hide-header-close>
                    <ValidationObserver ref="adForm">
                    <form v-on:submit.prevent="addNewBillItem">
<!--                        <ValidationProvider name="code" rules="required">-->
<!--                            <div slot-scope="{ errors }">-->
                                <div class="form-group">
                                    <label>Item Number:</label>
                                    <multiselect
                                            :searchable="true"
                                            v-model="newBillingItem.code"
                                            :options="options"
                                            @select="getFr"
                                    >
                                    </multiselect>
<!--                                    <b-form-input-->
<!--                                           -->
<!--                                            :options="codeOptions"-->
<!--                                            @change="getItemDetails(newBillingItem.code)"-->
<!--                                            @search="fetchOptions"-->
<!--                                            @input="selectedOption"-->
<!--                                    ></b-form-input>-->
<!--                                    <p>{{ errors[0] }}</p>-->
                                </div>
<!--                            </div>-->
<!--                        </ValidationProvider>-->
                        <ValidationProvider name="name" rules="required">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Item Name:</label>
                                    <input type="text" v-model="newBillingItem.name" class="form-control" disabled/>
                                </div>
                                <p>{{ errors[0] }}</p>
                            </div>
                        </ValidationProvider>
                        <ValidationProvider name="quantity" :rules="`required|min:1|max:10|greaterThanZero:${newBillingItem.quantity}`">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Quantity:</label>
                                    <input type="number" min="0" v-model="newBillingItem.quantity" class="form-control" @change="calculateTotalAmount"/>
                                    <p>{{ errors[0] }}</p></div>
                            </div>
                        </ValidationProvider>
                        <ValidationProvider name="unit" rules="required">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Unit</label>
                                    <b-form-select v-model="newBillingItem.unit" :options="options"></b-form-select>
                                    <p>{{ errors[0] }}</p></div>
                            </div>
                        </ValidationProvider>
                        <ValidationProvider name="unit amount" :rules="`required|min:1|max:10|greaterThanZero:${newBillingItem.rate}`">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Rate:</label>
                                    <input type="number" min="0" v-model="newBillingItem.rate" class="form-control" @change="calculateTotalAmount" disabled/>
                                    <p>{{ errors[0] }}</p></div>
                            </div>
                        </ValidationProvider>
                        <ValidationProvider name="total amount" rules="required|min:1|max:10">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Total Amount:</label>
                                    <input type="number" min="0" v-model="newBillingItem.totalAmount" class="form-control" disabled/>
                                    <p>{{ errors[0] }}</p></div>
                            </div>
                        </ValidationProvider>
                        <div class="form-group">
                            <input type="submit"  style="margin-right: 20px" class="btn btn-primary" value="Add Item" :disabled="saving"/>
                            <b-button @click="toggleModal" >Cancel</b-button>
                        </div>
                    </form>
                    </ValidationObserver>
                </b-modal>
                <div class="col-12">
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
                            <button @click="editItem(data.index)">
                                <b-icon icon="pencil"></b-icon>
                            </button>
                            <button @click.prevent="deleteItem(data.index)">
                                <b-icon icon="trash"></b-icon>
                            </button>
                        </template>
                    </b-table>
                    <div class="col-4" style="padding-bottom: 20px">
                        <label>Discount</label>
                        <b-input type="number" min="0" v-model="discount" class="form-control ml-2"/>
                    </div>
                    <div class="col-4">
                        <label>Total Amount</label>
                        <b-input type="number" v-model="total" class="form-control ml-2" disabled/>
                    </div>

                </div>

                <div class="col-12">
                    <b-row align-h="end">
                        <b-col cols="7"></b-col>
                        <b-col cols="1">
                            <button @click.prevent="saveItemCollection">
                                Save
                            </button>
                        </b-col>
                    </b-row>
                </div>

            </div>
        </div>
    </div>

</template>

<script>
    import {db} from "../../config/db";
    import {itemValue} from "../../config/value";
    import { ValidationProvider,ValidationObserver } from 'vee-validate';
    import Multiselect from 'vue-multiselect';

    export default {
        name: "AddNewBill.vue",
        components: {
            Multiselect,
            ValidationProvider,
            ValidationObserver,
            // MultiSelect,
        },
        data() {
            return {
                newBillingItem: {
                    code: null,
                    name: '',
                    unit: '',
                    quantity:0,
                    rate: 0,
                    totalAmount: 0,
                    customerId: '',
                    purchasedDate: ''
                },
                options: [
                    '1', '2','3'
                ],
                codeOptions: itemValue,
                perPage: 10,
                currentPage: 1,
                fields: [
                    { key: 'sn', label: 'SN' },
                    { key: 'code' },
                    { key: 'name'},
                    { key: 'quantity' },
                    { key: 'unit' },
                    { key: 'rate', label: 'Rate' },
                    { key: 'totalAmount', },
                    { key: 'purchasedDate', },
                    { key: 'actions', label: 'Actions'},
                ],
                items: [],
                saving: false,
                discount: 0,
                isEdit: false,
                indexValue: null,
                customerMobileNumber: '',
                customerId: '',
            }
        },
        mounted() {
            this.setUnitOptions();
            this.newBillingItem.purchasedDate = new Date().toISOString().slice(0,10);
        },
        methods: {

            getFr(){
              console.log('gunners')
            },

            toggleModal() {
                this.resetForm();
                this.$root.$emit('bv::toggle::modal', 'my-modal', '#btnToggle')
            },
            async getItemDetails() {
                console.log('Yes!')
                let self = this;
                let query = db.collection('items');
                query = query.where("code", "==", `${this.newBillingItem.code}`);
                query = query.where('remainingQuantity', '>', '0');
                query = query.orderBy("remainingQuantity");
                query = query.limit(1);
                query.get().then(function(querySnapshot) {
                        if (querySnapshot.empty == false) {
                            querySnapshot.forEach(function(doc) {
                                self.newBillingItem.name = doc.data().name;
                                self.newBillingItem.rate = doc.data().rate;
                                self.newBillingItem.unit = doc.data().unit;
                                self.oldData = doc.data();
                            });
                        } else {
                            alert('Item number not available yet for billing!')
                            self.resetForm();
                        }

                    })
                    .catch(function(error) {
                        console.log("Error getting documents: ", error);
                    });

            },
            async addNewBillItem() {
                const isValid = await this.$refs.adForm.validate();
                if (isValid) {
                    this.saving = true;

                    await db.collection("items")
                            .where("code", "==", `${this.newBillingItem.code}`)
                            .orderBy("remainingQuantity")
                            .limit(1).get().then(async (query) => {
                        const thing = query.docs[0];
                        let currVal = thing.data().remainingQuantity;

                        const newQuantityValue = parseInt(currVal) - parseInt(this.newBillingItem.quantity)

                        if (newQuantityValue >= 0){

                            let obj = {
                                code: this.newBillingItem.code,
                                name: this.newBillingItem.name,
                                unit: this.newBillingItem.unit,
                                quantity: this.newBillingItem.quantity,
                                rate: this.newBillingItem.rate,
                                totalAmount: this.newBillingItem.totalAmount,
                                customerId: this.newBillingItem.customerId,
                                purchasedDate: this.newBillingItem.purchasedDate

                            }
                            if (this.isEdit === true) {
                                this.items.splice(this.indexValue,1,obj);
                            } else {
                                this.items.push(obj);
                            }

                            this.$root.$emit('bv::toggle::modal', 'my-modal', '#btnToggle')
                        } else {
                            alert('Stock ran out of order for desired quantity')
                        }
                        this.isEdit = false;
                        this.indexValue = null;
                        this.saving = false;
                    }).catch((e) => {
                        this.saving = false;
                        console.log('error', e)
                    });

                } else {
                    alert("Item failed to be added!");
                }

            },
            calculateTotalAmount() {
                if (this.newBillingItem.rate !== '' && this.newBillingItem.quantity.length !== '') {
                    this.newBillingItem.totalAmount =( this.newBillingItem.rate * this.newBillingItem.quantity);
                }
            },
            resetForm(){
                this.newBillingItem.code = null;
                this.newBillingItem.name = null;
                this.newBillingItem.quantity = 0;
                this.newBillingItem.unit= '';
                this.newBillingItem.rate = 0;
                this.newBillingItem.totalAmount = 0;
                this.newBillingItem.customerId = '';
                this.isEdit = false,
                this.indexValue = null
            },
            deleteItem(indexValue){
                if (window.confirm("Do you really want to delete?")) {
                    this.items.splice(indexValue,1);
                }
            },
            editItem(indexValue){
                this.newBillingItem.code = this.items[indexValue].code;
                this.newBillingItem.name = this.items[indexValue].name;
                this.newBillingItem.quantity = this.items[indexValue].quantity;
                this.newBillingItem.unit= this.items[indexValue].unit;
                this.newBillingItem.rate = this.items[indexValue].rate;
                this.newBillingItem.discount = this.items[indexValue].discount;
                this.newBillingItem.totalAmount = this.items[indexValue].totalAmount;
                this.newBillingItem.customerId = this.items[indexValue].customerId;
                this.isEdit = true;
                this.indexValue = indexValue;
                this.$root.$emit('bv::toggle::modal', 'my-modal', '#btnToggle')
            },
            setUnitOptions() {
                const docRef = db.collection("UnitType");

                const self = this;
                docRef.get().then(function(snapshot) {
                    snapshot.docs.map((doc)=>{
                        self.options.push(doc.data())
                    })
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });

            },
            saveItemCollection() {
                if (this.items && this.items.length > 0) {
                    const obj = {
                        totalAmount: this.total,
                        discount: this.discount,
                        itemList: this.items,
                        customerId: this.customerId,
                        purchasedDate:this.newBillingItem.purchasedDate
                    }

                    db.collection("Bill").add(obj).then(() => {
                        console.log('called')
                    }).catch((error) => {
                        console.log(error);
                    });

                    this.items.forEach(async function (value, i) {
                        let batch = db.batch();
                        let newItem = db.collection("SoldItems").doc(new Date().toISOString() + `${i}`);
                        batch.set(newItem, value);


                        await db.collection("items")
                                            .where("code", "==", `${value.code}`)
                                            .orderBy("remainingQuantity")
                                            .limit(1).get().then((query)=> {
                                            const thing = query.docs[0];
                                            let currVal = thing.data().remainingQuantity;
                                            const newQuantityValue = parseInt(currVal) - parseInt(value.quantity)
                                            thing.ref.update({
                                                remainingQuantity: newQuantityValue
                                            });
                                        }).catch((e) => console.log('error',e));


                        batch.commit().then(function () {
                            console.log('Commited!!!')
                        }).catch((e)=> console.log('error',e));
                    })

                    this.$router.push('/bill/list')
                } else {
                    alert('Add bill item first')
                }

            }
        },
        computed: {
            rows() {
                return this.items.length
            },
            total: function() {
                let discountValue = this.discount;
                const result = this.items.reduce(function(a, c){
                    return a + Number(((c.totalAmount)) || 0)
                }, 0)
                return result - discountValue;
            }
        }

    }
</script>

<style scoped>

</style>