<template>
  <div class="login">
    <h1>{{ msg }}</h1>
    <h3>Ingrese un ID alfanumérico</h3>
    
    <input id="userID" class="input-group mb-3, form-control" v-model="idInput">

    <button @click="IniciarSesion">Ingresar</button>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  props: {
    msg: String
  },
  data(){
    return{
      idInput: ''//Api
    }
  },
  methods: {
    IniciarSesion(){
    localStorage.setItem('userID', this.idInput);
    this.$router.push('/inicio');
  },
  }
 
}
</script>

<style scoped>


h3 {
  margin: 40px 0 0;
  margin-bottom: 30px;
}
ul {
  list-style-type: none;
  padding: 0;
}
button{
  margin-left: 10px;
  border-color: #42b983;
  color: black;
  background-color: #42b983;
}
li {
  display: inline-block;
  margin: 0 10px;
}
input{
  border-style: groove;
}
a {
  color: #42b983;
}
</style>
