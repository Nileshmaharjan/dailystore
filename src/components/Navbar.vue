<template>
  <nav class="navbar navbar-expand-md navbar-light navbar-laravel">
    <div class="container">
      <router-link to="/" class="navbar-brand">Daily Store</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav"></ul>

        <ul class="navbar-nav">

          <template v-if="user.loggedIn">
            <li class="nav-item">
              <b-button variant="outline-primary"  class="m-2" @click.prevent="dashboard">Home</b-button>
            </li>
            <li class="nav-item">
              <b-dropdown id="dropdown-left" text="Purchased" variant="outline-primary" class="m-2">
                <b-dropdown-item @click="addItem">Add Item</b-dropdown-item>
                <b-dropdown-item @click="listItem">List Item</b-dropdown-item>
              </b-dropdown>
            </li>
            <li class="nav-item">
              <b-dropdown id="dropdown-left" text="Billing" variant="outline-primary" class="m-2">
                <b-dropdown-item @click="newBillItem">New Bill</b-dropdown-item>
                <b-dropdown-item @click="billList">Bill List</b-dropdown-item>
                <b-dropdown-item @click="soldItemList">Sold Item List</b-dropdown-item>
              </b-dropdown>
            </li>
            <li class="nav-item">
              <b-button variant="outline-primary"  class="m-2" @click.prevent="signOut">Logout</b-button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link to="login" class="nav-link">Login</router-link>
            </li>
<!--            <li class="nav-item">-->
<!--              <router-link to="register" class="nav-link">Register</router-link>-->
<!--            </li>-->
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
export default {
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({
            name: "home"
          });
        });
    },

    addItem() {
      this.$router.push('/item/add');
    },

    newBillItem() {
      this.$router.push('/bill/add');
    },

    listItem() {
      this.$router.push('/item/list');
    },

    soldItemList() {
      this.$router.push('/sold/list');
    },

    billList() {
      this.$router.push('/bill/list');
    },

    dashboard() {
      this.$router.push('/dashboard');
    }
  }
};
</script>
