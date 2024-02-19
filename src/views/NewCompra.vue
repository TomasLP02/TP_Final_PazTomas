<template>
  <div class="cuerpo">

    <h1>Nueva compra</h1>
    
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
      
      <flat-pickr v-model="selectedDate" id="datetime" :config="datePickerConfig" placeholder="Fecha de Compra" input-class="flatpickr-input"></flat-pickr>
      
      
    </div>
    <button id="confirmarCompra" @click="confirmarCompra">Comprar</button>

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
    confirmarCompra() {
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
      const userID = localStorage.getItem('userID');
      const compraData = {
        user_id: userID,
        action: "purchase",
        crypto_code: cryptoName,
        crypto_amount: this.cryptoAmount,
        money: this.money,
        datetime: this.selectedDate,
      };      
      const apiClient = axios.create({
      baseURL: 'https://laboratorio3-f36a.restdb.io/rest',
      headers: {'x-apikey': '60eb09146661365596af552f'}
      });
      apiClient.post('/transactions', compraData)
        .then(response => {
          alert('Compra realizada exitosamente');
          console.log('Datos de la Compra', response.data);
        })
        .catch(error => {
          alert('Fallo al realizar la compra');
          console.error('Error al realizar la compra:', error);
        });
      this.cryptoCode = '';
      this.cryptoAmount = '';
      this.money = '';
      this.selectedDate = '';
      this.$router.push('/inicio');
      },
    }
  }
  
</script>
<style scoped>
.cuerpo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh; 
}

.inputGroup {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.inputGroup input {
  margin: 5px 0;
}

.noIncrement::-webkit-inner-spin-button,
  .noIncrement::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
#confirmarCompra{
  margin-top: 10px;
  width: 150px;
}
#crypto_code{
  margin-bottom: 5px
}
</style>