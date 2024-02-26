<template>
<div class="body">
    <h1> Historial </h1>
    <div class="totales">
      <p>Total en pesos: {{ totalPesos.toFixed(2) }}</p>
      <p>Total Bitcoin: {{ totalBitcoin }}</p>
      <p>Total Ethereum: {{ totalEthereum }}</p>
      <p>Total Dai: {{ totalDai }}</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Código de Criptomoneda</th>
          <th>Cantidad de Criptomonedas</th>
          <th>Monto en Pesos</th>
          <th>Fecha y Hora</th>
          <th>Acción</th>      
          <th>Herramientas</th>      
        </tr>
      </thead>
      <tbody>
      
        <tr v-for="movimiento in movimientos" :key="movimiento._id">
          <td>{{ capitalizarInicio(movimiento.crypto_code) }}</td>
          <td class="number">{{ calcularAccion(movimiento) == "Venta" ? '- ' + movimiento.crypto_amount : '+ ' + movimiento.crypto_amount}}</td>
          <td class="number"> {{ calcularAccion(movimiento) == "Compra" ? '- ' + movimiento.money : '+ ' + movimiento.money }}</td>
          <td>{{ formatearFecha(movimiento.datetime) }}</td>
          <td>{{ calcularAccion(movimiento) }}</td>
          <td class="herramientas">
            <button @click="abrirModalEdicion(movimiento._id)">Editar</button>
            <button @click="eliminarMovimiento(movimiento._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <BotonVolver />
</div>
<div v-if="mostrarModal">
      <div class="modal">
        <h2>Editar movimiento</h2>
        <div class="inputGroup">
          <select v-model="movimientoEditado.crypto_code" @change="onCryptoCodeChange">
            <option value="" disabled selected>Seleccione una criptomoneda</option>
            <option value="dai">DAI</option>
            <option value="btc">Bitcoin</option>
            <option value="eth">Ethereum</option>
            <option value="pesos">Pesos</option>
          </select>
          <input class="noIncrement" type="number" v-model="movimientoEditado.crypto_amount" id="crypto_amount" placeholder="Cantidad de cripto" 
          v-show="movimientoEditado.crypto_code !== 'pesos'" @input="updateCryptoAmountFromMoney" />
          <input class="noIncrement" type="number" v-model="movimientoEditado.money" id="money" placeholder="Monto en pesos" 
          @input="updateCryptoAmountFromMoney" />
          <flat-pickr v-model="movimientoEditado.selectedDate" id="datetime" :config="datePickerConfig" placeholder="Fecha de Movimiento" input-class="flatpickr-input"></flat-pickr>
          <div class="footer">
            <button id="acceptModal" @click="guardarEdicion">Guardar</button>
            <button id="closeModal" @click="cerrarModalEdicion">Cancelar</button>
          </div>
        </div>
      </div>
</div>

</template>

