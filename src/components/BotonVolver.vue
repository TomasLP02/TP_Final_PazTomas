<template>
      <button id="botonVolver" @click="Volver">Volver</button>
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
    margin: 10px;
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
    width: 10vh;
    justify-content: center;

  }
  #botonVolver:hover {
    background-color: #45a049;
  }
  </style>