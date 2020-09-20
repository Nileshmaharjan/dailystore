import Vue from "vue";
import App from "./App.vue";
import router from "./routes/index";
import * as firebase from "firebase";
import store from "./store";


Vue.config.productionTip = false;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");