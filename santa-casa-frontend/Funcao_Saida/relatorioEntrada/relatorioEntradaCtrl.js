const urlBase = "http://localhost:4040"
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

        const butoes = {
            data() {
                return {
                    isListar: false,
                    isFuncionario: false,
                    isEntrada: false,
                    todasEntradas: [],
                    msm: '', 
                    filtro: '',
                    funcionarios: [],
                    totalEntradasFun: 0,
                    dadosFuncionarios: {},
                    totaisEntradas: {},
                    inicio: '2023-01-01',
                    fim: formataData(new Date()),
                    produtos: [],
                    entradas: []
                }
            },
            methods: {
                async extencao() {
                    try {
                        const response = await axios.get(urlBase + "/funcionario/" + this.filtro);
                        this.funcionarios = [];
                
                        for (let i = 0; i < response.data.listaFuncionarios.length; i++) {
                            let fun = response.data.listaFuncionarios[i];
                            if (fun.farmaceutico=='S' ) {
                                fun.total = await this.totalEntradas(fun.idFuncionario);
                                fun.totalItens = await this.totalItensEntradas(fun.idFuncionario);
                                fun.ultimaEntrada = await this.ultimaEntrada(fun.idFuncionario);
                                fun.lotesCriados = await this.lotesCriados(fun.idFuncionario);
                                this.funcionarios.push(fun);
                                console.log(fun.lotesCriados);
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                },
                async gerarLista() {
                    if (this.isListar) {
                        try {
                            const response = await axios.get(urlBase + "/entrada/" + this.filtro);
                            this.todasEntradas = response.data.listaEntradas;
                        } catch (error) {
                            console.error(error);
                        }
                    } else if (this.isFuncionario) {
                        await this.extencao();
                        console.log(this.funcionarios);
                    }else if (this.isEntrada) {
                        try {
                            const response = await axios.get(urlBase + "/produto");
                            this.produtos = [];
                
                            for (let i = 0; i < response.data.listaProdutos.length; i++) {
                                let aux = response.data.listaProdutos[i];
                
                                // Utilize template literals (`) para concatenar strings e variáveis de forma mais limpa
                                const responseLote = await axios.get(`${urlBase}/lote?produto=${aux.prod_ID}`);
                                
                                if (responseLote.data.listaLotes.length > 0) {
                                    let lotes = responseLote.data.listaLotes;
                
                                    for (let j = 0; j < lotes.length; j++) {
                                        const lote = lotes[j];
                                        const responseItens = await axios.get(`${urlBase}/entrada/itens/?prod=${aux.prod_ID}&lote=${lote.codigo}`);
                                        
                                        if (responseItens.data.listaEntradas) {
                                            lote.itens = responseItens.data.listaEntradas;
                                        }
                                    }
                
                                    aux.lotes = lotes; // Atualiza os lotes com os itens correspondentes
                                    this.produtos.push(aux);  // Adiciona o produto ao array this.produtos
                                }
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    }
                },
                exibir(aux) {
                    this.filtro = '';
                    if (aux === 'Listar') {
                        this.isListar = true;
                        this.isFuncionario = false;
                        this.isEntrada = false;
                        this.msm = "RELATÓRIO DE ENTRADA";
                    } else if (aux === 'Funcionario') {
                        this.isListar = false;
                        this.isFuncionario = true;
                        this.isEntrada = false;
                        this.msm = "RELATÓRIO DE FUNCIONÁRIO"
                    } else {
                        this.isListar = false;
                        this.isFuncionario = false;
                        this.isEntrada = true;
                        this.msm = "RELATÓRIO DE ENTRADA POR PRODUTO"
                    }
                    this.gerarLista();
                },
                exibirItensEntradasModal(listaEntradas) {
                    let conteudoModal = document.getElementById("modalContent");
                    
                    // Resetar o conteúdo do modal
                    conteudoModal.innerHTML = '';
                    let spanFechar = document.createElement('span');
                    spanFechar.className = 'close';
                    spanFechar.innerHTML = '&times;';
                    spanFechar.onclick = this.fecharModal;  // Vincular a função de fechamento do modal
                    conteudoModal.appendChild(spanFechar);
                    
                    let container = document.createElement('div');
                    container.className = 'divTabela';
                    
                    let tabela = document.createElement('table');
                    tabela.id = 'tabela-primaria';  // Mudança para evitar ID duplicado
                    
                    let cabecalho = document.createElement('thead');
                    cabecalho.innerHTML = `
                        <tr>
                            <th>Produto</th>
                            <th>Lote</th>
                            <th>Quantidade Adicionada</th>
                        </tr>
                    `;
                    cabecalho.className = 'cabecalhoItCons';
                    tabela.appendChild(cabecalho);
                    
                    let corpo = document.createElement('tbody');
                    for (let i = 0; i < listaEntradas.length; i++) {
                        let linha = document.createElement('tr');
                        let itens = listaEntradas[i];
                        linha.innerHTML = `
                            <td>${itens.produto.nome}</td>
                            <td>${itens.lote.codigo}</td>
                            <td>${itens.quantidade * itens.lote.conteudo_frasco} ${itens.produto.unidade.unidade}</td>
                        `;
                        linha.style.border = '1px solid';
                        linha.className = 'linhaItCons';
                        corpo.appendChild(linha);
                    }
                    tabela.appendChild(corpo);
                    container.appendChild(tabela);
                    conteudoModal.appendChild(container);
                    
                    // Exibir o modal
                    let modal = document.getElementById('myModal');
                    modal.style.display = 'block';
                },
                fecharModal() {
                    document.getElementById('myModal').style.display = 'none';
                },
                excluir(aux) {
                    axios.delete(urlBase + '/entrada/' + aux)
                    .then((response) => {
                        if (response.status === 200) {
                            // Sucesso na exclusão
                            this.todasEntradas = [];
                            this.gerarLista();
                        } else {
                            // Algum outro status que não seja sucesso
                            console.error('Erro ao excluir a entrada:', response.data);
                        }
                    })
                    .catch((error) => {
                        // Tratamento de erro
                        console.error('Erro ao excluir a entrada:', error);
                    });
                },
                formataData(dataParametro) {
                    let data = new Date(dataParametro);
                    let ano = data.getFullYear();
                    let mes = ('0' + (data.getMonth() + 1)).slice(-2);
                    let dia = ('0' + data.getDate()).slice(-2);
                    return `${ano}-${mes}-${dia}`;
                },
                async totalEntradas(idFuncionario) {
                    try {
                        const response = await axios.get(`${urlBase}/entrada/total/?id=${idFuncionario}&inicio=${this.inicio}&fim=${this.fim}`);
                        return response.data.Total;
                    } catch (error) {
                        console.error(error);
                        return 0; // ou algum valor padrão em caso de erro
                    }
                },
                async totalItensEntradas(idFuncionario) {
                    try {
                        const response = await axios.get(`${urlBase}/entrada/totalitens/?id=${idFuncionario}&inicio=${this.inicio}&fim=${this.fim}`);
                        return response.data.Total;
                    } catch (error) {
                        console.error(error);
                        return 0; // ou algum valor padrão em caso de erro
                    }
                },
                async ultimaEntrada(idFuncionario) {
                    try {
                        const response = await axios.get(`${urlBase}/entrada/ultima/?id=${idFuncionario}&inicio=${this.inicio}&fim=${this.fim}`);
                        return response.data.entrada;
                    } catch (error) {
                        console.error(error);
                        return 0; // ou algum valor padrão em caso de erro
                    }
                },
                async lotesCriados(idFuncionario) {
                    try {
                        const response = await axios.get(`${urlBase}/entrada/novo/?id=${idFuncionario}&inicio=${this.inicio}&fim=${this.fim}`);
                        return response.data.entrada;
                    } catch (error) {
                        console.error(error);
                        return 0; // ou algum valor padrão em caso de erro
                    }
                },
                printPage() {
                    // Abre todos os itens antes de imprimir
                    const baixaItems = document.querySelectorAll('.baixa-items');
                    baixaItems.forEach(item => {
                        item.style.display = 'block';
                    });
                    
                    window.print();
                },
                
            },
            
            template: `
            <div class="div-opcoes-filtro">
                <button class="botoes-exibicao" @click="exibir('Listar')">Listar entradas</button>
                <button class="botoes-exibicao" @click="exibir('Funcionario')">Relatório Entrada por Funcionario</button>
                <button class="botoes-exibicao" @click="exibir('Entrada')">Relatório Entrada de Produto</button>
                <button class="botoes-exibicao" style="background-color: blue;" @click="printPage()">Imprimir</button>
            </div>
            
            <div class="info-container" id="div-pesquisa-relatorio-consumo">
                <input v-model="filtro" @change="gerarLista()" id="pesquisaConsumo" type="text" placeholder="Entrada">
                <div v-if="!isListar">
                    <label for="inputDataInicio">Início:</label>
                    <input @change="gerarLista()" v-model="inicio" class="input-periodo" type="date" id="inputDataInicio">

                    <label for="inputDataFim">Fim:</label>
                    <input @change="gerarLista()" v-model="fim" class="input-periodo" type="date" id="inputDataFim">
                </div>
                
            </div>

            <h1 id="titulo">{{msm}}</h1>

            <div id="div-tabela-principal">
                <div v-show="isListar" id="divContainer">
                    <table id = "tabela-primaria" v-if="todasEntradas.length > 0">
                        <thead id="cabecalho-primario" v-if="todasEntradas.length > 0">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nome Funcionario</th>
                                <th scope="col">CPF DO Funcionario</th>
                                <th scope="col">Data Entrada</th>
                                <th scope="col">Itens Entrada</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="c in todasEntradas" :key="c.entrada_id">
                                <td>{{c.entrada_id}}</td>
                                <td>{{c.funcionario.nome_funcionario}}</td>
                                <td>{{c.funcionario.cpf}}</td>
                                <td>{{formataData(c.data_entrada)}}</td>
                                <td><button @click="exibirItensEntradasModal(c.itensEntrada)">
                                    <svg  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 50 50">
                                        <path d="M 3 9 A 1.0001 1.0001 0 1 0 3 11 L 47 11 A 1.0001 1.0001 0 1 0 47 9 L 3 9 z M 3 24 A 1.0001 1.0001 0 1 0 3 26 L 47 26 A 1.0001 1.0001 0 1 0 47 24 L 3 24 z M 3 39 A 1.0001 1.0001 0 1 0 3 41 L 47 41 A 1.0001 1.0001 0 1 0 47 39 L 3 39 z"></path>
                                    </svg>
                                </button></td>
                                <td v-if="new Date() - new Date(c.data_entrada) <= 86400000"><button @click="excluir(c.entrada_id)">
                                    <svg  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 64 64">
                                        <path d="M 28 11 C 26.895 11 26 11.895 26 13 L 26 14 L 13 14 C 11.896 14 11 14.896 11 16 C 11 17.104 11.896 18 13 18 L 14.160156 18 L 16.701172 48.498047 C 16.957172 51.583047 19.585641 54 22.681641 54 L 41.318359 54 C 44.414359 54 47.041828 51.583047 47.298828 48.498047 L 49.839844 18 L 51 18 C 52.104 18 53 17.104 53 16 C 53 14.896 52.104 14 51 14 L 38 14 L 38 13 C 38 11.895 37.105 11 36 11 L 28 11 z M 18.173828 18 L 45.828125 18 L 43.3125 48.166016 C 43.2265 49.194016 42.352313 50 41.320312 50 L 22.681641 50 C 21.648641 50 20.7725 49.194016 20.6875 48.166016 L 18.173828 18 z"></path>
                                    </svg>
                                    </button>
                                </td>
                                <td v-if="!(new Date() - new Date(c.data_entrada) <= 86400000)">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-show="isFuncionario" id="divRelFun">
                    <div v-for="f in funcionarios" :key="f.idFuncionario">
                        <div >
                            <h2>Nome Funcionario: {{f.nome_funcionario}}</h2>
                            <div>
                                <h4>Total de entradas: {{f.total}}</h4>
                                <h4>Total de itens de entradas: {{f.totalItens}}</h4>
                                <br>
                                <h4>Lotes cadastrados</h4>
                                <div class="divTabela">
                                        <table id = 'tabela-primaria'>
                                            <thead>
                                            <tr class='cabecalhoItCons'>
                                                <th colspan="2">Lotes criados</th>
                                            </tr>
                                            <tr class='cabecalhoItCons'>
                                                <th>Produto</th>
                                                <th>Lote</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            <tr v-for="itens in f.lotesCriados" class='linhaItCons'>
                                                <td>{{itens.produto.nome}}</td>
                                                <td>{{itens.codigo}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <br>
                                <h4>Ultima entrada feita ({{formataData(f.ultimaEntrada.data_entrada)}})</h4>
                                <div class="divTabela">
                                        <table id = 'tabela-primaria'>
                                            <thead>
                                            <tr class='cabecalhoItCons'>
                                                <th colspan="3">Itens Produtos</th>
                                            </tr>
                                            <tr class='cabecalhoItCons'>
                                                <th>Produto</th>
                                                <th>Lote</th>
                                                <th>Quantidade Adicionada</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            <tr v-for="itens in f.ultimaEntrada.itensEntrada" class='linhaItCons'>
                                            <td>{{itens.produto.nome}}</td>
                                            <td>{{itens.lote.codigo}}</td>
                                            <td>{{itens.quantidade * itens.lote.conteudo_frasco}} {{itens.produto.unidade.unidade}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                    <div v-show="isEntrada">
                            <div class="divTabela">
                            <table id = 'tabela-primaria'>
                                <thead>
                                <tr class='cabecalhoItCons'>
                                    <th colspan="3">Itens Produtos</th>
                                </tr>
                                <tr class='cabecalhoItCons'>
                                    <th>Produto</th>
                                    <th>Lote</th>
                                </tr>
                            </thead>
                            <tbody >
                                <tr v-for="p in produtos" class='linhaItCons'>
                                    <td>{{p.nome}}</td>
                                    <td>
                                        <div v-show="isEntrada">
                                                <div class="divTabela">
                                                <table id = 'tabela-primaria'>
                                                    <tr class='cabecalhoItCons'>
                                                        <th>Codigo</th>
                                                        <th>Total</th>
                                                        <th>Data de Entrada</th>
                                                        <th>Data de Validade</th>
                                                        <th>Entrada</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    <tr v-for="l in p.lotes" class='linhaItCons'>
                                                        <td>{{l.codigo}}</td>
                                                        <td>{{l.total_conteudo}}</td>
                                                        <td>{{formataData(l.data_entrada)}}</td>
                                                        <td>{{formataData(l.data_validade)}}</td>
                                                        <td>
                                                            <table id = 'tabela-primaria'>
                                                                    <thead>
                                                                    <tr class='cabecalhoItCons'>
                                                                        <th colspan="3">Entada</th>
                                                                    </tr>
                                                                    <tr class='cabecalhoItCons'>
                                                                        <th>Funcionario</th>
                                                                        <th>Data de Entrada de Lore</th>
                                                                        <th>Quantidade Adicionada</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="itens in l.itens" class='linhaItCons'>
                                                                        <td>{{itens.entrada.funcionario.nome_funcionario}}</td>
                                                                        <td>{{formataData(itens.entrada.data_entrada)}}</td>
                                                                        <td>{{itens.quantidade * itens.lote.conteudo_frasco}} {{itens.produto.unidade.unidade}}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        
            <div id="myModal" class="modal">
                <div id="modalContent" class="modal-content">
                </div>
            </div>
            `
        }

        Vue.createApp(butoes).mount('#APP')