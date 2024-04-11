const urlBase = 'http://localhost:4040/paciente';

var formPac = document.getElementById('formPaciente');
formPac.reset();
formPac.onsubmit = validarFormulario;

exibirPacientes();
var acao = 'cadastrar';

function validarFormulario(evento) {
    if (formPac.checkValidity()) {
        let cpf = document.getElementById('cpf').value;
        let nome = document.getElementById('nome').value;
        let raca = document.getElementById('raca').value;
        let estado_civil = document.getElementById('estado_civil').value;
        let sexo = document.getElementById('sexo').value;
        let data_nascimento = document.getElementById('data_nascimento').value;
        let endereco = document.getElementById('endereco').value;
        let bairro = document.getElementById('bairro').value;
        let telefone = document.getElementById('telefone').value;
        let profissao = document.getElementById('profissao').value;
        let cadastro = dataAtualFormatada();
        let numero = document.getElementById('numero').value;
        let complemento = document.getElementById('complemento').value;
        let cep = document.getElementById('cep').value;
        let naturalidade = document.getElementById('naturalidade').value;
        let nome_pai = document.getElementById('nome_pai').value;
        let nome_responsavel = document.getElementById('nome_responsavel').value;
        let nome_mae = document.getElementById('nome_mae').value;
        let nome_social = document.getElementById('nome_social').value;
        let utilizar_nome_social = document.getElementById('utilizar_nome_social').value;
        let religiao = document.getElementById('religiao').value;
        let orientacao_sexual = document.getElementById('orientacao_sexual').value;
        let pac = new Paciente(0, cpf, nome, raca, estado_civil, sexo, data_nascimento, endereco, bairro, telefone, profissao, cadastro, numero, complemento, cep, naturalidade, nome_pai, nome_responsavel, nome_mae, nome_social, utilizar_nome_social, religiao, orientacao_sexual);
        
        if (acao === 'cadastrar') {
            fetch(urlBase, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pac)
            })
                .then((resposta) => {
                    return resposta.json();
                })
                .then((dados) => {
                    if (dados.status) {
                        limparFormulario();
                        exibirMensagem(dados.mensagem);
                        exibirPacientes();
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
            if (confirm('Deseja realmente alterar esse paciente?')) {
                let idPaciente = document.getElementById('idPaciente').value;
                let cpf = document.getElementById('cpf').value;
                let nome = document.getElementById('nome').value;
                let raca = document.getElementById('raca').value;
                let estado_civil = document.getElementById('estado_civil').value;
                let sexo = document.getElementById('sexo').value;
                let data_nascimento = document.getElementById('data_nascimento').value;
                let endereco = document.getElementById('endereco').value;
                let bairro = document.getElementById('bairro').value;
                let telefone = document.getElementById('telefone').value;
                let profissao = document.getElementById('profissao').value;
                let cadastro = dataAtualFormatada();
                let numero = document.getElementById('numero').value;
                let complemento = document.getElementById('complemento').value;
                let cep = document.getElementById('cep').value;
                let naturalidade = document.getElementById('naturalidade').value;
                let nome_pai = document.getElementById('nome_pai').value;
                let nome_responsavel = document.getElementById('nome_responsavel').value;
                let nome_mae = document.getElementById('nome_mae').value;
                let nome_social = document.getElementById('nome_social').value;
                let utilizar_nome_social = document.getElementById('utilizar_nome_social').value;
                let religiao = document.getElementById('religiao').value;
                let orientacao_sexual = document.getElementById('orientacao_sexual').value;
                let pac = new Paciente(idPaciente, cpf, nome, raca, estado_civil, sexo, data_nascimento, endereco, bairro, telefone, profissao, cadastro, numero, complemento, cep, naturalidade, nome_pai, nome_responsavel, nome_mae, nome_social, utilizar_nome_social, religiao, orientacao_sexual);
                fetch(urlBase, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pac)
                })
                    .then((resposta) => {
                        return resposta.json();
                    })
                    .then((dados) => {
                        if (dados.mensagem) {
                            limparFormulario();
                            exibirMensagem(dados.mensagem);
                            exibirPacientes();
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
            if (confirm('Deseja realmente excluir esse paciente?')) {
                const idPaciente = document.getElementById('idPaciente').value;
                let pac = new Paciente(idPaciente);
                fetch(urlBase, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pac)
                })
                    .then((resposta) => {
                        return resposta.json();
                    })
                    .then((dados) => {
                        limparFormulario();
                        exibirMensagem(dados.mensagem);
                        exibirPacientes();
                    })
                    .catch((erro) => {
                        exibirMensagem('Erro ao tentar excluir o paciente: ' + erro.message);
                    });
            }
        }
    }
    else {
        formPac.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function exibirPacientes() {
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
            listaPacientes = json.listaPacientes;
            if (Array.isArray(listaPacientes)) {
                if (listaPacientes.length > 0) {
                    let tabela = document.createElement('table');
                    tabela.className = 'table table-striped table-hover';
                    let cabecalho = document.createElement('thead');
                    cabecalho.innerHTML = `
                    <tr>
                        <th>idPaciente</th>
                        <th>CPF</th>
                        <th>Nome</th>
                        <th>Data Nascimento</th>
                        <th>Raça</th>
                        <th>Estado Civil</th>
                        <th>Sexo</th>
                    </tr>
                    `;
                    tabela.appendChild(cabecalho);
                    let corpo = document.createElement('tbody');
                    for (let i = 0; i < listaPacientes.length; i++) {
                        let linha = document.createElement('tr');
                        let paciente = listaPacientes[i];
                        linha.innerHTML = `
                        <td>${paciente.idPaciente}</td>
                        <td>${paciente.cpf}</td>
                        <td>${paciente.nome}</td>
                        <td>${formataData(paciente.data_nascimento)}</td>
                        <td>${paciente.raca}</td>
                        <td>${paciente.estado_civil}</td>
                        <td>${paciente.sexo}</td>
                        <td>
                            <button class="btn btn-danger" onclick="selecionarPaciente(${gerarParametrosPaciente(paciente)},'excluir')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                                </svg>
                            </button>
                            <button class="btn btn-warning" onclick="selecionarPaciente(${gerarParametrosPaciente(paciente)},'alterar')">
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
                                    Não existem pacientes cadastrados
                                </div>`;
                }
            }
        })
        .catch((erro) => {
            exibirMensagem('Não foi possível recuperar os pacientes do backend: ' + erro.message);
        });
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

function selecionarPaciente(idPaciente, cpf, nome, raca, estado_civil, sexo, data_nascimento, endereco, bairro, telefone, profissao, cadastro, numero, complemento, cep, naturalidade, nome_pai, nome_responsavel, nome_mae, nome_social, utilizar_nome_social, religiao, orientacao_sexual, modo) {
    document.getElementById('idPaciente').value = idPaciente;
    document.getElementById('cpf').value = cpf;
    document.getElementById('nome').value = nome;
    document.getElementById('raca').value = raca;
    document.getElementById('estado_civil').value = estado_civil;
    document.getElementById('sexo').value = sexo;
    document.getElementById('data_nascimento').value = formataData(data_nascimento);

    //Variáveis que podem ser null, devem ser tratadas(if ternário)  ---->   variavel == "null" ? [verdade] : [falso]
    document.getElementById('endereco').value = endereco == "null" ? "" : endereco;
    document.getElementById('bairro').value = bairro == "null" ? "" : bairro;
    document.getElementById('telefone').value = telefone == "null" ? "" : telefone;
    document.getElementById('profissao').value = profissao == "null" ? "" : profissao;
    document.getElementById('numero').value = numero == "null" ? "" : numero;
    document.getElementById('complemento').value = complemento == "null" ? "" : complemento;
    document.getElementById('cep').value = "null" ? "" : cep == "null" ? "" : cep;
    document.getElementById('naturalidade').value = naturalidade == "null" ? "" : naturalidade;
    document.getElementById('nome_pai').value = nome_pai == "null" ? "" : nome_pai;
    document.getElementById('nome_responsavel').value = nome_responsavel == "null" ? "" : nome_responsavel;
    document.getElementById('nome_mae').value = nome_mae == "null" ? "" : nome_mae;
    document.getElementById('nome_social').value = nome_social == "null" ? "" : nome_social;
    document.getElementById('utilizar_nome_social').value = utilizar_nome_social == "null" ? "" : utilizar_nome_social;
    document.getElementById('religiao').value = religiao == "null" ? "" : religiao;
    document.getElementById('orientacao_sexual').value = orientacao_sexual == "null" ? "" : orientacao_sexual;

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
    document.getElementById('cpf').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('raca').value = '';
    document.getElementById('estado_civil').value = '';
    document.getElementById('sexo').value = '';
    document.getElementById('data_nascimento').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('profissao').value = '';
    //document.getElementById('cadastro').value = '';
    document.getElementById('numero').value = '';
    document.getElementById('complemento').value = '';
    document.getElementById('cep').value = '';
    document.getElementById('naturalidade').value = '';
    document.getElementById('nome_pai').value = '';
    document.getElementById('nome_responsavel').value = '';
    document.getElementById('nome_mae').value = '';
    document.getElementById('nome_social').value = '';
    document.getElementById('utilizar_nome_social').value = '';
    document.getElementById('religiao').value = '';
    document.getElementById('orientacao_sexual').value = '';

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