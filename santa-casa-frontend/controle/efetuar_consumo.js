var jsonConsumo = {
    idConsumo: 0,
    paciente: {},
    funcionario: {},
    itensConsumo: [],
    local: {},
    dataConsumo: 0
};

var jsonItCons = {
    consumo: {},
    lote: {},
    produto: {},
    qtdeConteudoUtilizado: 0
};

const urlBase = 'http://localhost:4040';
var formConsumo = document.getElementById('formConsumo');
formConsumo.reset();
formConsumo.onsubmit = validarFormulario;
document.getElementById("funcionario").value = 1;//a partir do login, identificar funcionario
var listaItensConsumo = [];
var qtdeTotalLoteSelecionado = 0;
var listaLotes = [];
var listaUnidadesMedida= [];
var pacConsumo;
var funcConsumo;
procuraFuncionario();

function procuraFuncionario() {
    let idFunc = document.getElementById('funcionario').value;
    fetch(urlBase + '/funcionario/' + idFunc, {
        method: "GET"
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            funcConsumo = json.listaFuncionarios[0];
            document.getElementById("funcionario").value = funcConsumo.nome_funcionario;
        });
}
exibirListaItensConsumo();
carregaPacientes();
carregaProdutos();

function limpaPaciente() {
    pacConsumo = null;
    document.getElementById('paciente').value = '';
}

