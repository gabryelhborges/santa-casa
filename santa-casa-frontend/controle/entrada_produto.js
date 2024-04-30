const urlBase = 'http://localhost:4040';

adicinar();

var pesquisa = document.getElementById('form_pesquisa_produto');
pesquisa.reset();
pesquisa.onsubmit = validarFormulario;


var uni = document.getElementById("unidade");

// var entradaProd = document.getElementById('entrada_produto');
// entradaProd.reset();
// entradaProd.onsubmit = validarEntrada;

// function validarEntrada(evento){
//     if(entradaProd.checkValidity()){
        
//     }
//     evento.preventDefault();
//     evento.stopPropagation();
// }


function adicinar(evento){
    fetch(urlBase + "/unidade",{
        method: "GET",
        redirect: "follow"
    }).then((resposta) => { 
       return resposta.json();
    }).then((json) => {  
        let select = document.getElementById("unidade");
        listaUnidades = json.listaUnidades;
        if(Array.isArray(listaUnidades)){
            for (let i=0 ;i < listaUnidades.length; i++){  
                let option = document.createElement("option")  ;
                option.value = listaUnidades[i].un_cod;
                option.text = listaUnidades[i].unidade;
                select.appendChild(option);                      
            };
        }
    });
    fetch(urlBase + "/forma",{
        method:"GET"
    }).then((response)=>{
        return response.json()
    }).then((json)=>{
        let select = document.getElementById("forma_farmaceutica");
        listaFormaFaramaceuticas = json.listaFormaFaramaceuticas;
        if(Array.isArray(listaFormaFaramaceuticas)){
            for (let i=0 ;i < listaFormaFaramaceuticas.length; i++){  
                let option = document.createElement("option")  ;
                option.value = listaFormaFaramaceuticas[i].ffa_cod;
                option.text = listaFormaFaramaceuticas[i].forma;
                select.appendChild(option);                      
            };
        }
    });
};

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
                        <th>Valor</th>
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

function selecionarProduto(prod_ID, Fabricante_idFabricante, nome, psicotropico, valor_custo, far_cod, ffa_cod, uni_cod, observacao, descricao_uso,tipo) {
    document.getElementById('id_produto').value = prod_ID;
    document.getElementById('nome_produto').value = nome;
    fetch(urlBase + "/fabricante" + "/" + Fabricante_idFabricante, {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    })
    .then((json) => {
        listaFabricante = json.listaFabricante;
        document.getElementById('nome_fabricante').value = listaFabricante[0].f_nome;
    });
    adicionarLote(prod_ID);
}

function adicionarLote(produto){
    fetch(urlBase + "/lote" + "?" + "produto=" + produto, {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    })
    .then((json) => {
        let select = document.getElementById("codigo_lote");
        listaLotes = json.listaLotes;
        if(Array.isArray(listaLotes)){
            for (let i=0 ;i < listaLotes.length; i++){  
                let lit = listaLotes[i]
                let option = document.createElement("option");
                option.value = lit.codigo + "/" + lit.data_validade
                 + "/" + lit.conteudo_frasco;
                option.text = lit.codigo + "/" + produto;
                select.appendChild(option);                      
            };
            let criarNovo = document.createElement("option");
            criarNovo.textContent = "Criar Novo Lote"; // Correção: usar textContent em vez de text
            criarNovo.value = "criarNovo";// Correção: adicionar evento de click corretamente
            select.appendChild(criarNovo);
        }
    });
}

function separarPorHifen(str) {
    if (str.includes('/')) {
        const partes = str.split('/');
        
        return {
            parte1: partes[0],
            parte2: partes[1],
            parte3: partes[2]
        };
    } else {
        return null; // ou throw new Error('A string não contém um hífen.');
    }
}

document.getElementById("codigo_lote").addEventListener("change", function() {
    if (this.value === "criarNovo") { // Se a opção "Criar Novo Lote" for selecionada
        criarLote(); // Chama a função criarLote
    }else{
        let valor = separarPorHifen(this.value);
        let capacidadeInteiro = parseInt(valor.parte3); // Acessa a propriedade corretamente
        document.getElementById('capacidade').value = capacidadeInteiro;
        document.getElementById('validade').value = valor.parte2;
    }
});

function criarLote(){
    document.getElementById('codigo_lote').style.display = 'none';
    document.getElementById('seta_selec').style.display = 'none';
    document.getElementById('criar_codigo_lote').style.display = "block";
    document.getElementById('btn-select').style.display = "block";
}

function exibirMensagem(mensagem) {
    let elemMensagem = document.getElementById('mensagem');
    elemMensagem.innerHTML = `<div class='alert alert success'>
                        <p class = 'text-center'>${mensagem}</p>
                    </div>`;
    setTimeout(() => {
        elemMensagem.innerHTML = '';
    }, 7000);//7 Segundos
}