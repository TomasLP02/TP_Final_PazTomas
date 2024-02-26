<template>
  <div class="body">

    <h1>Nueva venta</h1>
    <div class="totales">
      <p>Total en pesos: {{ totalPesos.toFixed(2) }}</p>
      <p>Total Bitcoin: {{ totalBitcoin }}</p>
      <p>Total Ethereum: {{ totalEthereum }}</p>
      <p>Total Dai: {{ totalDai }}</p>
    </div>
    <div class="inputGroup">

      <select id="crypto_code" @change="onCryptoCodeChange">
        <option value="" disabled selected>Seleccione una criptomoneda</option>
        <option value="dai">DAI</option>
        <option value="btc">Bitcoin</option>
        <option value="eth">Ethereum</option>
      </select>

      <input class="noIncrement" type="number" v-model="cryptoAmount" id="crypto_amount" placeholder="Cantidad de cripto" 
      @input="updateCryptoAmountFromMoney" />
      
      <input class="noIncrement" type="number" v-model="money" id="money" placeholder="Monto en pesos" 
      @input="updateCryptoAmountFromMoney" />
      
      <flat-pickr v-model="selectedDate" id="datetime" :config="datePickerConfig" placeholder="Fecha de Venta" input-class="flatpickr-input"></flat-pickr>
      
      
    </div>
    <button id="confirmarVenta" @click="confirmarVenta">Vender</button>

    <BotonVolver />
  </div>
</template>

<script>
import axios from 'axios';
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import flatpickr from 'flatpickr';
import BotonVolver from '@/components/BotonVolver.vue';
export default {
  components: {
    BotonVolver,
    FlatPickr,
  },
  data(){
    return{
      totalPesos: 0,
      totalDai: 0,
      totalBitcoin: 0,
      totalEthereum: 0,
      action: '',
      cryptoCode: '',
      lastCryptoCode: '',
      cryptoAmount: '',
      cryptoPrice: 0,
      selectedDate: '',
      money: '',
      datePickerConfig: {
        enableTime: true,
        dateFormat: 'd-m-Y H:i',        
      }
    }
  },
  watch: {
    cryptoAmount: function (newCryptoAmount) {
      this.updateMoneyFromCryptoAmount(newCryptoAmount);
    },
    money: function (newMoney) {
      this.updateCryptoAmountFromMoney(newMoney);
    },
    cryptoCode: function () {
      this.updateCryptoPrice();
    },
  },
  mounted(){
    const totalPesos = localStorage.getItem('totalPesos') || '0';
    const totalDai = localStorage.getItem('totalDai') || '0';
    const totalBitcoin = localStorage.getItem('totalBitcoin') || '0';
    const totalEthereum = localStorage.getItem('totalEthereum') || '0';

    this.totalPesos = parseFloat(totalPesos);
    this.totalDai = parseFloat(totalDai);
    this.totalBitcoin = parseFloat(totalBitcoin);
    this.totalEthereum = parseFloat(totalEthereum);
  },
  methods: {
    async updateCryptoPrice() {
      if (this.cryptoCode) {
        try {
          const response = await axios.get(`https://criptoya.com/api/argenbtc/${this.cryptoCode}/ars/1`);
          this.cryptoPrice = response.data.ask; 
        } catch (error) {
          console.error('Error al obtener el precio de la criptomoneda', error);
        }
      } else {
        this.cryptoPrice = 0;
      }
    },
    updateMoneyFromCryptoAmount(newCryptoAmount) {
      if (!isNaN(newCryptoAmount) && !isNaN(this.cryptoPrice)) {
        this.money = (newCryptoAmount * this.cryptoPrice) || '';
      }    
    },
    updateCryptoAmountFromMoney(newMoney) {
    if (!isNaN(newMoney) && !isNaN(this.cryptoPrice) && this.cryptoPrice !== 0) {
      this.cryptoAmount = Number(String(newMoney)) / this.cryptoPrice || '';
    }    
    },
    onCryptoCodeChange(event) {
      this.cryptoCode = event.target.value;
      this.cryptoAmount = '';
      this.money = '';
    },
    codigoCompleto(code) {
      const nombreCrypto = {
        'btc': 'bitcoin',
        'eth': 'ethereum',
        'dai': 'dai',
      };

      return nombreCrypto[code] || code;
    },
    confirmarVenta() {
      if (!this.cryptoCode) {
        alert('Por favor, seleccione una criptomoneda');
        return;
      }
      if (!this.cryptoAmount || parseFloat(this.cryptoAmount) <= 0 || isNaN(parseFloat(this.cryptoAmount))) {
        alert('La cantidad de criptomonedas debe ser superior a 0');
        return;
      }
      if (this.money <= 0 || isNaN(this.money)) {
        alert('El monto debe ser mayor que 0');
        return;
      }
      if (!this.selectedDate) {
        alert('Por favor, selecciona una fecha');
        return;
      }        
      let fechaActual = new Date();
      let fechaSeleccionada = flatpickr.parseDate(this.selectedDate, 'd-m-Y H:i');
      fechaActual = fechaActual.getTime();
      fechaSeleccionada = fechaSeleccionada.getTime();
      if (fechaSeleccionada > fechaActual) {
        alert('La fecha no puede ser superior a la fecha actual');
        return;
      }  
      const cryptoName = this.codigoCompleto(this.cryptoCode);
      if (
      (this.cryptoAmount > this.totalBitcoin && this.cryptoCode === 'btc') ||
      (this.cryptoAmount > this.totalEthereum && this.cryptoCode === 'eth') ||
      (this.cryptoAmount > this.totalDai && this.cryptoCode === 'dai')
    ) {
      alert('La cantidad de monedas a vender es superior a la que posee');
    }else{
      const userID = localStorage.getItem('userID');
      const ventaData = {
        user_id: userID,
        action: "sale",
        crypto_code: cryptoName,
        crypto_amount: this.cryptoAmount.toFixed(2),
        money: this.money.toFixed(2),
        datetime: fechaSeleccionada,
      };      
      const apiClient = axios.create({
      baseURL: 'https://laboratorio3-f36a.restdb.io/rest',
      headers: {'x-apikey': '60eb09146661365596af552f'}
      });
      apiClient.post('/transactions', ventaData)
        .then(response => {
          alert('Venta realizada exitosamente');
          console.log('Datos de la venta', response.data);
          this.$router.push('/inicio');
        })
        .catch(error => {
          alert('Fallo al realizar la venta');
          console.error('Error al realizar la venta:', error);
        });
      this.cryptoCode = '';
      this.cryptoAmount = '';
      this.money = '';
      this.selectedDate = '';
      }
    }    
    }
  }
  
</script>
<style scoped>
.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh; 
}
.totales{
  display: flex;
  flex-direction: row;
  justify-content: center;
}
p{
  margin-right: 50px;
}
.inputGroup {
  display: flex;
    flex-direction: column;
    margin-top: 10px;
    align-items: center;
}
input,
select {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
}

button {
    margin-top: 30px;
    background-color: #2cb2ff;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
  }

  button:hover {
    background-color: #000000;
  }

.inputGroup input {
  margin: 5px 0;
}

.noIncrement::-webkit-inner-spin-button,
  .noIncrement::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
#confirmarVenta{
  margin-top: 10px;
  width: 150px;
}
#crypto_code{
  margin-bottom: 5px
}
</style>