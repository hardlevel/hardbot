const hoje = new Date();
const proximaTerca = new Date(hoje);
proximaTerca.setDate(proximaTerca.getDate() + ((2 + 7 - hoje.getDay()) % 7)); // Próxima terça-feira

proximaTerca.setHours(20); // Define a hora para 19h
proximaTerca.setMinutes(30); // Define os minutos para 0 (opcional)

// Converte a data para o formato ISO 8601
const dataTercaISO8601 = proximaTerca.toISOString();
console.log(dataTercaISO8601);
console.log(proximaTerca);
console.log(hoje);