<template>
  <div class="body">
    <h1>Análisis de Inversiones</h1>

    <table>
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="analizarInversiones('bitcoin')">
          <td>Bitcoin</td>
          <td>{{ calcularResultado('bitcoin') }}</td>
        </tr>

        <tr v-if="analizarInversiones('dai')">
          <td>Dai</td>
          <td>{{ calcularResultado('dai') }}</td>
        </tr>

        <tr v-if="analizarInversiones('ethereum')">
          <td>Ethereum</td>
          <td>{{ calcularResultado('ethereum') }}</td>
        </tr>
      </tbody>
    </table>

    <BotonVolver />
  </div>
</template>

<script>
import BotonVolver from '@/components/BotonVolver.vue';
import axios from 'axios';
export default {
  components: {
    BotonVolver,
  },
  data() {
    return {
      totalBitcoinComprado: 0,
      totalBitcoinVendido: 0,
      precioActualBitcoin: 0,
      totalDaiComprado: 0,
      totalDaiVendido: 0,
      totalEthereumComprado: 0,
      totalEthereumVendido: 0,
    };
  },
  mounted() {
    this.obtenerTotales();
    this.getCryptoPrice();
  },
  methods: {
    obtenerTotales() {
      this.totalBitcoinComprado = parseFloat(localStorage.getItem('totalBitcoinComprado')) || 0;
      this.valorBitcoinComprado = parseFloat(localStorage.getItem('valorBitcoinComprado')) || 0;
      this.totalBitcoinVendido = parseFloat(localStorage.getItem('totalBitcoinVendido')) || 0;
      this.valorBitcoinVendido = parseFloat(localStorage.getItem('valorBitcoinVendido')) || 0;
      this.totalDaiComprado = parseFloat(localStorage.getItem('totalDaiComprado')) || 0;
      this.valorDaiComprado = parseFloat(localStorage.getItem('valorDaiComprado')) || 0;
      this.totalDaiVendido = parseFloat(localStorage.getItem('totalDaiVendido')) || 0;
      this.valorDaiVendido = parseFloat(localStorage.getItem('valorDaiVendido')) || 0;
      this.totalEthereumComprado = parseFloat(localStorage.getItem('totalEthereumComprado')) || 0;
      this.valorEthereumComprado = parseFloat(localStorage.getItem('valorEthereumComprado')) || 0;
      this.totalEthereumVendido = parseFloat(localStorage.getItem('totalEthereumVendido')) || 0;
      this.valorEthereumVendido = parseFloat(localStorage.getItem('valorEthereumVendido')) || 0;
    },
    analizarInversiones(cryptoCode) {
      if (cryptoCode === 'bitcoin') {
        return this.totalBitcoinComprado > 0 || this.totalBitcoinVendido > 0;
      } else if (cryptoCode === 'dai') {
        return this.totalDaiComprado > 0 || this.totalDaiVendido > 0;
      } else if (cryptoCode === 'ethereum') {
        return this.totalEthereumComprado > 0 || this.totalEthereumVendido > 0;
      }
      return false;
    },
    calcularResultado(cryptoCode) {
      if (cryptoCode === 'bitcoin') {
        if (this.valorBitcoinVendido > 0 && this.valorBitcoinComprado > 0){
          const resultado = this.valorBitcoinVendido - this.valorBitcoinComprado;
        return resultado.toFixed(2);
        }else if (this.valorBitcoinVendido > 0){
          const resultado = (this.totalBitcoinVendido * this.btcPrice) - this.valorBitcoinVendido;
        return resultado.toFixed(2);
        }
      }else if (cryptoCode === 'dai') {
        const resultado = this.valorDaiVendido - this.valorDaiComprado;
        return resultado.toFixed(2);
      } else if (cryptoCode === 'ethereum') {
        const resultado = this.valorEthereumVendido - this.valorEthereumComprado;
        return resultado.toFixed(2); 
      }
      return '0.00';
    },
    async getCryptoPrice() {
          try {
            const dai = await axios.get(`https://criptoya.com/api/argenbtc/dai/ars/1`);          
             this.daiPrice = dai.data.ask; 
            const btc =await axios.get(`https://criptoya.com/api/argenbtc/btc/ars/1`);          
             this.btcPrice = btc.data.ask; 
            const eth =await axios.get(`https://criptoya.com/api/argenbtc/eth/ars/1`);          
             this.ethPrice = eth.data.ask; 
             this.sumatoriaEnPesos = this.daiPrice * this.totalDai + this.btcPrice * this.totalBitcoin + this.ethPrice * this.totalEthereum;

          } catch (error) {
            console.error('Error al obtener el precio de la criptomoneda', error);
          }
       
      },
  },
};
</script>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh; 
}
table {
  width: 80%;
  text-align: center;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #000000;
  text-align: left;
  padding: 8px;
}

th {
  text-align: center;
  background-color: #9ce5ff;
}
</style>
