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
                    <ValidationProvider name="quantity" :rules="`required|min:1|max:10|greaterThanZero:${newItem.quantity}`">
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

                    <ValidationProvider name="unit amount" :rules="`required|min:1|max:10|greaterThanZero:${newItem.rate}`">
                        <div slot-scope="{ errors }">
                    <div class="form-group">
                        <label>Rate:</label>
                        <input type="number" v-model="newItem.rate" class="form-control" @change="calculateTotalAmount"/>
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


    import { db } from '../../config/db';
    import { itemValue } from '../../config/value';
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
                    remainingQuantity: 0,
                    rate: 0,
                    totalAmount: 0,
                    supplier: '',
                    purchasedDate: '',
                    expiryDate: ''
                },
                options: [],
                codeOptions: itemValue
            }
        },

        mounted() {
            this.setUnitOptions();
        },
        methods: {
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
            async addItem() {
                const isValid = await this.$refs.adForm.validate();
                if (isValid) {
                    this.saving = true;

                    this.newItem.remainingQuantity = this.newItem.quantity;
                    db.collection("items").add(this.newItem).then(() => {
                        this.resetForm();
                        this.saving = false;
                    }).catch((error) => {
                        console.log(error);
                    });
                    await this.$router.push('/item/list')
                } else {
                    alert("Item failed to be added!");
                }

            },
            calculateTotalAmount() {
                if (this.newItem.rate !== '' && this.newItem.quantity.length !== '') {
                    this.newItem.totalAmount = this.newItem.rate * this.newItem.quantity;
                }
            },
            resetForm(){
                this.newItem.code = null;
                this.newItem.name = null;
                this.newItem.quantity = 0;
                this.newItem.remainingQuantity = 0;
                this.newItem.unit= '';
                this.newItem.rate = 0;
                this.newItem.totalAmount = 0;
                this.newItem.supplier = '';
                this.newItem.purchasedDate = '';
                this.newItem.expiryDate = '';
            }
        }
    }
</script>