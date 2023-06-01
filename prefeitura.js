const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

const url = 'https://servicos.cloud.el.com.br/mg-manhuacu-pm/services/protocolo_consulta_visualizar.php';


const getHtml = async (url) => {
  try {
    const formData = new FormData();
    formData.append('codigo_processo', '202852691276392022');

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    let $ = cheerio.load(response.data)
    let protocolos = {}
    let informacoes = {}
    let processos = []

    $('div.panel-body').each((i, e) => {
      const infos = {};  
      $(e).contents().each((index, element) => {
        if (element.type === 'text') {
          const texto = $(element).prev('strong').text().replace(/�|:/g, '').toLowerCase().replace(/ /, '_');
          const valor = $(element).text().trim();
          if (texto && valor) {
              infos[texto] = valor;
          }
        }
      });
      informacoes = infos
    });
    let id = 0
    $('li.mt-item').each((i, e) =>{
      id ++
      const autor = $(e).find('.mt-author-name > a').text();
      const saida = $(e).find('.mt-author-notes').text();
      let data = {id,autor, saida}

      const destinoElement = $(e).find('.mt-content');
      
      $(destinoElement).contents().each((index, element) => {
        if (element.type === 'text') {
          const texto = $(element).prev('strong').text().replace(/�|:/g, '').toLowerCase();
          const valor = $(element).text().trim();
          if (texto && valor) {
            data[texto] = valor;
          }
        }
      });
      const despacho = $(e).find('span').text().trim()
      data['despacho'] = despacho
      processos.push(data)
    })
    protocolos = {informacoes, processos}
    console.log(protocolos)

  } catch (error) {
    console.error(error);
  }
};

getHtml(url);