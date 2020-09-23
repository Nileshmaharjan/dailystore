<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h3>Billing System</h3>
            </div>
            <div class="card-body">
                <b-form inline>
                    <label>Customer Id/Number</label>
                    <b-input
                            v-model="newBillingItem.customerId"
                            id="inline-form-input-name"
                            type="number"
                            class="mb-2 ml-4 mr-sm-2 mb-sm-0"
                    ></b-input>

                    <label>Supplied Date</label>
                    <b-form-datepicker v-model="newBillingItem.purchasedDate" locale="en" class="ml-4"></b-form-datepicker>

                    <b-button v-b-modal="'my-modal'" class="ml-2" @click="toggleModal" ref="btnToggle">Add Item</b-button>
                </b-form>

                <b-modal id="my-modal"hide-footer no-close-on-backdrop hide-header-close>
                    <ValidationObserver ref="adForm">
                    <form v-on:submit.prevent="addNewBillItem">
                        <ValidationProvider name="code" rules="required">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Item Number:</label>
                                    <b-form-select v-model="newBillingItem.code" :options="codeOptions" @change="getItemDetails(newBillingItem.code)"></b-form-select>
                                    <p>{{ errors[0] }}</p>
                                </div>
                            </div>
                        </ValidationProvider>
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
                            <input type="submit" class="btn btn-primary" value="Add Item" :disabled="saving"/>
                            <b-button @click="toggleModal" >Cancel</b-button>
                        </div>
                    </form>
                    </ValidationObserver>
                </b-modal>

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
                            <button @click="editItem(data.index)">
                                <b-icon icon="pencil"></b-icon>
                            </button>
                            <button @click.prevent="deleteItem(data.index)">
                                <b-icon icon="trash"></b-icon>
                            </button>
                        </template>
                        <template slot="bottom-row" slot-scope="data">
<!--                            <tr>-->
<!--                                <td/>-->
<!--                                <td>Discount</td>-->
<!--                                <td>-->
<!--                                    <input type="number" v-model="discount" class="form-control"/>-->
<!--                                </td>-->
<!--                            </tr>-->
<!--                            <tr>-->
<!--                                <td>Total: {{total}}-->
<!--                                </td>-->
<!--                            </tr>-->
                        </template>
                    </b-table>
                    <b-form inline>
                        <label>Discount</label>
                        <b-input type="number" min="0" v-model="discount" class="form-control ml-2"/>
                    </b-form>
                    <b-form inline class="mt-4">
                        <label>Total Amount</label>
                        <b-input type="number" v-model="total" class="form-control ml-2" disabled/>
                    </b-form>

                </div>

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

</template>

<script>
    import {db} from "../../config/db";
    import { ValidationProvider,ValidationObserver } from 'vee-validate';

    export default {
        name: "AddNewBill.vue",
        components: {
            name: 'addNewBillItem',
            ValidationProvider,
            ValidationObserver
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
                options: [],
                codeOptions: [
                    { value: null, text: 'Please select an option' },
                    { value: 'A001', text: 'A001' },
                    { value: 'A002', text: 'A002' },
                    { value: 'A003', text: 'A003' },
                    { value: 'A004', text: 'A004' },
                    { value: 'A005', text: 'A005' },
                    { value: 'A006', text: 'A006' },
                    { value: 'A007', text: 'A007' },
                    { value: 'A008', text: 'A008' },
                    { value: 'A009', text: 'A009' },
                    { value: 'A0010', text: 'A0010' },
                    { value: 'A0011', text: 'A0011' },
                    { value: 'A0012', text: 'A0012' },
                    { value: 'A0013', text: 'A0013' },
                    { value: 'A0014', text: 'A0014' },
                    { value: 'A0015', text: 'A0015' },
                    { value: 'A0016', text: 'A0016' },
                    { value: 'A0017', text: 'A0017' },
                    { value: 'A0018', text: 'A0018' },
                    { value: 'A0019', text: 'A0019' },
                    { value: 'A0020', text: 'A0020' },
                    { value: 'A0021', text: 'A0021' },
                    { value: 'A0022', text: 'A0022' },
                    { value: 'A0023', text: 'A0023' },
                    { value: 'A0024', text: 'A0024' },
                    { value: 'A0025', text: 'A0025' },
                    { value: 'A0026', text: 'A0026' },
                ],
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
                    { key: 'customerId', },
                    { key: 'purchasedDate', },
                    { key: 'actions', label: 'Actions'},
                ],
                items: [],
                saving: false,
                discount: 0,
                isEdit: false,
                indexValue: null,
            }
        },
        mounted() {
            this.setUnitOptions();
            this.newBillingItem.purchasedDate = new Date().toISOString().slice(0,10);
        },
        methods: {
            toggleModal() {
                this.resetForm();
                this.$root.$emit('bv::toggle::modal', 'my-modal', '#btnToggle')
            },
            async getItemDetails() {
                let self = this;
                db.collection("items").where("code", "==", `${this.newBillingItem.code}`).orderBy("remainingQuantity").limit(1).get()
                    .then(function(querySnapshot) {
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

                    await db.collection("items").where("code", "==", `${this.newBillingItem.code}`).orderBy("remainingQuantity").limit(1).get().then(async (query) => {
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
                        customerId: this.items[0].customerId,
                        purchasedDate:this.items[0].purchasedDate
                    }

                    db.collection("Bill").doc(new Date().toISOString()).set(obj).then(() => {
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