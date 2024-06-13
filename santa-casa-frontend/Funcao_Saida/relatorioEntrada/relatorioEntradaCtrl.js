const urlBase = "http://localhost:4040"

        const butoes = {
            data() {
                return {
                    isListar: false,
                    isFuncionario: false,
                    isEntrada: false,
                    todasEntradas: [],
                    msm: ''
                }
            },
            methods: {
                exibir(aux) {
                    if (aux === 'Listar') {
                        this.isListar = true;
                        this.isFuncionario = false;
                        this.isEntrada = false;
                        this.msm = "RELATÓRIO DE ENTRADA"
                        this.gerarLista();
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
                },
                gerarLista() {
                    axios.get(urlBase + '/entrada').then((response) => {
                        this.todasEntradas = response.data.listaEntradas;
                        console.log(this.todasEntradas);
                    })
                },
                excluir(aux) {
                    axios.delete(urlBase + '/entrada/' + aux).then(
                        () => {
                            this.todasEntradas = [];
                            this.gerarLista();
                        }
                    )
                },
                formataData(dataParametro) {
                    let data = new Date(dataParametro);
                    let ano = data.getFullYear();
                    let mes = ('0' + (data.getMonth() + 1)).slice(-2);
                    let dia = ('0' + data.getDate()).slice(-2);
                    return `${ano}-${mes}-${dia}`;
                }
            },
            template: `
            <div class="div-opcoes-filtro">
                <button class="botoes-exibicao" @click="exibir('Listar')">Listar consumos</button>
                <button class="botoes-exibicao" @click="exibir('Funcionario')">Relatório Consumo por Paciente</button>
                <button class="botoes-exibicao" @click="exibir('Entrada')">Relatório Consumo de Produto</button>
            </div>
            <h1 id="titulo">{{msm}}</h1>
            <div>
                <table class="table table-striped table-hover" v-if="todasEntradas.length > 0">
                    <thead v-if="todasEntradas.length > 0">
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
                            <td><button @click="listarItens(c.itensEntrada)">+</button></td>
                            <td v-if="new Date() - new Date(c.data_entrada) <= 86400000"><button @click="excluir(c.entrada_id)">-</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            `
        }

        Vue.createApp(butoes).mount('#APP')