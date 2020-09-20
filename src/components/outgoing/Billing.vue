<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h3>Billing System</h3>
            </div>
            <div class="card-body">
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
                        
                        <ValidationProvider name="supplier" rules="required">
                            <div slot-scope="{ errors }">
                                <div class="form-group">
                                    <label>Customer Name</label>
                                    <input type="text" v-model="newBillingItem.customerName" class="form-control"/>
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
                            <input type="submit" class="btn btn-primary" value="Add Item"/>
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
            name: 'addNewBillItem',
            ValidationProvider,
            ValidationObserver
        },
        data () {
            return {
                firebaseId: null,
                oldData: {},
                newBillingItem: {
                    code: null,
                    name: '',
                    unit: '',
                    quantity:0,
                    unitAmount: 0,
                    totalAmount: 0,
                    discount: 0,
                    customerName: '',
                    purchasedDate: '',
                },
                options: [
                    { value: null, text: 'Please select an option' },
                    { value: '1', text: 'PCS' },
                    { value: '2', text: 'Boxes' },
                    { value: '3', text: 'Sacs' }
                ],
                codeOptions: [
                    { value: null, text: 'Please select an option' },
                    { value: '1', text: '1' },
                    { value: '2', text: '2' },
                    { value: '3', text: '3' }
                ]
            }
        },


        mounted() {
            this.newBillingItem.purchasedDate = new Date();
        },
        methods: {

            async getItemDetails() {
                let self = this;
                  db.collection('items').where("code", "==", `${this.newBillingItem.code}`).get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            self.newBillingItem.name = doc.data().name;
                            self.newBillingItem.unitAmount = doc.data().unitAmount;
                            self.newBillingItem.unit = doc.data().unit;
                            self.firebaseId = doc.data().id;
                            self.oldData = doc.data();
                        });
                    })
                    .catch(function(error) {
                        console.log("Error getting documents: ", error);
                    });

            },
            async addNewBillItem() {
                const isValid = await this.$refs.adForm.validate();
                if (isValid) {
                    let self = this;


                    let result = await db.collection("items").where("code", "==", `${self.newBillingItem.code}`).limit(1).get().then((query) => {
                        const thing = query.docs[0];
                        let currVal = thing.data();
                        console.log(currVal);
                        // const newVal = currVal - minus;
                        // thing.ref.update({value:newVal});
                    }).catch((e) => console.log('error', e));

                    console.log(result);

                    // const here = await result.update({
                    //     quantity: self.oldData.quantity - self.newBillingItem.quantity
                    // }).then(function() {
                    //         console.log("Document successfully updated!");
                    //     })
                    //     .catch(function(error) {
                    //         // The document probably doesn't exist.
                    //         console.error("Error updating document: ", error);
                    //     });



                    // db.collection('items').add(self.newBillingItem).then(() => {
                    //     alert("New Billing successfully created!");
                    //     this.resetForm();
                    // }).catch((error) => {
                    //     console.log(error);
                    // });
                } else {
                    alert("Item failed to be added!");
                }
                console.log(isValid);

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
                this.newBillingItem.totalAmount = 0;
                this.newBillingItem.customerName = '';
                this.newBillingItem.purchasedDate = '';
            }
        }
    }
</script>