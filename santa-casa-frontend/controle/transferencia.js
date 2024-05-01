const urlBase = 'http://localhost:4040';

var pesquisa = document.getElementById('form_pesquisa_produto');
pesquisa.reset();
pesquisa.onsubmit = validarFormulario;

adicionarOrigem();
adicionarDestino();

function limparFormulario(){
    document.getElementById('selectOrigem').value = "";
    document.getElementById('selectFabricante').value = "";
    document.getElementById('selectDestino').value = "";
    document.getElementById('iProd').value = "";
    document.getElementById('iLote').value = "";
    document.getElementById('iData').value = "";
    document.getElementById('iQtde').value = "";
    document.getElementById('iMedida').value = "";
}

function adicionarOrigem(){
    fetch(urlBase + "/local",{
        method: 'GET',
        redirect: 'follow'
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            let select = document.getElementById('selectOrigem');
            
            listaFor = json.listaLocais;
            if (Array.isArray(listaFor)) {
                if (listaFor.length > 0) {
                    for (let i = 0; i < listaFor.length; i++) {
                        let lugar = listaFor[i];
                        let option = document.createElement('option');
                        option.text = lugar.loc_nome;
                        option.value = lugar.loc_id;
                        select.appendChild(option);
                    }
                }
                else {
                    select.innerHTML = `<option>Erro Local</option>`;
                }
            }
        })
        .catch((erro) => {
            exibirMensagem('Não foi possível recuperar os locais do backend: ' + erro.message);
        });
}

function validarFormulario(evento) {
    if (pesquisa.checkValidity()) {
        let prod_ID = document.getElementById('pesquisa_produto').value;

        fetch(urlBase + "/produto" + "/" + prod_ID, {
            method: "GET"
        })
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error(`HTTP error! status: ${resposta.status}`);
            }
            return resposta.json();
        })
        .then((json) => {
            let divTabela = document.getElementById('tabela');
            divTabela.innerHTML = '';
            listaProdutos = json.listaProdutos;
            if (Array.isArray(listaProdutos)) {
                if (listaProdutos.length > 0) {
                    let tabela = document.createElement('table');
                    tabela.className = 'table table-striped table-hover';
                    let cabecalho = document.createElement('thead');
                    cabecalho.innerHTML = `
                    <tr>
                        <th>Nome</th>
                        <th>Fabricante</th>
                        <th>Psicotropico</th>
                    </tr>
                    `;
                    tabela.appendChild(cabecalho);
                    let corpo = document.createElement('tbody');
                    for (let i = 0; i < listaProdutos.length; i++) {
                        let linha = document.createElement('tr');
                        let produto = listaProdutos[i];
                        linha.innerHTML = `
                        <td>${produto.nome}</td>
                        <td>${produto.Fabricante_idFabricante}</td>
                        <td>${produto.psicotropico}</td>
                        <td>
                            <button class="" onclick="selecionarProduto(${gerarParametrosProduto(produto)})">  
                            </button>
                        </td>
                        `;
                        corpo.appendChild(linha);
                    }
                    tabela.appendChild(corpo);
                    divTabela.appendChild(tabela);
                }
                else {
                    divTabela.innerHTML = `<div class="alert alert-warning" role="alert"> 
                                    Não existem Produtos cadastrados
                                </div>`;
                }
            }
        })
        .catch((erro) => {
            exibirMensagem('Não foi possível encontrar os Produtos: ' + erro.message);
        });
    }
    else {
        pesquisa.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function adicionarDestino(){
    fetch(urlBase + "/local",{
        method: 'GET',
        redirect: 'follow'
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            let select = document.getElementById('selectDestino');
            
            listaFor = json.listaLocais;
            if (Array.isArray(listaFor)) {
                if (listaFor.length > 0) {
                    for (let i = 0; i < listaFor.length; i++) {
                        let lugar = listaFor[i];
                        let option = document.createElement('option');
                        option.text = lugar.loc_nome;
                        option.value = lugar.loc_id;
                        select.appendChild(option);
                    }
                }
                else {
                    select.innerHTML = `<option>Erro Local</option>`;
                }
            }
        })
        .catch((erro) => {
            exibirMensagem('Não foi possível recuperar os locais do backend: ' + erro.message);
        });
}

function formataData(dataParametro){
    // Convertendo a string em um objeto Date
    let data = new Date(dataParametro);

    // Obtendo o ano, mês e dia
    let ano = data.getFullYear();
    let mes = ('0' + (data.getMonth() + 1)).slice(-2); // Adicionando 1 porque os meses são zero indexados
    let dia = ('0' + data.getDate()).slice(-2);

    // Formatando a data no formato esperado pelo input tipo date
    let dataFormatada = ano + '-' + mes + '-' + dia;

    // Atribuindo a data formatada ao campo de data
    return dataFormatada;
}

function dataAtualFormatada(){
    let dataAtual = new Date();

    // Obtendo o ano, mês, dia, hora, minuto, segundo e milissegundo da data atual
    let ano = dataAtual.getFullYear();
    let mes = ('0' + (dataAtual.getMonth() + 1)).slice(-2); // Adicionando 1 porque os meses são zero indexados
    let dia = ('0' + dataAtual.getDate()).slice(-2);
    let hora = ('0' + dataAtual.getHours()).slice(-2);
    let minuto = ('0' + dataAtual.getMinutes()).slice(-2);
    let segundo = ('0' + dataAtual.getSeconds()).slice(-2);
    let milissegundo = ('00' + dataAtual.getMilliseconds()).slice(-3);

    // Formatando a data atual no formato ISO 8601
    let dataFormatada = `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}.${milissegundo}Z`;
    return dataFormatada;
}

function gerarParametrosProduto(produto) {
    return `'${produto.prod_ID}','${produto.Fabricante_idFabricante}','${produto.nome}',
    '${produto.psicotropico}','${produto.valor_custo}','${produto.far_cod}',
    '${produto.observacao}','${produto.tipo}'`;
}

function disabled_able() {
    let a = document.getElementById('capacidade').disabled;
    let inputs = ['iData', 'iMedida', 'iLote'];
    
    for (let i = 0; i < inputs.length; i++) {
        let input = document.getElementById(inputs[i]);
        input.disabled = !a;
    }

}