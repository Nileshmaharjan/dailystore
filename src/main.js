import Vue from "vue";
import App from "./App.vue";
import router from "./routes/index";
import * as firebase from "firebase";
import store from "./store";
import { BootstrapVue, IconsPlugin,BootstrapVueIcons } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { ValidationProvider } from 'vee-validate';
import MultiSelect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min'
import 'vue-multiselect/dist/vue-multiselect.min.css'

import { extend } from 'vee-validate';
import {required, email, min, max} from 'vee-validate/dist/rules';


// Add the required rule
extend('required', {
  ...required,
  message: 'This field is required'
});

// Add the email rule
extend('email', {
  ...email,
  message: 'This field must be a valid email'
});

extend("min", {
  ...min,
  message: (field, params, data) => `The ${field} should be at least ${params.length} character.`
});

extend("max", {
  ...max,
  message: (field, params, data) => `The ${field} should be ${params.length} character at max.`
});

extend("greaterThanZero", {
  message: (field, params, data)   =>`The ${field} should contain values greater than 0.`,
  validate: (value) => {
    if (value > 0) {
      return true
    } else {
      return  false;
    }

  }
})

// Register it globally
// main.js or any entry file.
Vue.component('ValidationProvider', ValidationProvider);
// Vue.component('multi-select', MultiSelect);

// Install BootstrapVue
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


Vue.config.productionTip = false;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
