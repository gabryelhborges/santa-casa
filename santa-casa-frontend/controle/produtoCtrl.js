const urlBase = 'http://localhost:4040/produto';
const urlForn = 'http://localhost:4040/fornecedor';
var formProd = document.getElementById('formProduto');
formProd.reset();
formProd.onsubmit = validarFormulario;

inputFornecedoresNome();
exibirProdutos();
var acao = 'cadastrar';

function validarFormulario(evento) {
    if (formProd.checkValidity()) {
        let prod_ID = document.getElementById('prod_ID').value;
        let Fornecedor_idFornecedor = document.getElementById('Fornecedor_idFornecedor').value;
        let nome = document.getElementById('nome').value;
        let psicotropico = document.getElementById('psicotropico').value;
        let valor_custo = stringParaDecimal(document.getElementById('valor_custo').value);
        let ultima_compra = document.getElementById('ultima_compra').value;
        let ultima_saida = document.getElementById('ultima_saida').value;
        let observacao = document.getElementById('observacao').value;
        let descricao_uso = document.getElementById('descricao_uso').value;
        let quantidade_total = document.getElementById('quantidade_total').value;
        let tipo = document.getElementById('tipo').value;
        let produto = new Produto(prod_ID,Fornecedor_idFornecedor, nome, psicotropico, valor_custo, ultima_compra, ultima_saida,  observacao, descricao_uso, quantidade_total, tipo);
        
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
                let prod_ID = document.getElementById('prod_ID').value;
                let Fornecedor_idFornecedor = document.getElementById('Fornecedor_idFornecedor').value;
                let nome = document.getElementById('nome').value;
                let psicotropico = document.getElementById('psicotropico').value;
                let valor_custo = stringParaDecimal(document.getElementById('valor_custo').value);
                let ultima_compra = document.getElementById('ultima_compra').value;
                let ultima_saida = document.getElementById('ultima_saida').value;
                let observacao = document.getElementById('observacao').value;
                let descricao_uso = document.getElementById('descricao_uso').value;
                let quantidade_total = document.getElementById('quantidade_total').value;
                let tipo = document.getElementById('tipo').value;
                let produto = new Produto(prod_ID,Fornecedor_idFornecedor, nome, psicotropico, valor_custo, ultima_compra, ultima_saida, observacao, descricao_uso, quantidade_total, tipo);
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
                let prod_ID = document.getElementById('prod_ID').value;
                let produto = new Produto(prod_ID);
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

function inputFornecedoresNome(){
    fetch(urlForn,{
        method: 'GET',
        redirect: 'follow'
    })
        .then((resposta) => {
            return resposta.json();
        })
        .then((json) => {
            let select = document.getElementById('Fornecedor_idFornecedor');
            
            listaFor = json.listaFornecedor;
            if (Array.isArray(listaFor)) {
                if (listaFor.length > 0) {
                    for (let i = 0; i < listaFor.length; i++) {
                        let fornecedor = listaFor[i];
                        let option = document.createElement('option');
                        option.text = fornecedor.f_nome;
                        option.value = fornecedor.idFornecedor;
                        select.appendChild(option);
                    }
                }
                else {
                    select.innerHTML = `<option>Erro Fornecedores</option>`;
                }
            }
        })
        .catch((erro) => {
            exibirMensagem('Não foi possível recuperar os fornecedores do backend: ' + erro.message);
        });
}


// function listaNomeFor(){
    
// }

function exibirProdutos() {
    fetch(urlBase,{
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
                        <th>Código Produto</th>
                        <th>Produto</th>
                        <th>Fornecedor</th>
                        <th>Valor</th>
                    </tr>
                    `;
                    tabela.appendChild(cabecalho);
                    let corpo = document.createElement('tbody');
                    for (let i = 0; i < listaProdutos.length; i++) {
                        let linha = document.createElement('tr');
                        let produto = listaProdutos[i];
                        linha.innerHTML = `
                        <td>${produto.prod_ID}</td>
                        <td>${produto.nome}</td>
                        <td>${produto.Fornecedor_idFornecedor}</td>
                        <td>${produto.valor_custo}</td>
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
    return `'${produto.prod_ID}','${produto.Fornecedor_idFornecedor}','${produto.nome}',
    '${produto.psicotropico}','${produto.valor_custo}','${formataData(produto.ultima_compra)}',
    '${formataData(produto.ultima_saida)}','${produto.observacao}','${produto.descricao_uso}',
    '${produto.quantidade_total}','${produto.tipo}'`;
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

function selecionarProduto(prod_ID,Fornecedor_idFornecedor, nome, psicotropico, valor_custo, ultima_compra, ultima_saida,  observacao, descricao_uso, quantidade_total, tipo, modo) {
   
        document.getElementById('prod_ID').value = prod_ID;
        document.getElementById('Fornecedor_idFornecedor').value = Fornecedor_idFornecedor;
        document.getElementById('nome').value = nome;
        document.getElementById('psicotropico').value = psicotropico;
        document.getElementById('valor_custo').value = valor_custo;
        document.getElementById('ultima_compra').value = ultima_compra;
        document.getElementById('ultima_saida').value = ultima_saida;
        document.getElementById('observacao').value = observacao;
        document.getElementById('descricao_uso').value = descricao_uso;
        document.getElementById('quantidade_total').value = quantidade_total;
        document.getElementById('tipo').value = tipo;

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
    document.getElementById('prod_ID').value = '';
    document.getElementById('Fornecedor_idFornecedor').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('psicotropico').value = '';
    document.getElementById('valor_custo').value = '';
    document.getElementById('ultima_compra').value = '';
    document.getElementById('ultima_saida').value = '';
    document.getElementById('observacao').value = '';
    document.getElementById('descricao_uso').value = '';
    document.getElementById('quantidade_total').value = '';
    document.getElementById('tipo').value = '';

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

function stringParaDecimal(stringValor) {
    // Remove todos os caracteres que não são números ou pontos
    var valorLimpo = stringValor.replace(/[^\d.]/g, '');

    // Converte a string para um número decimal
    var numeroDecimal = parseFloat(valorLimpo);

    return numeroDecimal;
}