function validarFormulario(evento) {
    let pac = document.getElementById("paciente").value;
    if ( listaItensConsumo.length && pac) {
        let dataAtual = new Date();
        dataAtual.setHours(dataAtual.getHours() - 3);
        // Formata a data para o formato compatível com o MySQL
        let dataFormatada = dataAtual.toISOString().slice(0, 19).replace('T', ' ');
        //const cons = new Consumo(0, pacConsumo, funcConsumo, listaItensConsumo, dataFormatada);
        jsonConsumo.paciente= pacConsumo;
        jsonConsumo.funcionario= funcConsumo;
        jsonConsumo.itensConsumo= listaItensConsumo;
        jsonConsumo.dataConsumo= dataFormatada;
        jsonConsumo.local= {loc_id: 1};
        fetch(urlBase + '/consumo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonConsumo)
        })
            .then((resposta) => {
                return resposta.json();
            })
            .then((dados) => {
                if (dados.status) {
                    limpaPaciente();
                    limparFormItemConsumo();
                    listaItensConsumo = [];
                    exibirListaItensConsumo();
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
        if (!listaItensConsumo.length && !pac) {
            exibirMensagem('Informe os itens consumidos e o paciente!');
        }
        else {
            if (!listaItensConsumo.length) {
                //Se zero, entra
                exibirMensagem('Informe os itens consumidos!')
            }
            if (!pac) {
                exibirMensagem('Informe o paciente!');
            }
        }
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function adicionarItemConsumo() {
    let codLote = document.getElementById('lote').value;
    let codProd = document.getElementById('produto').value;
    let objLote = listaLotes.find(itemLote => itemLote.codigo === codLote && itemLote.produto.prod_ID == codProd);
    let objProd;
    objLote ? objProd = objLote.produto : objProd = null;
    let qtde = document.getElementById('qtde').value;

    //Se unidade for igual a lote, fazer a conversão pra unidade minima
    let unidadeMedidaSelecionada = document.getElementById('unidadeMedida').value;
    if(unidadeMedidaSelecionada == objLote.unidade.un_cod){
        let unidadeLote = objLote.unidade.unidade;
        let qtdeUnidade = unidadeLote.match(/\d+/g);
        if(qtdeUnidade !== null){
            let numInteiro = qtdeUnidade.map(num => parseInt(num, 10));
            qtde = qtde * numInteiro;
        }
    }
    if (objLote && objProd && qtde > 0 && qtde <= qtdeTotalLoteSelecionado) {
        let itemExistente = listaItensConsumo.find(item => item.lote.codigo === objLote.codigo && item.produto.prod_ID === objProd.prod_ID);
        // Verifica se já existe um item com o mesmo produto e lote
        if (itemExistente) {
            // Se existir, apenas aumenta a quantidade
            let num = parseInt(itemExistente.qtdeConteudoUtilizado);
            num += parseInt(qtde);
            if(num <= qtdeTotalLoteSelecionado){
                itemExistente.qtdeConteudoUtilizado = parseInt(num);
            }
            else{
                exibirMensagem("Quantidade máxima de consumo desse lote alcançada!");
            }
        }
        else {
            // Se não existir, cria um novo item
            let itCons = new ItensConsumo(null, objLote, objProd, qtde);
            listaItensConsumo.push(itCons);
        }
        /*let index = listaLotes.findIndex(itemLote => itemLote.codigo === codLote && itemLote.produto.prod_ID == codProd);
        listaLotes[index].total_conteudo-= parseInt(qtde);*/
        limparFormItemConsumo();
        exibirListaItensConsumo();
    }
    else {
        if (!objProd) {
            exibirMensagem("Para consumir um produto voce deve selecionar um produto!");
        }
        else if (!objLote) {
            exibirMensagem("Para consumir um produto voce deve selecionar um lote");
        }
        else if (!qtde) {
            exibirMensagem("Para consumir um produto voce deve informar a quantidade utilizada!");
        }
        else if (qtde > qtdeTotalLoteSelecionado) {
            exibirMensagem("Não é possível consumir mais do que há disponível no lote!");
        }
    }
}

function removerItemConsumo(codLote, codProd, qtdeConteudoUtilizado) {
    listaItensConsumo = listaItensConsumo.filter(item => {
        return item.lote.codigo != codLote || item.produto.prod_ID != codProd || item.qtdeConteudoUtilizado != qtdeConteudoUtilizado;
    });
    exibirListaItensConsumo();
}

function limparFormItemConsumo() {
    document.getElementById('produto').value = '';
    document.getElementById('nomeProduto').value = '';
    document.getElementById('lote').value = '';
    document.getElementById('lote').innerHTML = '';
    document.getElementById('dataVencimento').value = '';
    document.getElementById('qtde').value = '';
    document.getElementById('unidadeMedida').innerHTML= '';
}

function exibirListaItensConsumo() {
    let divItensCons = document.getElementById("tabelaItensConsumo");
    divItensCons.innerHTML = '';
    if (listaItensConsumo.length) {
        let tabela = document.createElement('table');
        tabela.style.borderCollapse = 'collapse';
        tabela.style.width = '95%';
        tabela.style.borderBottom = '1px solid';
        //tabela.className = 'table table-striped table-hover';
        let cabecalho = document.createElement('thead');
        cabecalho.style.borderBottom = '1px solid';
        cabecalho.innerHTML = `
                    <tr>
                        <th>Lote</th>
                        <th>Produto</th>
                        <th>Qtde</th>
                        <th>Unidade Mínima</th>
                        <th>Ação</th>
                    </tr>
                    `;
        tabela.appendChild(cabecalho);
        let corpo = document.createElement('tbody');
        for (let i = 0; i < listaItensConsumo.length; i++) {
            let linha = document.createElement('tr');
            let itCons = listaItensConsumo[i];
            linha.innerHTML = `
                        <td>${itCons.lote.codigo}</td>
                        <td>${itCons.produto.nome}</td>
                        <td>${itCons.qtdeConteudoUtilizado}</td>
                        <td>${itCons.produto.unidade.unidade}</td>
                        <td>
                            <button class="" onclick="removerItemConsumo(${gerarParametrosItemConsumo(itCons)})">
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
        divItensCons.appendChild(tabela);
    }
    else {
        divItensCons.innerHTML = 'Nenhum produto foi utilizado';
    }
}

function gerarParametrosItemConsumo(itCons) {
    return `'${itCons.lote.codigo}','${itCons.produto.prod_ID}','${itCons.qtdeConteudoUtilizado}'`;
}

function carregaPacientes() {
    let pesquisa = document.getElementById("pesquisaPaciente").value;
    fetch(urlBase + '/paciente' + '/' + pesquisa, {
        method: "GET"
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            let divTabPaciente = document.getElementById("tabelaPaciente");
            if (json.status) {
                divTabPaciente.innerHTML = "";
                let listaPacientes = json.listaPacientes;
                if (Array.isArray(listaPacientes)) {
                    if (listaPacientes.length > 0) {
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
                        <th>CPF</th>
                        <th>Sexo</th>
                    </tr>
                    `;
                        tabela.appendChild(cabecalho);
                        let corpo = document.createElement('tbody');
                        for (let i = 0; i < listaPacientes.length; i++) {
                            let linha = document.createElement('tr');
                            let paciente = listaPacientes[i];
                            linha.innerHTML = `
                        <td>${paciente.nome}</td>
                        <td>${paciente.cpf}</td>
                        <td>${paciente.sexo}</td>
                        <td>
                            <button class="" onclick="selecionarPaciente(${gerarParametrosPaciente(paciente)})">
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
                        divTabPaciente.appendChild(tabela);
                    }
                    else {
                        divTabPaciente.innerHTML = `<div> 
                                    Não existem pacientes com essa descrição
                                </div>`;
                    }
                }
            }
            else {
                divTabPaciente.innerHTML = "Não foi possível consultar os produtos";
            }
        })
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

function selecionarProduto(prod_ID, nome, psicotropico, valor_custo, 
    observacao, tipo, cod_unidade, desc_unidade) {
    document.getElementById('produto').value = prod_ID;
    document.getElementById('nomeProduto').value = nome;
    document.getElementById('qtde').focus();
    adicionarLote(prod_ID);
    resetaSelectUnidadeMedida();
    adicionarUnidadeMedida(cod_unidade, desc_unidade);
}

function gerarParametrosProduto(produto) {
    return `'${produto.prod_ID}','${produto.nome}',
    '${produto.psicotropico}','${produto.valor_custo}',
    '${produto.observacao}','${produto.tipo}', '${produto.unidade.un_cod}', '${produto.unidade.unidade}'`;
}

function adicionarUnidadeMedida(codUnidade, descUnidade){
    let selectUnidade= document.getElementById('unidadeMedida');
    let opt = document.createElement('option');
    opt.value= codUnidade;
    opt.text= descUnidade;
    selectUnidade.appendChild(opt);
}

function resetaSelectUnidadeMedida(){
    document.getElementById('unidadeMedida').innerHTML= '';
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
                    let objLote = new Lote(lote.codigo, formataData(lote.data_validade), lote.quantidade, lote.produto, 
                    lote.formaFarmaceutica, lote.conteudo_frasco, lote.unidade, lote.total_conteudo);
                    let optionLote = document.createElement("option");
                    adicionarUnidadeMedida(lote.unidade.un_cod, lote.unidade.unidade);
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

document.getElementById("lote").addEventListener("change", function () {
    let codLote = document.getElementById('lote').value;
    let codProd = document.getElementById('produto').value;
    let objLote = listaLotes.find(item => item.codigo == codLote && item.produto.prod_ID == codProd);
    document.getElementById('dataVencimento').value = formataData(objLote.data_validade);
    qtdeTotalLoteSelecionado = objLote.total_conteudo;
});


function selecionarPaciente(idPaciente, cpf, nome, raca, estado_civil, sexo, data_nascimento, endereco, bairro, telefone, profissao, cadastro, numero, complemento, cep, naturalidade, nome_pai, nome_responsavel, nome_mae, nome_social, utilizar_nome_social, religiao, orientacao_sexual) {
    document.getElementById('paciente').value = nome;
    pacConsumo = new Paciente(idPaciente, cpf, nome, raca, estado_civil, sexo, data_nascimento, endereco, bairro, telefone, profissao, cadastro, numero, complemento, cep, naturalidade, nome_pai, nome_responsavel, nome_mae, nome_social, utilizar_nome_social, religiao, orientacao_sexual);
}

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

function gerarParametrosPaciente(paciente) {
    return `'${paciente.idPaciente}','${paciente.cpf}','${paciente.nome}',
    '${paciente.raca}','${paciente.estado_civil}','${paciente.sexo}',
    '${formataData(paciente.data_nascimento)}','${paciente.endereco}','${paciente.bairro}',
    '${paciente.telefone}','${paciente.profissao}','${paciente.cadastro}',
    '${paciente.numero}','${paciente.complemento}','${paciente.cep}',
    '${paciente.naturalidade}','${paciente.nome_pai}','${paciente.nome_responsavel}',
    '${paciente.nome_mae}','${paciente.nome_social}','${paciente.utilizar_nome_social}',
    '${paciente.religiao}','${paciente.orientacao_sexual}'`;
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