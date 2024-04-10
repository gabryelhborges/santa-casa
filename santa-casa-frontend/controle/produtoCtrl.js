const urlBase = 'http://localhost:4040/produto';

var formProd = document.getElementById('formProduto');
formProd.reset();
formProd.onsubmit = validarFormulario;

exibirProdutos();
var acao = 'cadastrar';

function validarFormulario(evento) {
    if (formProd.checkValidity()) {
        let iCodBarras = document.getElementById('iCodProd').value;
        let iCodFornecedor = document.getElementById('iCodFornecedor').value;
        let iNomeProd = document.getElementById('iNomeProd').value;
        let iQtdTotal = document.getElementById('iQtdTotal').value;
        let sTipoProd = document.getElementById('sTipoProd').value;
        let iValorCusto = document.getElementById('iValorCusto').value;
        let dUltimaCompra = document.getElementById('dUltimaCompra').value;
        let dUltimaSaida = document.getElementById('dUltimaSaida').value;
        let tDesc = document.getElementById('tDesc').value;
        let tObs = document.getElementById('tObs').value;
        let iPsico = document.getElementById('iPsico').value;
        let produto = new Produto(iCodBarras,iCodFornecedor, iNomeProd, iQtdTotal, sTipoProd, iValorCusto, dUltimaCompra, dUltimaSaida, tDesc, tObs, cadastro, iPsico);
        
        if (acao === 'cadastrar') {
            fetch(urlBase, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            })
                .then((resposta) => {
                    return resposta.json();
                })
                .then((dados) => {
                    if (dados.status) {
                        limparFormulario();
                        exibirMensagem(dados.mensagem);
                        exibirProdutos();
                    }
                    else {
                        exibirMensagem(dados.mensagem);
                    }
                })
                .catch((erro) => {
                    exibirMensagem('Problema ao executar operação: ' + erro.message);
                });
        }
        else if (acao === 'alterar') {
            if (confirm('Deseja realmente alterar esse produto?')) {
                let iCodBarras = document.getElementById('iCodProd').value;
                let iCodFornecedor = document.getElementById('iCodFornecedor').value;
                let iNomeProd = document.getElementById('iNomeProd').value;
                let iQtdTotal = document.getElementById('iQtdTotal').value;
                let sTipoProd = document.getElementById('sTipoProd').value;
                let iValorCusto = document.getElementById('iValorCusto').value;
                let dUltimaCompra = document.getElementById('dUltimaCompra').value;
                let dUltimaSaida = document.getElementById('dUltimaSaida').value;
                let tDesc = document.getElementById('tDesc').value;
                let tObs = document.getElementById('tObs').value;
                let iPsico = document.getElementById('iPsico').value;
                let produto = new Produto(iCodBarras,iCodFornecedor, iNomeProd, iQtdTotal, sTipoProd, iValorCusto, dUltimaCompra, dUltimaSaida, tDesc, tObs, cadastro, iPsico);
                fetch(urlBase, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(produto)
                })
                    .then((resposta) => {
                        return resposta.json();
                    })
                    .then((dados) => {
                        if (dados.mensagem) {
                            limparFormulario();
                            exibirMensagem(dados.mensagem);
                            exibirProdutos();
                        }
                        else {
                            exibirMensagem(dados.mensagem);
                        }
                    })
                    .catch((erro) => {
                        exibirMensagem('Não foi possível realizar a operação: ' + erro.message);
                    });
            }
        }
        else if (acao === 'excluir') {
            if (confirm('Deseja realmente excluir esse produto?')) {
                let iCodBarras = document.getElementById('iCodProd').value;
                let produto = new Produto(iCodBarras);
                fetch(urlBase, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(produto)
                })
                    .then((resposta) => {
                        return resposta.json();
                    })
                    .then((dados) => {
                        limparFormulario();
                        exibirMensagem(dados.mensagem);
                        exibirProdutos();
                    })
                    .catch((erro) => {
                        exibirMensagem('Erro ao tentar excluir o produto: ' + erro.message);
                    });
            }
        }
    }
    else {
        formProd.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function exibirProdutos() {
    fetch(urlBase, {
        method: 'GET',
        redirect: 'follow'
    })
        .then((resposta) => {
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
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                    </tr>
                    `;
                    tabela.appendChild(cabecalho);
                    let corpo = document.createElement('tbody');
                    for (let i = 0; i < listaProdutos.length; i++) {
                        let linha = document.createElement('tr');
                        let produto = listaProdutos[i];
                        linha.innerHTML = `
                        <td>${produto.iCodBarras}</td>
                        <td>${produto.iNomeProd}</td>
                        <td>${produto.tDesc}</td>
                        <td>${produto.iValorCusto}</td>
                        <td>
                            <button class="btn btn-danger" onclick="selecionarProduto(${gerarParametrosProduto(produto)},'excluir')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                                </svg>
                            </button>
                            <button class="btn btn-warning" onclick="selecionarProduto(${gerarParametrosProduto(produto)},'alterar')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                </svg>
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
            exibirMensagem('Não foi possível recuperar os Produtos do backend: ' + erro.message);
        });
}

function gerarParametrosProduto(produto) {
    return `'${produto.iCodBarras}','${produto.iCodFornecedor}','${produto.iNomeProd}',
    '${produto.iQtdTotal}','${produto.sTipoProd}','${produto.iValorCusto}',
    '${produto.dUltimaCompra}','${produto.dUltimaSaida}','${produto.tDesc}',
    '${produto.tObs}','${produto.iPsico}'`;
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

function selecionarProduto(iCodBarras,iCodFornecedor, iNomeProd, iQtdTotal, sTipoProd, iValorCusto, dUltimaCompra, dUltimaSaida, tDesc, tObs, cadastro, iPsico) {
   
        document.getElementById('iCodBarras').value = iCodBarras;
        document.getElementById('iCodFornecedor').value = iCodFornecedor;
        document.getElementById('iNomeProd').value = iNomeProd;
        document.getElementById('iQtdTotal').value = iQtdTotal;
        document.getElementById('sTipoProd').value = sTipoProd;
        document.getElementById('iValorCusto').value = iValorCusto;
        document.getElementById('dUltimaCompra').value = dUltimaCompra;
        document.getElementById('dUltimaSaida').value = dUltimaSaida;
        document.getElementById('tDesc').value = tDesc;
        document.getElementById('tObs').value = tObs;
        document.getElementById('iPsico').value = iPsico;

    let bttForm = document.getElementById('bttForm');
    if (modo == 'alterar') {
        acao = 'alterar';
        bttForm.innerHTML = 'Alterar';
    }
    else if (modo == 'excluir') {
        acao = 'excluir';
        bttForm.innerHTML = 'Excluir';
    }
}

function limparFormulario() {
    document.getElementById('iCodBarras').value = '';
    document.getElementById('iCodFornecedor').value = '';
    document.getElementById('iNomeProd').value = '';
    document.getElementById('iQtdTotal').value = '';
    document.getElementById('sTipoProd').value = '';
    document.getElementById('iValorCusto').value = '';
    document.getElementById('dUltimaCompra').value = '';
    document.getElementById('dUltimaSaida').value = '';
    document.getElementById('tDesc').value = '';
    document.getElementById('tObs').value = '';
    document.getElementById('iPsico').value = '';

    acao = "cadastrar";
    let bttForm = document.getElementById('bttForm');
    bttForm.innerHTML = "Cadastrar";
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