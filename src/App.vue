<template>  
  <router-link to="/"></router-link>
  <router-link to="/about"></router-link>
  <router-link to="/inicio"></router-link>
  <router-view/>
</template>
<script>
export default{
    methods: {
        NuevaCompra(){
            this.$router.push('/nueva-compra');
        }, 
        NuevaVenta(){
            this.$router.push('/nueva-venta');
        },
        Historial(){
            this.$router.push('/historial');
        },
        Editar(){
            this.$router.push('/editar');
        },
        AnalisisActual(){
            this.$router.push('/analisis-actual');
        },
        AnalisisInversiones(){
            this.$router.push('/analisis-inversiones');
        },
        Volver(){
            this.$router.push('/inicio');
        },
    }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
img{
  margin-top: 175px;
  max-width: 300px;
  max-height: 300px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
