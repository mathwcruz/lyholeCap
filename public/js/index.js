//Insira a sua chave da API do coinmarketcap para poder consultar os dados da API, acesse https://coinmarketcap.com/api/ para mais explicações
var key = {
  apiKey: "2b997aa1-58f4-4453-95dc-0b52b32f31d3"
};

//Função para formatar a porcentagem de variação da moeda
function formatToPercent(number) {
  return `${new Number(number).toFixed(2)}%`;
};

//Função para formatar o numero para R$ (Real)
function formatToReal(number, maximumSignificantDigits) {
  return new Intl.NumberFormat(
    'pt-BR', // linguagem
    { 
      style: 'currency', //será do tipo 'moeda'
      currency: 'BRL', //simbolo da moeda
      maximumSignificantDigits //máximo de casas decimais da moeda
    })
    .format(number * 5.22);
};

//Função para veirificar o máximo de moedas disponiveis
function verifyMaxSupply(coins) {
  //CRIAR UMA FUNÇÃO PARA LIMITAR A QUANTIA DE 0
  const result = (coins === null || coins === undefined) ? '-' : coins; //se for igual a null, irá receber -, senao ira ficar com o valor da moeda
  return result;
};

//Requisição para consultar os dados da API
async function getDataFromApi() {
  try{
    const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${key.apiKey}`);
    return response.json();
  } catch (erro) {
    console.log(`Erro ocorrido: ${erro}`);
  };
};

const button = document.querySelector('#list-cryptocurrencies-button');

//Ao clicar no botáo, irá gerar uma tabela contendo os dados das criptomoedas
button.addEventListener('click', function(){
  getDataFromApi().then(results => {
    const data = results.data;
  
    const paragraph = document.querySelector('.list-cryptocurrencies p');
    const content = document.querySelector('.content');
    const table = `
    <table class="table-coins animate-up">
      <thead>
        <tr>
          <th class="column">Rank</th>
          <th class="column">Símbolo</th>
          <th class="column">Nome</th>
          <th class="column">Preço</th>
          <th class="column">24h</th>
          <th class="column">7d</th>
          <th class="column">Market Cap</th>
          <th class="column">Máx. de moedas</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(coin => (
          `
          <tr>
            <td class="row">${coin.cmc_rank}</td>
            <td class="row">${coin.symbol}</td>
            <td class="row">${coin.name}</td>
            <td class="row">${formatToReal(coin.quote.USD.price, 8)}</td>
            <td class="row">${formatToPercent(coin.quote.USD.percent_change_24h)}</td>
            <td class="row">${formatToPercent(coin.quote.USD.percent_change_7d)}</td>
            <td class="row">${formatToReal(coin.quote.USD.market_cap, 12)}</td>
            <td class="row">${verifyMaxSupply(coin.max_supply).toLocaleString('pt-BR')}</td>
          </tr>
          `
        ))}
      </tbody>
    </table>
    `;
    
    content.innerHTML = table;

    button.remove();
    paragraph.remove();

    setTimeout(function() {
      window.location.reload()
    }, 60000);

  });
});