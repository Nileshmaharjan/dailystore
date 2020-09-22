<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h3>Billing System</h3>
            </div>
            <div class="card-body">
                <ValidationObserver ref="updateBillForm">
                    <form v-on:submit.prevent="updateNewBillItem">
                        <ValidationProvider name="code" rules="required">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Item Number:</label>
                                    <b-form-select v-model="newBillingItem.code" :options="codeOptions" @change="getItemDetails(newBillingItem.code)" disabled></b-form-select>
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
                        <ValidationProvider name="quantity" rules="required|min:1|max:6">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Quantity:</label>
                                    <input type="number" v-model="newBillingItem.quantity" class="form-control" @change="calculateTotalAmount"/>
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

                        <ValidationProvider name="unit amount" rules="required|min:1|max:6">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Rate:</label>
                                    <input type="number" v-model="newBillingItem.unitAmount" class="form-control" @change="calculateTotalAmount" disabled/>
                                    <p>{{ errors[0] }}</p></div>
                            </div>
                        </ValidationProvider>

                        <ValidationProvider name="discount" rules="required|min:1|max:6">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Discount:</label>
                                    <input type="number" v-model="newBillingItem.discount" class="form-control" @change="calculateTotalAmount"/>
                                    <p>{{ errors[0] }}</p></div>
                            </div>
                        </ValidationProvider>

                        <ValidationProvider name="total amount" rules="required|min:1|max:10">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Total Amount:</label>
                                    <input type="number" v-model="newBillingItem.totalAmount" class="form-control" disabled/>
                                    <p>{{ errors[0] }}</p></div>
                            </div>
                        </ValidationProvider>

                        <ValidationProvider name="supplier" rules="">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Customer Name</label>
                                    <input type="text" v-model="newBillingItem.customerName" class="form-control"/>
                                    <p>{{ errors[0] }}</p></div>
                            </div>
                        </ValidationProvider>
                        <ValidationProvider name="supplier" rules="">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Customer Mobile Number</label>
                                    <input type="text" v-model="newBillingItem.customerMobileNumber" class="form-control"/>
                                    <p>{{ errors[0] }}</p></div>
                            </div>
                        </ValidationProvider>
                        <ValidationProvider name="supplier" rules="">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Customer Id</label>
                                    <input type="text" v-model="newBillingItem.customerId" class="form-control"/>
                                    <p>{{ errors[0] }}</p></div>
                            </div>
                        </ValidationProvider>
                        <ValidationProvider name="purchased date" rules="required">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Supplied Date:</label>
                                    <b-form-datepicker v-model="newBillingItem.purchasedDate" locale="en"></b-form-datepicker>
                                    <p>{{ errors[0] }}</p></div>
                            </div>
                        </ValidationProvider>
                        <div class="form-group">
                            <input type="submit" class="btn btn-primary" value="Edit Item" :disabled="saving"/>
                        </div>
                    </form>
                </ValidationObserver>
            </div>
        </div>
    </div>
</template>

