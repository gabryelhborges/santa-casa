const urlBase = 'http://localhost:4040';
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
const vapp ={
    data(){
        return{
            unidades: [],
            unidades_minimas: [],
            produto: '',
            produtos: [],
            produto_selecionado: '',
            nome_farmacoligico: '',
            fabricante: '',
            lotes: [],
            lote_selecionado: '',
            unidade: '',
            forma_farmacologica: '',
            validade: '',
            lista: [],
            quantidade: 0,
            isNovoLote: true,
            codigo_novo_lote: '',
            funcionario: '',
            conteudo_frasco: '',
            todasEntradas: []
        }
    },
    methods:{
      puxarEntradas(){
        axios.get(urlBase + '/entrada').then((response) => {
            this.todasEntradas = response.data.listaEntradas;
        })
      },
      exibirMensagem(mensagem, estilo) {
        let elemMensagem = document.getElementById('mensagem');
        if (!estilo) {
            estilo = 'aviso';
        }
        if (estilo == 'aviso') {
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
          elemMensagem.innerHTML = `  <div class='divMsg msgErro'>
                                          <p>${mensagem}</p>
                                      </div>`;
        }
        setTimeout(() => {
            elemMensagem.innerHTML = '';
        }, 7000);//7 Segundos
      },
      add_unidade(){
          axios.get(urlBase + '/forma').then((response)=>{
              this.unidades = response.data.listaFormaFaramaceuticas;
          });
      },
      add_unidade_minima(){
          axios.get(urlBase + '/unidade').then((response)=>{
              this.unidades_minimas = response.data.listaUnidades;
          });
      },
      pesquisa(){
          axios.get(urlBase + '/produto/'+ this.produto).then((response)=>{
              this.produtos = response.data.listaProdutos;
          });
      },
      excluirEntrada(aux){
        axios.delete(`${urlBase}/entrada/${aux.entrada_id}`).then(() => {
          this.exibirMensagem('Entrada excluída com sucesso!', 'ok');
          this.puxarEntradas();
          });
      },
      adicionar(c){
          this.produto_selecionado = c;
          this.nome_farmacoligico = c.nomeFar;
          this.fabricante = c.fabricante;
          axios.get(urlBase + '/lote?produto=' + c.prod_ID).then((response)=>{
              this.lotes = response.data.listaLotes;
          });
      },
      prencher_Informacao(){
        if (this.lote_selecionado === 'novo') {
          this.isNovoLote = false;
          this.validade = '';
          this.unidade = '';
          this.forma_farmacologica = '';
        } else {
          this.isNovoLote = true;
          this.validade = formataData(this.lote_selecionado.data_validade);
          this.unidade = this.lote_selecionado.unidade;
          this.conteudo_frasco = this.lote_selecionado.conteudo_frasco;
          this.forma_farmacologica = this.lote_selecionado.formaFarmaceutica;
        }
      },
      adicionar_lista() {
        let i;
        let Nexiste=true;
        
        if ((this.lote_selecionado || this.codigo_novo_lote || this.codigo_novo_lote.length>1) && this.produto_selecionado && this.quantidade) {
          for(i = 0; i < this.lista.length; i++){
            if((this.lista[i].lote === this.lote_selecionado || this.lista[i].lote.codigo === this.codigo_novo_lote) && this.lista[i].produto === this.produto_selecionado){
              this.lista[i].quantidade += Number(this.quantidade);
              Nexiste = false;
            }
          }if(Nexiste){
            let lote;
            if(this.codigo_novo_lote){
              lote = {
                "codigo": this.codigo_novo_lote,
                "data_validade": this.validade,
                "quantidade": 0,
                "produto": this.produto_selecionado,
                "formaFarmaceutica": this.forma_farmacologica,
                "conteudo_frasco": this.conteudo_frasco,
                "unidade": this.unidade,
                "total_conteudo": 0,
                "local": {
                  "loc_id": 1,
                  "loc_nome": "Farmacia"
                },
                "data_entrada": formataData(Date.now())
              }
            }else{
              lote = this.lote_selecionado;
            }
            this.lista.push({
              "lote": lote,
              "produto": this.produto_selecionado,
              "quantidade": this.quantidade
            });
          }
        } else {
          this.exibirMensagem('Por favor, preencha todos os campos.','erro');
        }
      },
      mudar(){
        if(!this.codigo_novo_lote){
          this.isNovoLote = !this.isNovoLote;
        }
      },
      checkdata() {
        const inputDate = new Date(this.validade);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        if (inputDate <= currentDate) {
          this.exibirMensagem('A data deve ser maior que a data atual.',"erro");
          this.validade = '';
        }
      },
      excluirItemLista(item){
        let aux = [];
        for(i = 0; i < this.lista.length; i++){
          if(this.lista[i] !== item){
            aux.push(this.lista[i]);
          }
        }
        this.lista = aux;
      },
      limparCampos() {
        this.produto_selecionado = '';
        this.nome_farmacoligico = '';
        this.fabricante = '';
        this.lote_selecionado = '';
        this.unidade = '';
        this.forma_farmacologica = '';
        this.validade = '';
        this.quantidade = 0;
        this.conteudo_frasco = 0;
        this.isNovoLote = true;
        this.codigo_novo_lote = '';
        this.produto = '';
      },
      async gravar() {
        console.log(this.lista);
        if (this.lista.length === 0) {
          this.exibirMensagem("Lista Vazia", "erro");
          return;
        }
    
        try {
          let response = await axios.get(urlBase + '/funcionario/' + this.funcionario);
          let funcionario = response.data.listaFuncionarios;
    
          if (funcionario.length === 1) {
            await axios.post(urlBase + '/entrada', {
              "entrada_id": 0,
              "funcionario": funcionario.pop(),
              "data_entrada": formataData(Date.now()),
              "itensEntrada": this.lista
            }).then(()=>{
              this.exibirMensagem("Entrada registrada com sucesso", "sucesso");
              this.lista = [];
              this.limparCampos();
              this.puxarEntradas();
            })
            
          } else {
            this.exibirMensagem("Funcionario não reconhecido", "erro");
          }
        } catch (error) {
          this.exibirMensagem("Erro ao processar a entrada", "erro");
          console.error(error);
        }
      }
    }, 
    mounted(){
        this.add_unidade();
        this.add_unidade_minima();
        this.puxarEntradas();
    },
    template:
    `
    <header>
  <img src="../image/farmacia.png" alt="" class="logo_tamanho">

  <div class="div-header">
      <div class="dropdown">
          <button class="dropbtn">Cadastros</button>
          <div class="dropdown-content">
              <a href="../Formularios/formulario_funcionario/cadastro_funcionario.html">Funcionário</a>
              <a href="../Formularios/formulario_paciente.html">Paciente</a>
              <a href="../Formularios/formulario_produto.html">Produto</a>
              <a href="../Formularios/formulario_farbicante.html">Fabricante</a>
          </div>
      </div>

      <div class="dropdown">
          <button class="dropbtn">Operações</button>
          <div class="dropdown-content">
              <a href="../funcao_fundametais/efetuar_consumo.html">Efetuar consumo</a>
              <a href="../funcao_fundametais/baixa_produto.html">Baixa de produto</a>
              <a href="../funcao_fundametais/entrada_de_produto.html">Entrada de produto</a>
              <a href="../funcao_fundametais/transferir_produtos.html">Transferência de produto</a>
          </div>
      </div>

      <div class="dropdown">
          <button class="dropbtn">Relatórios</button>
          <div class="dropdown-content">
              <a href="../Funcao_Saida/relatorioConsumo.html">Relatório de Consumo</a>
              <a href="../Funcao_Saida/relatorioBaixa.html">Relatório de Baixa</a>
          </div>
      </div>
  </div>
</header>
    <div id="ig9e" class="gjs-row">
    </div>
    <div class="gjs-row" id="i9k6ut">
    <div class="gjs-cell" id="ig2xkd">
    <div id="i4p9" class="gjs-row">
      <div id="iycw" class="gjs-cell">
        <div id="iibj" class="gjs-row">
          <div id="i2en" class="gjs-cell">
            <div id="is1r">ENTRADA DE PRODUTO
            </div>
          </div>
        </div>
        <div id="iux8ff" class="gjs-row">
        </div>
        <div id="idehe" class="gjs-row">
          <div id="i3qzp" class="gjs-cell">
            <form method="get" id="ibhz3">
              <div id="ii2r9">
              </div>
              <div id="ih30c" class="gjs-row">
                <div id="iugwh" class="gjs-cell">
                  <div id="imipk" class="gjs-row">
                    <div id="iiyir" class="gjs-cell">
                      <label id="i0sgp">Funcionario:</label>
                      <input v-model="funcionario" type="text" id="i2ydv"/>
                    </div>
                  </div>
                  <div id="imipk" class="gjs-row">
                    <div id="iiyir" class="gjs-cell">
                      <label id="i0sgp">Nome Produto:</label>
                      <input readonly  v-model="produto_selecionado.nome" type="text" id="i2ydv"/>
                    </div>
                    <div id="ilgiu" class="gjs-cell">
                      <label id="ib0xt">Nome Farmacologico:</label>
                      <input readonly v-model="nome_farmacoligico.nome_far" type="text" id="imamw"/>
                    </div>
                    <div id="iqmyw" class="gjs-cell">
                      <label id="iv8y5">Fabricante:</label>
                      <input readonly v-model="fabricante.f_nome" type="text" id="is31g"/>
                    </div>
                  </div>
                  <div id="iulz2" class="gjs-row">
                    <div id="ify1j" class="gjs-cell">
                      <label id="ioc2v">Lote:</label>
                      <select v-show="isNovoLote" @change="prencher_Informacao" v-model="lote_selecionado" type="text" id="ijwfa" required>
                        <option value="">Selecione um Lote</option>
                        <option value="">-------------------------</option>
                         <option v-for="l in lotes" :value="l">{{l.codigo}}</option>
                        <option value="">-------------------------</option>
                        <option value="novo">Novo Lote</option>
                      </select>
                      <input v-show="!isNovoLote" @change="mudar()" v-model="codigo_novo_lote" type="text" id="is31g"/>
                    </div>
                    <div id="i1z9b" class="gjs-cell">
                      <label id="iwexj">Validade:</label>
                      <input @change="checkdata()" :readonly="isNovoLote" v-model="validade" type="date" id="iuw7l" required/>
                    </div>
                  </div>
                </div>
              </div>
              <div id="ioxkv" class="gjs-row">
                <div id="iod6w" class="gjs-cell">
                  <label id="i43wz">Quantidade:</label>
                  <input min="1" v-model="quantidade" type="number" id="i2ojo"/>
                </div>
                <div id="izzdy" class="gjs-cell">
                  <label id="ist0b">Embalagem:</label>
                  <select :disabled="isNovoLote" v-model="forma_farmacologica" type="text" required id="icxq9">
                    <option value="Selecione uma Unidade">Selecione uma Unidade</option>
                    <option v-for="u in unidades" :value="u">{{u.forma}}</option>
                  </select>
                </div>
                <div id="i343b" class="gjs-cell">
                  <label id="iku2p">Capacidade:</label>
                  <input min="1" :readonly="isNovoLote" v-model="conteudo_frasco"  type="number" id="iwax2"/>
                </div>
                <div id="iekla" class="gjs-cell">
                  <label id="ik72k">Unidade Minima:</label>
                  <select :disabled="isNovoLote" v-model="unidade" type="text" required id="igyah">
                    <option value="Selecione uma Unidade">Selecione uma Unidade</option>
                    <option v-for="m in unidades_minimas" :value="m">{{m.unidade}}</option>
                  </select>
                </div>
              </div>
              <div id="i6n2u">
                <button  @click.prevent="adicionar_lista()" type="submit" id="i2tym">ADICIONAR A LISTA</button>
              </div>
            </form>
            <div id="i1o7b" class="gjs-row">
              <div id="ip0ai" class="gjs-cell">
                <div id="ien6q">
                  <span id="ie1dp">LISTA</span>
                  <br/>
                </div>
              </div>
            </div>
            <div id="ivgil" class="gjs-row">
              <div id="i180j2" class="gjs-cell">
                <div id="iz5242" class="gjs-row">
                  <div id="isvn01" style="max-height: 100%; overflow-y: auto;" class="gjs-cell">
                    <table class="table table-striped" style="background: white;" v-if="lista.length > 0">
                        <thead v-if="lista.length > 0">
                          <tr>
                            <th scope="col">Codigo</th>
                            <th scope="col">Produto</th>
                            <th scope="col">Quantidade</th>
                            <th scope="col">Total({{unidade.unidade}})</th>
                            <th scope="col">Excluir</th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr v-for="l in lista" :key="l.lote.codigo">
                                <td>{{l.lote.codigo}}</td>
                                <td>{{l.produto.nome}}</td>
                                <td>{{l.quantidade}}</td>
                                <td>{{ l.quantidade * l.lote.conteudo_frasco}}</td>
                                <td><button @click="excluirItemLista(l)">-</button></td>
                            </tr>
                        </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div id="idf6y">
              <button @click="gravar()" id="icspi">ADICIONAR</button>
              <button @click="lista = []"  id="imrrh">LIMPAR LISTA</button>
              <button @click="limparCampos()" id="ibnb4">CANCELAR</button>
            </div>
          </div>
        </div>
      </div>
      <div id="iqae" class="gjs-cell">
        <div id="ispvg8" class="gjs-row">
          <div id="ida92r" class="gjs-cell">
            <div id="i9ec6g">PRODUTOS
            </div>
          </div>
        </div>
        <div id="iyqrj3" class="gjs-row">
          <div id="i97cd6" class="gjs-cell">
            <div id="i2bfua" class="gjs-row">
              <div id="ic03sh" class="gjs-cell">
                <div id="iacujg" class="gjs-row">
                  <div id="i471zk" class="gjs-cell">
                    <form id="ihl0kq">
                      <button type="button" @click="pesquisa()" id="i7w73f">Send</button>
                      <div id="ip98ny">
                      </div>
                      <div>
                      </div>
                      <input v-model="produto" type="text" id="iptvwk" placeholder="pesquisar produto"/>
                    </form>
                  </div>
                </div>
                <div id="inog5k" class="gjs-row">
                  <div id="ird6mh" style="max-height: 100%; overflow-y: auto;" class="gjs-cell">
                    <table class="table table-striped table-hover" style="background: white;" v-if="produtos.length > 0">
                        <thead v-if="produtos.length > 0">
                          <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">Farmacologico</th>
                            <th scope="col">Fabricante</th>
                            <th scope="col">Adicionar</th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr v-for="c in produtos" :key="c.prod_ID">
                                <td>{{c.nome}}</td>
                                <td>{{c.nomeFar.nome_far}}</td>
                                <td>{{c.fabricante.f_nome}}</td>
                                <td><button @click="adicionar(c)">+</button></td>
                            </tr>
                        </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
     </div>
    </div>
    <div id="app" class="container mt-5">
      <div v-for="t in todasEntradas" class="mb-4 p-3 bg-white border rounded">
        <h5>{{t.entrada_id}} - {{t.funcionario}}</h5>
        <button @click="excluirEntrada(t)"></button>
        <table class="table table-striped" v-for="l in t.itensEntrada">
          <thead v-if="produtos.length > 0" class="table-dark">
            <tr>
              <th scope="col">Lote</th>
              <th scope="col">Produto</th>
              <th scope="col">Quantidade</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                  <td>{{l.lote.codigo}}</td>
                  <td>{{l.produto.prod_ID}}</td>
                  <td>{{l.quantidade}}</td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="mensagem"></div>
    `
}

Vue.createApp(vapp).mount('#iuxe')