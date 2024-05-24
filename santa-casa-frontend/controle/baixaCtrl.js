var jsonBaixa = {
    idBaixa: 0,
    ItensBaixa: [],
    funcionario: {},
    dataBaixa: 0,
    local: {}
};

var jsonItBaixa = {
    baixa: {},
    produto: {},
    motivo: {},
    quantidade: 0,
    lote: {},
    unidade: {},
    ib_idObservacao: ""
};

/* requisição JSON para testar backend
{
    "itensBaixa": [
        {
            "produto": {
                "prod_ID": 1
            },
            "motivo": {
                "motivo_id": 1
            },
            "quantidade": 17,
            "lote": {
                "codigo": "L001"
            },
            "unidade": {
                "un_cod": 1
            },
            "ib_idObservacao": "Teste"
        },

        {
            "produto": {
                "prod_ID": 2
            },
            "motivo": {
                "motivo_id": 2
            },
            "quantidade": 17,
            "lote": {
                "codigo": "L002"
            },
            "unidade": {
                "un_cod": 2
            },
            "ib_idObservacao": "Teste DOIS"
        }
    ],
    "funcionario": {
        "idFuncionario": 3
    },
    "dataBaixa": "2024-06-29",
    "local": {
        "loc_id": 1
    }
}

*/

const urlBase = 'http://localhost:4040';
var formBaixa = document.getElementById('formBaixa');
formBaixa.reset();
formBaixa.onsubmit = validarFormulario;
document.getElementById("funcionario").value = 3;//a partir do login, identificar funcionario
var listaItensBaixa = [];
var qtdeTotalLoteSelecionado = 0;
var listaLotes = [];
var funcBaixa;
var listaUni = [];
var listaMt = [];

procuraFuncionario();
adicionarUnidade();
adicionarMotivos();

function procuraFuncionario() {
    let idFunc = document.getElementById('funcionario').value;
    fetch(urlBase + '/funcionario/' + idFunc, {
        method: "GET"
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            funcBaixa = json.listaFuncionarios[0];
            document.getElementById("funcionario").value = funcBaixa.nome_funcionario;
        });
}

exibirListaItensBaixa();
carregaProdutos();


function validarFormulario(evento) {
    if (listaItensBaixa.length) {
        let dataAtual = new Date();
        dataAtual.setHours(dataAtual.getHours() - 3);
        // Formata a data para o formato compatível com o MySQL
        let dataFormatada = dataAtual.toISOString().slice(0, 19).replace('T', ' ');
        
        jsonBaixa.itensBaixa= listaItensBaixa;
        jsonBaixa.funcionario= funcBaixa;
        jsonBaixa.dataBaixa= dataFormatada;
        jsonBaixa.local= {loc_id: 1};
        fetch(urlBase + '/baixa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonBaixa)
        })
            .then((resposta) => {
                return resposta.json();
            })
            .then((dados) => {
                if (dados.status) {
                    limparFormItemBaixa();
                    listaItensBaixa = [];
                    exibirListaItensBaixa();
                    exibirMensagem(dados.mensagem, "ok");
                }
                else {
                    exibirMensagem(dados.mensagem);
                }
            })
            .catch((erro) => {
                exibirMensagem("Não foi posssivel completar a operação: " + erro.message);
            })
    }
    else {
            if (!listaItensBaixa.length) {
                //Se zero, entra
                exibirMensagem('Informe os itens consumidos!')
            }
        
    }
    evento.preventDefault();
    evento.stopPropagation();
}
//  cria listas (fetch) de todos, depois da um find  
function adicionarItemBaixa() {
    let codProd = document.getElementById('produto').value;
    let codMotivo = document.getElementById("motivo").value;
    let qtde = document.getElementById('qtde').value;
    let codLote = document.getElementById('lote').value;
    let codUnidade = document.getElementById("unidade").value;
    let obs = document.getElementById("observacao").value;
    let objLote = listaLotes.find(itemLote => itemLote.codigo === codLote && itemLote.produto.prod_ID == codProd);
    let objProd;
    let objMotivo = listaMt.find(itemMotivo => itemMotivo.motivo_id == codMotivo);
    let objUnidade = listaUni.find(itemUnidade => itemUnidade.un_cod == codUnidade);

    objLote ? objProd = objLote.produto : objProd = null;
    if (objProd && objMotivo && qtde <= qtdeTotalLoteSelecionado && objLote && objUnidade && obs) {
        let itemExistente = listaItensBaixa.find(item => item.lote.codigo === objLote.codigo && item.produto.prod_ID === objProd.prod_ID);
        // Verifica se já existe um item com o mesmo produto e lote
        if (itemExistente) {
            // Se existir, apenas aumenta a quantidade
            let num = parseInt(itemExistente.quantidade);
            num += parseInt(qtde);
            if(num <= qtdeTotalLoteSelecionado){
                itemExistente.quantidade = parseInt(num);
            }
            else{
                exibirMensagem("Quantidade máxima de baixa desse lote alcançada!");
            }
        }
        else {
            // Se não existir, cria um novo item
            let itBaixa = new ItensBaixa(null, objProd, objMotivo, qtde, objLote, objUnidade, obs);
            listaItensBaixa.push(itBaixa);
        }
        limparFormItemBaixa();
        exibirListaItensBaixa();
        adicionarUnidade();
        adicionarMotivos();
        
    }
    else {
        if (!objProd) {
            exibirMensagem("Para dar baixa voce deve selecionar um produto!");
        }
        else if (!objLote) {
            exibirMensagem("Para dar baixa voce deve selecionar um lote");
        }
        else if (!objMotivo) {
            exibirMensagem("Para dar baixa voce deve selecionar um motivo");
        }
        else if (!qtde) {
            exibirMensagem("Para dar baixa voce deve informar a quantidade utilizada!");
        }
        else if (!obs) {
            exibirMensagem("Para dar baixa voce deve deixar uma observação!");
        }
        else if (qtde > qtdeTotalLoteSelecionado) {
            exibirMensagem("Não é possível consumir mais do que há disponível no lote!");
        }
    }
}

