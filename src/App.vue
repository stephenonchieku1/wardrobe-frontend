<script setup lang="ts">

</script>

<template>
  <div id="app">
    <nav>

      <router-link to="/">Home</router-link>


      <router-link to="/add">Add Item</router-link>


      <router-link to="/login">Login</router-link>

      <router-link to="/register">Register</router-link>
    </nav>

    <router-view></router-view>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 16px;
  text-align: center;
  padding: 20px;
  margin-top: 2rem;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
nav a {
  margin: 0 15px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}
nav a:hover {
  background-color: #e9ecef;
  color: #000;
}

nav a.router-link-exact-active {
  color: #007bff;
  background-color: #e9ecef; 
}
</style>
