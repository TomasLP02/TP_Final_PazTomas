import axios from 'axios';

export async function obtenerTotales() {
  try {
    const userID = localStorage.getItem('userID');
    const headers = { 'x-apikey': '60eb09146661365596af552f' };

    const response = await axios.get(
      `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id": "${userID}"}`,
      { headers }
    );

    const movimientos = response.data;
    const totalPesos = movimientos.reduce((total, movimiento) => {
      const monto = parseFloat(movimiento.money) || 0;
      const cryptoAmount = parseFloat(movimiento.crypto_amount) || 0;

      if (movimiento.crypto_code === 'bitcoin' || movimiento.crypto_code === 'btc') {
        total.totalBitcoin += movimiento.action === 'purchase' ? cryptoAmount : - cryptoAmount;
      } else if (movimiento.crypto_code === 'ethereum' || movimiento.crypto_code === 'eth') {
        total.totalEthereum += movimiento.action === 'purchase' ? cryptoAmount : - cryptoAmount;
      } else if (movimiento.crypto_code === 'dai') {
        total.totalDai += movimiento.action === 'purchase' ? cryptoAmount : - cryptoAmount;
      }

      total.totalPesos += movimiento.action === 'purchase' ? - monto : monto;

      return total;
    }, { totalPesos: 0, totalDai: 0, totalBitcoin: 0, totalEthereum: 0 });

    return { movimientos, ...totalPesos };
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    throw error;
  }
}