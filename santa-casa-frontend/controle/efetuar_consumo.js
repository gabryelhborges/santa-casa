const urlBase = 'http://localhost:4040';
var formConsumo = document.getElementById('formConsumo');
formConsumo.reset();
formConsumo.onsubmit = validarFormulario;
document.getElementById("funcionario").value = 1;//a partir do login, identificar funcionario
var listaItensConsumo = [];
var qtdeTotalLoteSelecionado= 0;
var listaLotes = [];
var pacConsumo;
var funcConsumo = new Funcionario(document.getElementById('funcionario').value);
exibirListaItensConsumo();

carregaPacientes();
carregaProdutos();

function limpaPaciente() {
    pacConsumo = null;
    document.getElementById('paciente').value = '';
}

function validarFormulario(evento) {
    let pac= document.getElementById("paciente").value;
    if (formConsumo.checkValidity() && listaItensConsumo.length && pac) {
        let dataAtual = new Date();
        dataAtual.setHours(dataAtual.getHours() - 3);
        // Formata a data para o formato compatível com o MySQL
        let dataFormatada = dataAtual.toISOString().slice(0, 19).replace('T', ' ');
        const cons = new Consumo(0, pacConsumo, funcConsumo, listaItensConsumo, dataFormatada);
        fetch(urlBase + '/consumo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cons)
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
                    alert(dados.mensagem);
                }
                else {
                    alert(dados.mensagem);
                }
            })
            .catch((erro) => {
                alert("Não foi posssivel completar a operação: " + erro.message);
            })
    }
    else {
        alert('É necessário informar o paciente e registrar os itens que foram consumidos para realizar a confirmação!');
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
    if (objLote && objProd && qtde > 0 && qtde < qtdeTotalLoteSelecionado) {
        let itemExistente = listaItensConsumo.find(item => item.lote.codigo === objLote.codigo && item.produto.prod_ID === objProd.prod_ID);
        // Verifica se já existe um item com o mesmo produto e lote
        if (itemExistente) {
            // Se existir, apenas aumenta a quantidade
            let num = parseInt(itemExistente.qtdeConteudoUtilizado);
            num += parseInt(qtde);
            itemExistente.qtdeConteudoUtilizado = parseInt(num);
        }
        else {
            // Se não existir, cria um novo item
            let itCons = new ItensConsumo(null, objLote, objProd, qtde);
            listaItensConsumo.push(itCons);
        }
    }
    else {
        alert('Informe todos os dados para consumir um item. Selecione um produto, lote e informe a quantidade utilizada. A lista de itens consumidos não pode estar vazia e o consumo a ser feito não pode ser maior que o disponível!')
    }
    limparFormItemConsumo();
    exibirListaItensConsumo();
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
}

function exibirListaItensConsumo() {
    let divItensCons = document.getElementById("tabelaItensConsumo");
    divItensCons.innerHTML = '';
    if (listaItensConsumo.length) {
        let tabela = document.createElement('table');
        tabela.style.borderCollapse = 'collapse';
        tabela.style.width = '95%';
        tabela.style.borderBottom = '1px solid';
        //tabela.style.maxHeight= '100px';
        //tabela.className = 'table table-striped table-hover';
        let cabecalho = document.createElement('thead');
        cabecalho.style.borderBottom = '1px solid';
        cabecalho.innerHTML = `
                    <tr'>
                        <th>Lote</th>
                        <th>Produto</th>
                        <th>Qtde</th>
                    </tr>
                    `;
        tabela.appendChild(cabecalho);
        let corpo = document.createElement('tbody');
        for (let i = 0; i < listaItensConsumo.length; i++) {
            let linha = document.createElement('tr');
            let itCons = listaItensConsumo[i];
            linha.innerHTML = `
                        <td>${itCons.lote.codigo}</td>
                        <td>${itCons.produto.prod_ID}</td>
                        <td>${itCons.qtdeConteudoUtilizado}</td>
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
                listaPacientes = json.listaPacientes;
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
                        <td>${produto.Fabricante_idFabricante}</td>
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

function selecionarProduto(prod_ID, Fabricante_idFabricante, nome, psicotropico, valor_custo, far_cod, ffa_cod, uni_cod, observacao, descricao_uso, tipo) {
    document.getElementById('produto').value = prod_ID;
    document.getElementById('nomeProduto').value = nome;
    document.getElementById('qtde').focus();
    adicionarLote(prod_ID);
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
            selectLote.innerHTML= "";
            selectLote.value= "";
            selectLote.text= "";
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
                        qtdeTotalLoteSelecionado= objLote.total_conteudo;
                        document.getElementById("dataVencimento").value = formataData(objLote.data_validade);
                    }
                };
            }
        });
}

document.getElementById("lote").addEventListener("change", function () {
    let codLote = document.getElementById('lote').value;
    let codProd = document.getElementById('produto').value;
    let objLote = listaLotes.find(item => item.codigo === codLote && item.produto.prod_ID == codProd);
    document.getElementById('dataVencimento').value = formataData(objLote.data_validade);
    qtdeTotalLoteSelecionado= objLote.total_conteudo;
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

function gerarParametrosProduto(produto) {
    return `'${produto.prod_ID}','${produto.Fabricante_idFabricante}','${produto.nome}',
    '${produto.psicotropico}','${produto.valor_custo}','${produto.far_cod}',
    '${produto.observacao}','${produto.tipo}'`;
}