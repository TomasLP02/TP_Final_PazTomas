<template>
  <div class="body">
    <h1>Analisis Actual</h1>
    <table class="crypto_table">
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Cantidad Total</th>
          <th>Valor en Pesos</th>
        </tr>
      </thead>
      <tbody>
        <tr v-show="totalBitcoin != 0">
          <td>Bitcoin</td>
          <td>{{ totalBitcoin }}</td>
          <td> {{'$ ' + totalBitcoin * btcPrice }} </td>
        </tr>
        <tr>
          <td v-show="totalDai != 0">Dai</td>
          <td>{{ totalDai }}</td>
          <td> {{'$ ' + totalDai * daiPrice}} </td>

        </tr>
        <tr v-show="totalEthereum != 0">
          <td>Ethereum</td>
          <td>{{ totalEthereum }}</td>
          <td> {{'$ ' + totalEthereum * ethPrice}} </td>

        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2">Total en Pesos</td>
          <td>{{'$ ' + sumatoriaEnPesos.toFixed(2) }}</td>
        </tr>
      </tfoot>
    </table>
    <BotonVolver />
  </div>
</template>

<script>
import BotonVolver from '@/components/BotonVolver.vue';
import axios from 'axios';
export default {
  data() {
    return {
      sumatoriaEnPesos: 0,
      totalPesos: 0,
      totalDai: 0,
      totalBitcoin: 0,
      totalEthereum: 0,
      daiPrice: 0,
      btcPrice: 0,
      ethPrice: 0,
    };
  },
  components: {
    BotonVolver,
  },
  mounted() {
    this.getCryptoPrice();
    const totalDai = localStorage.getItem('totalDai') || '0';
    const totalBitcoin = localStorage.getItem('totalBitcoin') || '0';
    const totalEthereum = localStorage.getItem('totalEthereum') || '0';

    this.totalDai = parseFloat(totalDai);
    this.totalBitcoin = parseFloat(totalBitcoin);
    this.totalEthereum = parseFloat(totalEthereum);
    this.sumatoriaEnPesos = this.daiPrice * this.totalDai + this.btcPrice * this.totalBitcoin + this.ethPrice * this.totalEthereum;
  },
  methods: {
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

.crypto_table {
  width: 80%;
  text-align: center;
  border-collapse: collapse;
  margin-top: 20px;
}

.crypto_table th, .crypto_table td {
  border: 1px solid #000;
  padding: 8px;
}

.crypto_table th {
  background-color: #9ce5ff;
}

.crypto_table tfoot {
  background-color: #f2f2f2;
}
</style>