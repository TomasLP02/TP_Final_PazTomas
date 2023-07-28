<template>
   <div class="inicio">
    <h1>Bienvenido, ¿Qué acción desea realizar?</h1>
    
    <button @click="NuevaCompra">Dar de alta una nueva compra</button>
    <button @click="NuevaVenta">Dar de alta una nueva venta</button>
    <button @click="Historial">Historial de movimientos</button>
    <br>
    <button @click="Editar">Editar compras/ventas</button>
    <button @click="AnalisisActual">Analisis estado actual</button>
    <button @click="AnalisisInversiones">Analisis de inversiones</button>
  </div>

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
    }
}
    
</script>
<style scoped>
button{
    margin-right: 30px;
    margin-bottom: 30px;
}
h1{
    margin-top: 150px;
}

</style>