<script>
    /* eslint-disable no-console */


    import { db } from '../../config/db';
    import { ValidationProvider,ValidationObserver } from 'vee-validate';

    export default {
        components: {
            name: 'editBillItem',
            ValidationProvider,
            ValidationObserver
        },
        data () {
            return {
                oldData: {},
                saving: false,
                oldQuantityValue: 0,
                newBillingItem: {
                    code: null,
                    name: '',
                    unit: '',
                    quantity:'0',
                    unitAmount: 0,
                    totalAmount: 0,
                    discount: 0,
                    customerName: '',
                    purchasedDate: '',
                    customerMobileNumber: '',
                    customerId: '',
                },
                options: [],

                codeOptions: [
                    { value: null, text: 'Please select an option' },
                    { value: '1', text: '1' },
                    { value: '2', text: '2' },
                    { value: '3', text: '3' },
                    { value: '4', text: '4' },
                    { value: '5', text: '5' },
                    { value: '6', text: '6' },
                    { value: '7', text: '7' },
                    { value: '8', text: '8' },
                    { value: '9', text: '9' },
                    { value: '10', text: '10' },
                    { value: '11', text: '11' },
                    { value: '12', text: '12' },
                    { value: '13', text: '13' },
                    { value: '14', text: '14' },
                    { value: '15', text: '15' },
                    { value: '16', text: '16' },
                    { value: '17', text: '17' },
                    { value: '18', text: '18' },
                    { value: '19', text: '19' },
                    { value: '20', text: '20' },
                    { value: '21', text: '21' },
                    { value: '22', text: '22' },
                    { value: '23', text: '23' },
                    { value: '24', text: '24' },
                    { value: '25', text: '25' },
                    { value: '26', text: '26' },
                ]
            }
        },
        

       async mounted() {
            this.setUnitOptions();
            await this.setBillForm();
            // await this.retractBillQuantityValue();
        },
        setUnitOptions() {
            const self = this;
            const docRef = db.collection("UnitType");

            docRef.get().then(function(snapshot) {
                snapshot.docs.map((doc)=>{
                    self.options.push(doc.data())
                })
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });

        },
        methods: {
            
            async setBillForm() {
                let dbRef = await db.collection('SoldItems').doc(this.$route.params.id);
                dbRef.get().then( (doc) => {
                    this.newBillingItem = doc.data();
                    this.oldQuantityValue = doc.data().quantity;
                }).catch((error) => {
                    console.log(error)
                })
            },

            async getItemDetails() {
                let self = this;
                db.collection("items").where("code", "==", `${self.newBillingItem.code}`).get()
                    .then(function(querySnapshot) {
                        console.log('Here')
                        console.log('querySnapshot', querySnapshot);
                        querySnapshot.forEach(function(doc) {
                            console.log('Here')
                            self.newBillingItem.name = doc.data().name;
                            self.newBillingItem.unitAmount = doc.data().unitAmount;
                            self.newBillingItem.unit = doc.data().unit;
                            self.oldData = doc.data();
                        });
                    })
                    .catch(function(error) {
                        console.log("Error getting documents: ", error);
                    });

            },
            async updateNewBillItem() {
                const isValid = await this.$refs.updateBillForm.validate();
                if (isValid) {
                    let self = this;
                    self.saving = true;

                    await db.collection("items").where("code", "==", `${self.newBillingItem.code}`).limit(1).get().then(async (query) => {
                        const thing = query.docs[0];
                        let currVal = thing.data().quantity;

                        const newQuantityValue = parseInt(currVal)+ parseInt(self.oldQuantityValue )- parseInt(self.newBillingItem.quantity);

                        if (newQuantityValue >= 0){
                            await thing.ref.update({
                                quantity: newQuantityValue
                            })
                           await db.collection('SoldItems').doc(this.$route.params.id)
                                .update(self.newBillingItem).then(() => {
                                this.$router.push('/bill/list')
                            }).catch((error) => {
                                console.log(error);
                            });
                            self.saving = false;
                        } else {
                            self.saving = false;
                            alert('Stock ran out of order for desired quantity')
                        }
                    }).catch((e) => console.log('error', e));
                } else {
                    alert("Item failed to be added!");
                }

            },
            calculateTotalAmount() {
                if (this.newBillingItem.unitAmount !== '' && this.newBillingItem.quantity.length !== '') {
                    this.newBillingItem.totalAmount =( this.newBillingItem.unitAmount * this.newBillingItem.quantity) - this.newBillingItem.discount;
                }
            },
            resetForm(){
                this.newBillingItem.code = null;
                this.newBillingItem.name = null;
                this.newBillingItem.quantity = 0;
                this.newBillingItem.unit= '';
                this.newBillingItem.unitAmount = 0;
                this.newBillingItem.discount = 0;
                this.newBillingItem.totalAmount = 0;
                this.newBillingItem.customerName = '';
                this.newBillingItem.customerMobileNumber = '';
                this.newBillingItem.customerId = '';
                this.newBillingItem.purchasedDate = '';
            }
        }
    }
</script>