<script>
import axios from 'axios';
import { format } from 'date-fns';
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import flatpickr from 'flatpickr';
import BotonVolver from '@/components/BotonVolver.vue';
export default {
  components: {
    BotonVolver,
    FlatPickr,

  },
  watch: {
    'movimientoEditado.crypto_amount': function (newCryptoAmount) {
      this.updateMoneyFromCryptoAmount(newCryptoAmount);
    },
    'movimientoEditado.money': function (newMoney) {
      this.updateCryptoAmountFromMoney(newMoney);
    },
    'movimientoEditado.crypto_code': function () {
      this.updateCryptoPrice();
    },
  },
  data() {
    return {
      mostrarModal: false,
      movimientoEditado: {
        _id: '', 
        crypto_code: '',
        crypto_amount: 0,
        money: 0,
        datetime: '',
        selectedDate: '',
      },
      totalPesos: 0,
      totalDai: 0,
      totalBitcoin: 0,
      totalEthereum: 0,
      movimientos: [],
      datePickerConfig: {
        enableTime: true,
        dateFormat: 'd-m-Y H:i',        
      }
    };
  },
  mounted() {
    this.obtenerMovimientos();

    },
    
  methods: {
    obtenerMovimientos() {
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
      calcularAccion(movimiento) {
      if (parseFloat(movimiento.crypto_amount) === 0) {
        return "Ingreso";
      } else {
        return movimiento.action === 'purchase' ? 'Compra' : movimiento.action || movimiento.action === 'sale' ? 'Venta' : movimiento.action;
      }
    },
    async updateCryptoPrice() {
      if (this.movimientoEditado.crypto_code && this.movimientoEditado.crypto_code !== 'pesos') {
    try {
      const response = await axios.get(`https://criptoya.com/api/argenbtc/${this.movimientoEditado.crypto_code}/ars/1`);
      this.cryptoPrice = response.data.ask;
      this.updateMoneyFromCryptoAmount(this.movimientoEditado.crypto_amount);
    } catch (error) {
      console.error('Error al obtener el precio de la criptomoneda', error);
    }
  } else {
    this.cryptoPrice = 0;
  }
}, 

    updateMoneyFromCryptoAmount(newCryptoAmount) {
      if (!isNaN(newCryptoAmount) && !isNaN(this.cryptoPrice || this.movimientoEditado.crypto_code != 'pesos')) {
        this.movimientoEditado.money = (newCryptoAmount * this.cryptoPrice) || '';
      } else if (this.movimientoEditado.crypto_code == 'pesos') {         
        this.movimientoEditado.money = this.movimiento.money;
      }    
    },
    updateCryptoAmountFromMoney(newMoney) {
    if (!isNaN(newMoney) && !isNaN(this.cryptoPrice) && this.cryptoPrice !== 0) {
      this.movimientoEditado.crypto_amount = Number(String(newMoney)) / this.cryptoPrice || '';
    }    
    },
capitalizarInicio(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
},

onCryptoCodeChange(event) {
      this.movimientoEditado.crypto_code = event.target.value;
      this.movimientoEditado.crypto_amount = '';
      this.movimientoEditado.money = '';      
    },
async eliminarMovimiento(id) {
      try {      
        const headers = { 'x-apikey': '60eb09146661365596af552f' };
        await axios.delete(`https://laboratorio3-f36a.restdb.io/rest/transactions/${id}`, { headers });
        window.location.reload();

      } catch (error) {
        console.error('Error al eliminar movimiento:', error);
      }
    },
    formatearFecha(fecha) {
      return format(new Date(fecha), 'dd-MM-yyyy HH:mm');
    },
    abrirModalEdicion(id) {
      const movimiento = this.movimientos.find(mov => mov._id === id);
       console.log('Movimiento encontrado:', movimiento); 
       if (movimiento.crypto_code == 'ethereum'){
         movimiento.crypto_code = 'eth';
        }else if (movimiento.crypto_code == 'bitcoin'){
          movimiento.crypto_code = 'btc';
        }
        this.movimientoEditado = {
          _id: movimiento._id,
          crypto_code: movimiento.crypto_code,
          crypto_amount: movimiento.crypto_amount,
          money: movimiento.money,
          datetime: format(new Date(movimiento.datetime), 'dd-MM-yyyy HH:mm'),
          selectedDate: new Date(movimiento.datetime),
        };
        
        this.mostrarModal = true;
    },

    cerrarModalEdicion() {
      this.mostrarModal = false;
    },

    guardarEdicion() {
      const { _id, crypto_code, crypto_amount, } = this.movimientoEditado;
      
      if (!this.movimientoEditado.crypto_code && this.movimientoEditado.crypto_code != 'pesos') {
        alert('Por favor, seleccione una criptomoneda');
        return;
      }
      if (!this.movimientoEditado.crypto_amount && this.movimientoEditado.crypto_code != 'pesos' || parseFloat(this.movimientoEditado.crypto_amount) <= 0 && this.movimientoEditado.crypto_code != 'pesos' || isNaN(parseFloat(this.movimientoEditado.crypto_amount) && this.movimientoEditado.crypto_code != 'pesos')) {
        alert('La cantidad de criptomonedas debe ser superior a 0');
        return;
      }
      if (this.movimientoEditado.money <= 0 || isNaN(this.movimientoEditado.money)) {
        alert('El monto debe ser mayor que 0');
        return;
      }
      if (!this.movimientoEditado.selectedDate) {
        alert('Por favor, selecciona una fecha');
        return;
      }        
      let fechaActual = new Date();
      let fechaSeleccionada = flatpickr.parseDate(this.movimientoEditado.selectedDate, 'd-m-Y H:i');
      fechaActual = fechaActual.getTime();
      fechaSeleccionada = fechaSeleccionada.getTime();
      this.movimientoEditado.datetime = fechaSeleccionada;
      if (fechaSeleccionada > fechaActual) {
        alert('La fecha no puede ser superior a la fecha actual');
        return;
      }
      if (this.movimientoEditado.money > this.totalPesos && this.movimientoEditado.crypto_code != 'pesos'){
        alert('No posee suficientes pesos');
    }else{ 
axios.patch(`https://laboratorio3-f36a.restdb.io/rest/transactions/${_id}`, {
  crypto_code,
  crypto_amount,
  money: this.movimientoEditado.money.toFixed(2),
  datetime: this.movimientoEditado.datetime,
}, {
  headers: {
    'x-apikey': '60eb09146661365596af552f',
  },
})
.then(response => {
  console.log('Movimiento actualizado con éxito:', response.data);
  this.cerrarModalEdicion();
})
.catch(error => {
  console.error('Error al actualizar el movimiento:', error);
});
    }
  }
}
}
</script>

<style scoped>

input,
select {
  width: 30%;
  padding: 8px;
  margin-bottom: 5px;
}

button {
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
.totales{
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.modal {
  display: flex;
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
    align-items: center;
    flex-direction: column;
  }
#acceptModal, #closeModal{
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
p{
  margin-right: 50px;
}
.inputGroup {
  display: flex;
    flex-direction: column;
    margin-top: 10px;
    align-items: center;
    width: 80vh;
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
table {
  width: 80%;
  margin: auto;
  border-collapse: collapse;
  margin-top: 20px;
}
.herramientas{
  text-align: center;
}
.totales{
  display: flex;
  flex-direction: row;
  justify-content: center;
}
button{
  margin-right: 5px;
}
p{
  margin-right: 50px;
}
.number{
  text-align: right;
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
.body{  
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>