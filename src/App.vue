<template>
  <div>
    <navbar></navbar>
    <main class="py-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import navbar from "./components/Navbar";
export default {
  components: {
    navbar
  }
};
</script>

<style lang="css">
  @import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
</style>
