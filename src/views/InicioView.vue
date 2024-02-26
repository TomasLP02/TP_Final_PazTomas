<template>
    <div class="inicio">
      <h1>Bienvenido, ¿Qué acción desea realizar?</h1>
      <div class="totales">
        <p>Total en Pesos: {{ totalPesos.toFixed(2) }}</p>
        <p>Total Bitcoin: {{ totalBitcoin }}</p>
        <p>Total Ethereum: {{ totalEthereum }}</p>
        <p>Total Dai: {{ totalDai }}</p>
      </div>
      <button @click="NuevaCompra">Dar de alta una nueva compra</button>
      <button @click="NuevaVenta">Dar de alta una nueva venta</button>
      <button @click="Historial">Historial de movimientos</button>
      <br>
      <button @click="abrirModal">Agregar Pesos</button>
      <button @click="AnalisisActual">Analisis estado actual</button>
      <button @click="AnalisisInversiones">Analisis de inversiones</button>
    </div>
    <div v-if="mostrarModal">
      <div class="modal">
        <h2>Agregar Pesos</h2>
        <input data-v-689f0b74="" class="modalInput" type="number" v-model="cantidadPesos" placeholder="Ingrese la cantidad de pesos">
        <div class="footer">
          <button id="closeModal" @click="cerrarModal">Cerrar</button>
          <button id="acceptModal" @click="actualizarTotalPesos">Actualizar Total</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        mostrarModal: false,
        cantidadPesos: '',
        totalPesos: 0,
        totalDai: 0,
        totalBitcoin: 0,
        totalEthereum: 0,
        movimientos: [],
        cryptoCode: '',
        cryptoAmount: '',
        money: '',
        action: '',
        datetime: '',
        datePickerConfig: {
          enableTime: true,
          dateFormat: 'd-m-Y H:i',        
        }
      };
    },
    methods: {
      NuevaCompra() {
        this.$router.push('/nueva-compra');
      },
      NuevaVenta() {
        this.$router.push('/nueva-venta');
      },
      Historial() {
        this.$router.push('/historial');
      },
      AnalisisActual() {
        this.$router.push('/analisis-actual');
      },
      AnalisisInversiones() {
        this.$router.push('/analisis-inversiones');
      },
      obtenerTotales() {
        try {
          const userID = localStorage.getItem('userID');
          const headers = { 'x-apikey': '60eb09146661365596af552f' };
  
          axios.get(`https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id": "${userID}"}`, { headers })
            .then(response => {
              this.movimientos = response.data;
              this.totalPesos = response.data.reduce((total, movimiento) => {
                const monto = parseFloat(movimiento.money) || 0;
                const cryptoAmount = parseFloat(movimiento.crypto_amount) || 0;
                
                if (movimiento.crypto_code === 'bitcoin' || movimiento.crypto_code === 'btc') {
                  this.totalBitcoin = movimiento.action === 'purchase' ? this.totalBitcoin + cryptoAmount : this.totalBitcoin - cryptoAmount;
                } else if (movimiento.crypto_code === 'ethereum' || movimiento.crypto_code === 'eth') {
                  this.totalEthereum = movimiento.action === 'purchase' ? this.totalEthereum + cryptoAmount : this.totalEthereum - cryptoAmount;
                } else if (movimiento.crypto_code === 'dai') {
                  this.totalDai = movimiento.action === 'purchase' ? this.totalDai + cryptoAmount : this.totalDai - cryptoAmount;
                }
  
                return movimiento.action === 'purchase' ? total - monto : total + monto;
              }, 0);
              let totalBitcoinComprado = 0;
              let valorBitcoinComprado = 0;
              let totalBitcoinVendido = 0;
              let valorBitcoinVendido = 0;
              let totalDaiComprado = 0;
              let valorDaiComprado = 0;
              let totalDaiVendido = 0;
              let valorDaiVendido = 0;
              let totalEthereumComprado = 0;
              let valorEthereumComprado = 0;
              let totalEthereumVendido = 0;
              let valorEthereumVendido = 0;
              this.movimientos.forEach((movimiento) => {

                if (movimiento.action === 'purchase') {
                  if (movimiento.crypto_code === 'bitcoin') {
                    totalBitcoinComprado += parseFloat(movimiento.crypto_amount) || 0;
                    valorBitcoinComprado += parseFloat(movimiento.money) || 0;
                  } else if (movimiento.crypto_code === 'dai') {
                    totalDaiComprado += parseFloat(movimiento.crypto_amount) || 0;
                    valorDaiComprado += parseFloat(movimiento.money) || 0;
                  } else if (movimiento.crypto_code === 'ethereum') {
                    totalEthereumComprado += parseFloat(movimiento.crypto_amount) || 0;
                    valorEthereumComprado += parseFloat(movimiento.money) || 0;
                  }
                } else if (movimiento.action === 'sale') {
                  if (movimiento.crypto_code === 'bitcoin') {
                    totalBitcoinVendido -= parseFloat(movimiento.crypto_amount) || 0;
                    valorBitcoinVendido -= parseFloat(movimiento.money) || 0;
                  } else if (movimiento.crypto_code === 'dai') {
                    totalDaiVendido -= parseFloat(movimiento.crypto_amount) || 0;
                    valorDaiVendido -= parseFloat(movimiento.money) || 0;
                  } else if (movimiento.crypto_code === 'ethereum') {
                    totalEthereumVendido -= parseFloat(movimiento.crypto_amount) || 0;
                    valorEthereumVendido -= parseFloat(movimiento.money) || 0;
                  }
                }
              });
              localStorage.setItem('totalBitcoinComprado', totalBitcoinComprado.toString());
              localStorage.setItem('valorBitcoinComprado', valorBitcoinComprado.toString());
              localStorage.setItem('totalBitcoinVendido', totalBitcoinVendido.toString());
              localStorage.setItem('valorBitcoinVendido', valorBitcoinVendido.toString());
              localStorage.setItem('totalDaiComprado', totalDaiComprado.toString());
              localStorage.setItem('valorDaiComprado', valorDaiComprado.toString());
              localStorage.setItem('totalDaiVendido', totalDaiVendido.toString());
              localStorage.setItem('valorDaiVendido', valorDaiVendido.toString());
              localStorage.setItem('totalEthereumComprado', totalEthereumComprado.toString());
              localStorage.setItem('valorEthereumComprado', valorEthereumComprado.toString());
              localStorage.setItem('totalEthereumVendido', totalEthereumVendido.toString());
              localStorage.setItem('valorEthereumVendido', valorEthereumVendido.toString());
              localStorage.setItem('totalPesos', this.totalPesos.toString());
              localStorage.setItem('totalDai', this.totalDai.toString());
              localStorage.setItem('totalBitcoin', this.totalBitcoin.toString());
              localStorage.setItem('totalEthereum', this.totalEthereum.toString());
            })
            .catch(error => {
              console.error('Error al obtener movimientos:', error);
            });
        } catch (error) {
          console.error('Error al obtener movimientos:', error);
        }
      },
      abrirModal() {
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
    actualizarTotalPesos() {
      const pesosAAgregar = parseFloat(this.cantidadPesos) || 0;

      this.totalPesos += pesosAAgregar;

      localStorage.setItem('totalPesos', this.totalPesos.toString());
      this.registrarTransaccionAgregarPesos(pesosAAgregar);
      this.cerrarModal();
    },
    registrarTransaccionAgregarPesos(cantidad) {
      const userID = localStorage.getItem('userID');
      const ingresoPesos = {
        user_id: userID,
        action: "sale",
        crypto_code: 'pesos',
        crypto_amount: 0,
        money: cantidad.toFixed(2),
        datetime: new Date().toISOString(),
      };
      console.log(ingresoPesos);
      const apiClient = axios.create({
      baseURL: 'https://laboratorio3-f36a.restdb.io/rest',
      headers: {'x-apikey': '60eb09146661365596af552f'}
      });
      apiClient.post('/transactions', ingresoPesos)
        .then(response => {
          alert('Pesos agregados exitosamente');
          console.log('Datos de la transacción:', response.data);
        })
        .catch(error => {
          alert('Fallo al agregar pesos');
          console.error('Error al agregar pesos:', error);
        });
    },
    },
    mounted() {
      this.obtenerTotales();
    },
  };
  </script>
  
  <style scoped>
  .totales{
  display: flex;
  flex-direction: row;
  justify-content: center;
  }
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: white;
    border: 1px solid #ccc;
    z-index: 999;
    width: 300px; 
    text-align: center;
  }

p{
  margin-right: 50px;
}
button {
  margin-top: 30px;
    margin-right: 30px;
    margin-bottom: 30px;
    background-color: #2cb2ff;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
  }

  button:hover {
    background-color: #170505;
  }
#acceptModal, #closeModal{
  margin: 0;
  margin-left: 22px;
    background-color: #2cb2ff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
}
#acceptModal:hover {
    background-color: #170505;
  }
  #closeModal:hover {
    background-color: #170505;
  }
.footer{
  display: flex;
    align-items: center;
}
input {
  margin: 5px ;
}
.modalInput{
  width: 80%;
    height: 3vh;
    padding: 5px;
    margin: 25px;
}
.modalInput::-webkit-inner-spin-button,
  .modalInput::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
  
  h1 {
    margin-top: 150px;
  }
  </style>
  