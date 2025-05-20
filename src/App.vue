<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { computed } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

import { isAuthenticated } from './stores/auth'
</script>

<template>
  <header>
    <div class="col-lg-9">
      <HelloWorld msg="simple wallet app" />

      <nav>
        <RouterLink v-if="!isAuthenticated" to="/">Home</RouterLink>
        <RouterLink v-if="!isAuthenticated" to="/register">Register</RouterLink>
        <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/dashboard">Dashboard</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/creditwallet">Credit Wallet</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/signout">Logout</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