function removerItemBaixa(codProd, codMotivo, qtde, codLote, codUnidade, obs) {
    listaItensBaixa = listaItensBaixa.filter(item => {
        return  
                item.produto.prod_ID != codProd || 
                item.motivo.motivo_id != codMotivo || 
                item.quantidade != qtde || 
                item.lote.codigo != codLote || 
                item.unidade.un_cod != codUnidade ||
                item.ib_idObservacao != obs;
    });
    exibirListaItensBaixa();
}

function limparFormItemBaixa() {
    document.getElementById('produto').value = '';
    document.getElementById('nomeProduto').value = '';
    document.getElementById('lote').value = '';
    document.getElementById('lote').innerHTML = '';
    document.getElementById('dataVencimento').value = '';
    document.getElementById('qtde').value = '';
    document.getElementById('unidade').value = '';
    document.getElementById('unidade').innerHTML = '';
    document.getElementById('motivo').value = '';
    document.getElementById('motivo').innerHTML = '';
    document.getElementById('observacao').value = '';
}

function exibirListaItensBaixa() {
    let divItensBaixa = document.getElementById("tabelaItensBaixa");
    divItensBaixa.innerHTML = '';
    if (listaItensBaixa.length) {
        let tabela = document.createElement('table');
        tabela.style.borderCollapse = 'collapse';
        tabela.style.width = '95%';
        tabela.style.borderBottom = '1px solid';
        //tabela.className = 'table table-striped table-hover';
        let cabecalho = document.createElement('thead');
        cabecalho.style.borderBottom = '1px solid';
        cabecalho.innerHTML = `
                    <tr'>
                        <th>Lote</th>
                        <th>Produto</th>
                        <th>Qtde</th>
                        <th>Unidade</th>
                        <th>Motivo</th>
                        <th>Observacao</th>
                    </tr>
                    `;
        tabela.appendChild(cabecalho);
        let corpo = document.createElement('tbody');
        for (let i = 0; i < listaItensBaixa.length; i++) {
            let linha = document.createElement('tr');
            let itBaixa = listaItensBaixa[i];
            linha.innerHTML = `
                        <td>${itBaixa.lote.codigo}</td>
                        <td>${itBaixa.produto.nome}</td>
                        <td>${itBaixa.quantidade}</td>
                        <td>${itBaixa.unidade.unidade}</td>
                        <td>${itBaixa.motivo.motivo}</td>
                        <td>${itBaixa.ib_idObservacao}</td>
                        <td>
                            <button class="" onclick="removerItemBaixa(${gerarParametrosItemBaixa(itBaixa)})">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 64 64">
                                    <path d="M 28 11 C 26.895 11 26 11.895 26 13 L 26 14 L 13 14 C 11.896 14 11 14.896 11 16 C 11 17.104 11.896 18 13 18 L 14.160156 18 L 16.701172 48.498047 C 16.957172 51.583047 19.585641 54 22.681641 54 L 41.318359 54 C 44.414359 54 47.041828 51.583047 47.298828 48.498047 L 49.839844 18 L 51 18 C 52.104 18 53 17.104 53 16 C 53 14.896 52.104 14 51 14 L 38 14 L 38 13 C 38 11.895 37.105 11 36 11 L 28 11 z M 18.173828 18 L 45.828125 18 L 43.3125 48.166016 C 43.2265 49.194016 42.352313 50 41.320312 50 L 22.681641 50 C 21.648641 50 20.7725 49.194016 20.6875 48.166016 L 18.173828 18 z"></path>
                                </svg>
                            </button>
                        </td>
                        `;
            linha.style.borderBottom = '1px solid';
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divItensBaixa.appendChild(tabela);
    }
    else {
        divItensBaixa.innerHTML = 'Nenhum produto foi utilizado';
    }
}

function gerarParametrosItemBaixa(itBaixa) {
    return `'${itBaixa.produto.prod_ID}','${itBaixa.motivo.motivo_id}','${itBaixa.quantidade}',
    '${itBaixa.lote.codigo}','${itBaixa.unidade.un_cod}','${itBaixa.ib_idObservacao}'`;
}


function carregaProdutos() {
    let pesquisa = document.getElementById("pesquisaProduto").value;
    fetch(urlBase + '/produto' + '/' + pesquisa, {
        method: "GET"
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            let divTabProduto = document.getElementById("tabelaProduto");
            if (json.status) {
                divTabProduto.innerHTML = "";
                listaProdutos = json.listaProdutos;
                if (Array.isArray(listaProdutos)) {
                    if (listaProdutos.length > 0) {
                        let tabela = document.createElement('table');
                        tabela.style.borderCollapse = 'collapse';
                        tabela.style.width = '95%';
                        tabela.style.borderBottom = '1px solid';
                        //tabela.className = 'table table-striped table-hover';
                        let cabecalho = document.createElement('thead');
                        cabecalho.style.borderBottom = '1px solid';
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
                        <td>${produto.fabricante.f_nome}</td>
                        <td>${produto.psicotropico}</td>
                        <td>
                            <button class="" onclick="selecionarProduto(${gerarParametrosProduto(produto)})">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="10px" viewBox="0 0 24 24">
                                    <path d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z"></path>
                                </svg>
                            </button>
                        </td>
                        `;
                            linha.style.borderBottom = '1px solid';
                            corpo.appendChild(linha);
                        }
                        tabela.appendChild(corpo);
                        divTabProduto.appendChild(tabela);
                    }
                    else {
                        divTabProduto.innerHTML = `<div> 
                                    Não existem produtos com essa descrição
                                </div>`;
                    }
                }
            }
            else {
                divTabProduto.innerHTML = "Não foi possível consultar os produtos";
            }
        })
}

function selecionarProduto(prod_ID, Fabricante_idFabricante, nome, psicotropico, valor_custo, far_cod, ffa_cod, uni_cod, observacao, descricao_uso, tipo, un_min) {
    document.getElementById('produto').value = prod_ID;
    document.getElementById('nomeProduto').value = nome;
    document.getElementById('qtde').focus();
    adicionarLote(prod_ID);
    adicionarUnidade();
    adicionarMotivos();
}

function adicionarLote(produto) {
    fetch(urlBase + "/lote" + "?" + "produto=" + produto, {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    })
        .then((json) => {
            listaLotes = [];
            let selectLote = document.getElementById("lote");
            selectLote.innerHTML = "";
            selectLote.value = "";
            selectLote.text = "";
            let listaLot = json.listaLotes;
            if (Array.isArray(listaLot)) {
                for (let i = 0; i < listaLot.length; i++) {
                    let lote = listaLot[i];
                    let objLote = new Lote(lote.codigo, formataData(lote.data_validade), lote.quantidade, lote.produto, lote.formaFarmaceutica, lote.conteudo_frasco, lote.unidade, lote.total_conteudo);
                    let optionLote = document.createElement("option");
                    optionLote.value = objLote.codigo;
                    optionLote.text = objLote.codigo + "/" + objLote.produto.prod_ID;
                    listaLotes.push(objLote);
                    selectLote.appendChild(optionLote);
                    if (!i) {
                        qtdeTotalLoteSelecionado = objLote.total_conteudo;
                        document.getElementById("dataVencimento").value = formataData(objLote.data_validade);
                    }
                };
            }
        });
}

function adicionarUnidade() {
    fetch(urlBase + "/unidade", {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    })
        .then((json) => {
            listaUni = [];
            let selectUnidade = document.getElementById("unidade");
            selectUnidade.innerHTML = "";
            selectUnidade.value = "";
            selectUnidade.text = "";
            let listaUn = json.listaUnidades;
            if (Array.isArray(listaUn)) {
                for (let i = 0; i < listaUn.length; i++) {
                    let un = listaUn[i];
                    let objUn = new Unidade(un.un_cod, un.unidade);
                    let optionUnidade = document.createElement("option");
                    optionUnidade.value = objUn.un_cod;
                    optionUnidade.text = objUn.unidade;
                    listaUni.push(objUn);
                    selectUnidade.appendChild(optionUnidade);
                };
            }
        });
}

function adicionarMotivos() {
    fetch(urlBase + "/motivo", {
        method: "GET"
    }).then((resposta) => {
        return resposta.json();
    })
        .then((json) => {
            listaMt = [];
            let selectMotivo = document.getElementById("motivo");
            selectMotivo.innerHTML = "";
            selectMotivo.value = "";
            selectMotivo.text = "";
            let mtLista = json.listaMotivos;
            if (Array.isArray(mtLista)) {
                for (let i = 0; i < mtLista.length; i++) {
                    let mt = mtLista[i];
                    let ObjMt = new Motivo(mt.motivo_id, mt.motivo);
                    let optionMotivo = document.createElement("option");
                    optionMotivo.value = ObjMt.motivo_id;
                    optionMotivo.text = ObjMt.motivo;
                    listaMt.push(ObjMt);
                    selectMotivo.appendChild(optionMotivo);
                };
            }
        });
}

document.getElementById("lote").addEventListener("change", function () {
    let codLote = document.getElementById('lote').value;
    let codProd = document.getElementById('produto').value;
    let objLote = listaLotes.find(item => item.codigo === codLote && item.produto.prod_ID == codProd);
    document.getElementById('dataVencimento').value = formataData(objLote.data_validade);
    qtdeTotalLoteSelecionado = objLote.total_conteudo;
});



function formataData(dataParametro) {
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



function gerarParametrosProduto(produto) {
    return `'${produto.prod_ID}','${produto.Fabricante_idFabricante}','${produto.nome}',
    '${produto.psicotropico}','${produto.valor_custo}','${produto.far_cod}',
    '${produto.observacao}','${produto.tipo}','${produto.un_min}'`;
}


function exibirMensagem(mensagem, estilo) {
    let elemMensagem = document.getElementById('mensagem');
    if (!estilo) {
        estilo = 'aviso';
    }
    if (estilo == 'aviso') {
        //Mensagem alerta
        elemMensagem.innerHTML = `  <div class='divMsg msgAviso'>
                                        <p>${mensagem}</p>
                                    </div>`;
    }
    else if(estilo == 'ok'){
        elemMensagem.innerHTML= `   <div class='divMsg msgOk'>
                                        <p>${mensagem}</p>
                                    </div>`;
    }
    else {
        //quando estilo= 'erro';
        elemMensagem.innerHTML = `  <div class='divMsg msgErro'>
                                        <p>${mensagem}</p>
                                    </div>`;
    }

    setTimeout(() => {
        elemMensagem.innerHTML = '';
    }, 7000);//7 Segundos
}


function controlaQtde(){
    let qtdeInformada = document.getElementById("qtde").value;
    if(qtdeInformada > qtdeTotalLoteSelecionado){
        document.getElementById("qtde").value= qtdeTotalLoteSelecionado;
        exibirMensagem("Capacidade total do lote alcançada!");
    }
}