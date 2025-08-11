// Script de prueba para verificar que el servidor esté funcionando
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8081,
  path: '/api/test',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Servidor respondiendo - Status: ${res.statusCode}`);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log(`📡 Respuesta del servidor:`, response);
    } catch (e) {
      console.log(`📡 Respuesta del servidor:`, data);
    }
  });
});

req.on('error', (e) => {
  console.log(`❌ Error de conexión: ${e.message}`);
  console.log(`💡 Asegúrate de que el servidor esté ejecutándose en el puerto 8081`);
});

req.end();

console.log('🧪 Probando conexión al servidor...');
console.log('📍 URL: http://localhost:8081/api/test');
