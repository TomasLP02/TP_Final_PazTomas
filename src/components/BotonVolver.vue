<template>
    <div>
      <button id="botonVolver" @click="Volver">Volver</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      Volver() {
        this.$router.push('/inicio');
      },
    },
  };
  </script>

  <style>
  #botonVolver {
  margin-top: 10px;
  }
  </style>