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
            codigo_novo_lote: ''
        }
    },
    methods:{
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
            this.forma_farmacologica = this.lote_selecionado.formaFarmaceutica;
        }
        },
        adicionar_lista(){
          this.lista.push({
            "lote": this.lote_selecionado,
            "produto": this.produto_selecionado,
            "quantidade": this.quantidade
          });
        },
        mudar(){
          if(!this.codigo_novo_lote){
            this.isNovoLote = !this.isNovoLote;
          }
        }
    }, 
    mounted(){
        this.add_unidade();
        this.add_unidade_minima();
    },
    template:
    `
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
                      <input :readonly="isNovoLote" v-model="validade" type="date" id="iuw7l" required/>
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
                  <label id="ist0b">Unidade:</label>
                  <select :disabled="isNovoLote" v-model="forma_farmacologica.ffa_cod" type="text" required id="icxq9">
                    <option value="Selecione uma Unidade">Selecione uma Unidade</option>
                    <option v-for="u in unidades" :value="u.ffa_cod">{{u.forma}}</option>
                  </select>
                </div>
                <div id="i343b" class="gjs-cell">
                  <label id="iku2p">Capacidade:</label>
                  <input min="1" :readonly="isNovoLote" v-model="lote_selecionado.conteudo_frasco"  type="number" id="iwax2"/>
                </div>
                <div id="iekla" class="gjs-cell">
                  <label id="ik72k">Unidade Minima:</label>
                  <select :disabled="isNovoLote" v-model="unidade.un_cod" type="text" required id="igyah">
                    <option value="Selecione uma Unidade">Selecione uma Unidade</option>
                    <option v-for="m in unidades_minimas" :value="m.un_cod">{{m.unidade}}</option>
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
                  <div id="isvn01" class="gjs-cell">
                    <table v-if="lista.length > 0">
                        <tbody>
                            <tr v-for="l in lista" :key="l.lote.codigo">
                                <td>{{l.lote.codigo}}</td>
                                <td>{{l.produto.nome}}</td>
                                <td>{{l.quantidade}}</td>
                                <td><button @click="lista.pop(l)"></button></td>
                            </tr>
                        </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div id="idf6y">
              <button id="icspi">ADICIONAR</button>
              <button @click="lista = []"  id="imrrh">LIMPAR LISTA</button>
              <button id="ibnb4">CANCELAR</button>
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
                      <button type="submit" id="i7w73f">Send</button>
                      <div id="ip98ny">
                      </div>
                      <div>
                      </div>
                      <input @change="pesquisa()" v-model="produto" type="text" id="iptvwk" placeholder="pesquisar produto"/>
                    </form>
                  </div>
                </div>
                <div id="inog5k" class="gjs-row">
                  <div id="ird6mh" class="gjs-cell">
                    <table v-if="produtos.length > 0">
                        <tbody>
                            <tr v-for="c in produtos" :key="c.prod_ID">
                                <td>{{c.nome}}</td>
                                <td>{{c.nomeFar.nome_far}}</td>
                                <td>{{c.fabricante.f_nome}}</td>
                                <td><button @click="adicionar(c)"></button></td>
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
    `
}

Vue.createApp(vapp).mount('#iuxe')