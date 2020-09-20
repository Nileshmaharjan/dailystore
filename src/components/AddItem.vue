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
                        <label>Unit Amount:</label>
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
                        <label>Supplied Date:</label>
                        <b-form-datepicker v-model="newItem.purchasedDate" locale="en"></b-form-datepicker>
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
                newItem: {
                    code: null,
                    name: '',
                    unit: '',
                    quantity:0,
                    unitAmount: 0,
                    totalAmount: 0,
                    supplier: '',
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
           console.log(db);
        },
        methods: {
            async addItem() {
                const isValid = await this.$refs.adForm.validate();
                if (isValid) {
                    db.collection('items').add(this.newItem).then(() => {
                        alert("Item successfully created!");
                        this.resetForm();
                    }).catch((error) => {
                        console.log(error);
                    });
                    await this.$router.push('/index')
                } else {
                    alert("Item failed to be added!");
                }
                console.log(isValid);

            },
            calculateTotalAmount() {

                console.log(this.newItem.unitAmount);
                console.log(this.newItem.quantity);
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
            }
        }
    }
</script>