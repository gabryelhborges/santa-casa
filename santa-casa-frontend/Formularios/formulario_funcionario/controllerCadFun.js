
const urlBase = "http://localhost:4040/funcionario";

const vapp = {
    data() {
        return {
            id: '',
            cpf: '',
            nome: '',
            telefone: '',
            coren: '',
            isFarmaceutico: false,
            funcionarios: [],
            acao: 'ENVIAR',
            filtroNome: '',
            filtroFarmaceutico: 'todos' // valores possíveis: 'todos', 'S', 'N'
        };
    },
    computed: {
        funcionariosFiltrados() {
            return this.funcionarios.filter(f => {
                let nomeMatch = f.nome_funcionario.toLowerCase().includes(this.filtroNome.toLowerCase());
                let farmaceuticoMatch = (this.filtroFarmaceutico === 'todos') || (f.farmaceutico === this.filtroFarmaceutico);
                return nomeMatch && farmaceuticoMatch;
            });
        }
    },
    methods: {
        limpar() {
            this.id = '';
            this.cpf = '';
            this.nome = '';
            this.telefone = '';
            this.coren = '';
            this.isFarmaceutico = false;
            this.acao = 'ENVIAR';
        },
        limparCoren() {
            if (this.isFarmaceutico) {
                this.coren = '';
            }
        },
        gerarTabela() {
            axios.get(urlBase).then((response) => {
                this.funcionarios = response.data.listaFuncionarios;
            });
        },
        enviar(f,aux){
            this.id = f.idFuncionario;
            this.cpf = f.cpf;
            this.nome = f.nome_funcionario;
            this.telefone = f.telefone_funcionario;
            this.coren = f.coren;
            this.isFarmaceutico = f.farmaceutico === 'S';
            this.acao = aux;
        },
        excluir() {
            axios.delete(`${urlBase}/${this.id}`).then(() => {
                this.limpar();
                this.gerarTabela();
            });
        },
        mascaraCPF(){
            let cpf = this.cpf.replace(/\D/g, '');
            // Aplica a máscara de CPF
            cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            // Atualiza o valor do this.cpf com o CPF formatado
            this.cpf = cpf;
        },
        mascaraTelefone() {
            // Remove qualquer caractere que não seja número
            let telefone = this.telefone.replace(/\D/g, '');
            
            // Aplica a máscara de telefone
            if (telefone.length <= 10) {
                telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
            } else {
                telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
            }
            
            // Atualiza o valor do this.telefone com o telefone formatado
            this.telefone = telefone;
        },
        alterar() {
            let farmaceutico = 'N';
            if (this.isFarmaceutico) {
                farmaceutico = 'S';
            }
            axios.put(`${urlBase}`, {
                "idFuncionario": this.id,
                "nome_funcionario": this.nome,
                "farmaceutico": farmaceutico,
                "coren": this.coren,
                "cpf": this.cpf,
                "telefone_funcionario": this.telefone
            }).then(() => {
                this.limpar();
                this.gerarTabela();
            });
        },
        executarAcao() {
            if (!this.cpf || !this.nome || !this.telefone || (this.isFarmaceutico==false && !this.coren)) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }
            if (this.cpf.length !== 14) {
                alert("CPF inválido. Por favor, insira um CPF no formato 000.000.000-00.");
                return;
            }
            if (this.telefone.length !== 14) {
                alert("Telefone inválido. Por favor, insira um telefone com pelo menos 10 dígitos.");
                return;
            }
            if (this.acao === 'ENVIAR') {
                let farmaceutico = 'N';
                if (this.isFarmaceutico) {
                    farmaceutico = 'S';
                }
                axios.post(urlBase, {
                    "idFuncionario": 0,
                    "nome_funcionario": this.nome,
                    "farmaceutico": farmaceutico,
                    "coren": this.coren,
                    "cpf": this.cpf,
                    "telefone_funcionario": this.telefone
                }).then(() => {
                    this.limpar();
                    this.gerarTabela();
                });
            } else if (this.acao === 'EXCLUIR') {
                this.excluir();
            } else if (this.acao === 'ALTERAR') {
                this.alterar();
            }
        }
        
    },
    mounted() {
        this.gerarTabela();
    },
    template:
        `
       <div id="ig9e" class="gjs-row"></div>
        <div id="i9k6ut" class="gjs-row">
            <div id="ig2xkd" class="gjs-cell">
                <div id="i4p9" class="gjs-row">
                    <div id="iycw" class="gjs-cell">
                        <div id="iibj" class="gjs-row">
                            <div id="i2en" class="gjs-cell">
                                <div id="is1r">CADASTRAR FUNCIONÁRIO</div>
                            </div>
                        </div>
                        <div id="iux8ff" class="gjs-row"></div>
                        <div id="idehe" class="gjs-row">
                            <div id="i3qzp" class="gjs-cell">
                                <form @submit.prevent="executarAcao()" method="get" id="i1kli">
                                    <div id="ido4u">
                                        <label id="ijmu7">*CPF</label>
                                        <input required @change="mascaraCPF()" v-model="cpf" type="text" id="ihkim" />
                                    </div>
                                    <div id="iwqmj">
                                        <label id="irb6v">*Nome</label>
                                        <input required v-model="nome" type="text" id="iatkf" />
                                    </div>
                                    <div id="i4dx9">
                                        <label id="ihnnh">Coren</label>
                                        <input  :required="isFarmaceutico" v-model="coren" type="text" id="ipp4w" :disabled="isFarmaceutico" />
                                    </div>
                                    <div id="i2c15">
                                        <label id="iabii">*Telefone</label>
                                        <input @change="mascaraTelefone()" required v-model="telefone" type="text" id="i47d1" />
                                    </div>
                                    <div id="ikbsj">
                                        <input @change="limparCoren" type="checkbox" v-model="isFarmaceutico" id="icf4s" />
                                        <label id="inml7">Farmacêutico</label>
                                    </div>
                                    <div id="iat94">
                                        <button @click.prevent="executarAcao()" type="button" id="i9w0r">{{acao}}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="i2c15" style="width: 50%; align-items: center;">
            <input v-model="filtroNome" placeholder="Filtrar por nome" id="icf4s"/>
            <select v-model="filtroFarmaceutico" id="icf4s">
                <option value="todos">Todos</option>
                <option value="S">Farmacêutico</option>
                <option value="N">Não Farmacêutico</option>
            </select>
        </div>
        <div class="gjs-row" id="i89twn">
            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Telefone</th>
                    <th>Coren</th>
                    <th>Farmaceutico</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="f in funcionariosFiltrados" :key="f.idFuncionario">
                        <td>{{f.idFuncionario}}</td>
                        <td>{{f.nome_funcionario}}</td>
                        <td>{{f.cpf}}</td>
                        <td>{{f.telefone_funcionario}}</td>
                        <td>{{f.coren}}</td>
                        <td>{{f.farmaceutico}}</td>
                        <td>
                            <button class="btn btn-danger"  @click="enviar(f,'EXCLUIR')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                                </svg>
                            </button>
                            <button class="btn btn-warning" @click="enviar(f,'ALTERAR')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        `
    
}

Vue.createApp(vapp).mount('#iuxe');