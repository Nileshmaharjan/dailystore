<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h3>Add Item</h3>
            </div>
            <div class="card-body">
                <ValidationObserver ref="adForm">
                <form v-on:submit.prevent="addItem">
                    <ValidationProvider name="code" rules="required">
                        <div slot-scope="{ errors }">
                    <div class="form-group">
                        <label>Item Number:</label>
                        <b-form-select v-model="newItem.code" :options="codeOptions"></b-form-select>
                        <p>{{ errors[0] }}</p>
                     </div>
                    </div>
                    </ValidationProvider>
                    <ValidationProvider name="name" rules="required">
                        <div slot-scope="{ errors }">
                        <div class="form-group">
                            <label>Item Name:</label>
                            <input type="text" v-model="newItem.name" class="form-control"/>
                        </div>
                            <p>{{ errors[0] }}</p>
                        </div>
                    </ValidationProvider>
                    <ValidationProvider name="quantity" rules="required|min:1|max:6">
                        <div slot-scope="{ errors }">
                        <div class="form-group">
                            <label>Quantity:</label>
                            <input type="number" v-model="newItem.quantity" class="form-control" @change="calculateTotalAmount"/>
                                <p>{{ errors[0] }}</p></div>
                        </div>
                    </ValidationProvider>

                    <ValidationProvider name="unit" rules="required">
                        <div slot-scope="{ errors }">
                    <div class="form-group">
                        <label>Quantity Unit</label>
                        <b-form-select v-model="newItem.unit" :options="options"></b-form-select>
                        <p>{{ errors[0] }}</p></div>
                    </div>
                    </ValidationProvider>

                    <ValidationProvider name="unit amount" rules="required|min:1|max:6">
                        <div slot-scope="{ errors }">
                    <div class="form-group">
                        <label>Rate:</label>
                        <input type="number" v-model="newItem.unitAmount" class="form-control" @change="calculateTotalAmount"/>
                            <p>{{ errors[0] }}</p></div>
                    </div>
                    </ValidationProvider>
                    <ValidationProvider name="total amount" rules="required|min:1|max:10">
                        <div slot-scope="{ errors }">
                    <div class="form-group">
                        <label>Total Amount:</label>
                        <input type="number" v-model="newItem.totalAmount" class="form-control" disabled/>
                            <p>{{ errors[0] }}</p></div>
                    </div>
                    </ValidationProvider>
                    <ValidationProvider name="supplier" rules="required">
                        <div slot-scope="{ errors }">
                    <div class="form-group">
                        <label>Supplier:</label>
                        <input type="text" v-model="newItem.supplier" class="form-control"/>
                            <p>{{ errors[0] }}</p></div>
                    </div>
                    </ValidationProvider>
                    <ValidationProvider name="purchased date" rules="required">
                        <div slot-scope="{ errors }">
                    <div class="form-group">
                        <label>Purchased Date:</label>
                        <b-form-datepicker v-model="newItem.purchasedDate" locale="en"></b-form-datepicker>
                        <p>{{ errors[0] }}</p></div>
                    </div>
                    </ValidationProvider>
                    <ValidationProvider name="expiry date" rules="">
                        <div slot-scope="{ errors }">
                            <div class="form-group">
                                <label>Expiry Date:</label>
                                <b-form-datepicker v-model="newItem.expiryDate" locale="en"></b-form-datepicker>
                                <p>{{ errors[0] }}</p></div>
                        </div>
                    </ValidationProvider>
                    <div class="form-group">
                        <input
                                :disabled="saving"
                                type="submit"
                                class="btn btn-primary"
                                value="Add Item"
                        />
                    </div>
                </form>
                </ValidationObserver>
            </div>
        </div>
    </div>
</template>

<script>
    /* eslint-disable no-console */


    import { db } from '../config/db';
    import { ValidationProvider,ValidationObserver } from 'vee-validate';

    export default {
        components: {
            name: 'AddItem',
            ValidationProvider,
            ValidationObserver
        },
        data () {
            return {
                saving: false,
                newItem: {
                    code: null,
                    name: '',
                    unit: '',
                    quantity:0,
                    unitAmount: 0,
                    totalAmount: 0,
                    supplier: '',
                    purchasedDate: '',
                    expiryDate: ''
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
                    { value: '25', text: '25' },
                ]
            }
        },

        mounted() {
           console.log(db);
        },
        methods: {
            async addItem() {
                const isValid = await this.$refs.adForm.validate();
                if (isValid) {
                    this.saving = true;

                    const itemAlreadyExists =  await db.collection("items").where("code", "==", `${this.newItem.code}`).limit(1).get().then((query) => {
                        const thing = query.docs[0];
                        if (thing) {
                            if (thing.exists === true) {
                                return true;
                            }else {
                                return false;
                            }
                        } else {
                            return false;
                        }

                    }).catch((e) => console.log('error', e));


                    if (itemAlreadyExists !== true) {
                        db.collection("items").add(this.newItem).then(() => {
                            alert("Item successfully created!");
                            this.resetForm();
                            this.saving = false;
                        }).catch((error) => {
                            console.log(error);
                        });

                    } else if (itemAlreadyExists !==false){
                        alert('Item number already exists')
                        this.saving = false;
                    }
                    await this.$router.push('/item/list')
                } else {
                    alert("Item failed to be added!");
                }

            },
            calculateTotalAmount() {
                if (this.newItem.unitAmount !== '' && this.newItem.quantity.length !== '') {
                    this.newItem.totalAmount = this.newItem.unitAmount * this.newItem.quantity;
                }
            },
            resetForm(){
                this.newItem.code = null;
                this.newItem.name = null;
                this.newItem.quantity = 0;
                this.newItem.unit= '';
                this.newItem.unitAmount = 0;
                this.newItem.totalAmount = 0;
                this.newItem.supplier = '';
                this.newItem.purchasedDate = '';
                this.newItem.expiryDate = '';
            }
        }
    }
</script>