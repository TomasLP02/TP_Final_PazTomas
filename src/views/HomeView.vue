<template>
  <div class="home">
    <img alt="Logo" src="../assets/logo.webp">
    <LoginView msg="Por favor inicie sesión"/>
  </div>
</template>

<script>
import LoginView from '@/components/Login.vue'

export default {
  name: 'HomeView',
  components: {
    LoginView
  }
}
</script>
