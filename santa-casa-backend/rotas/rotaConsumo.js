import {Router} from "express";
import ConsumoCtrl from "../controle/consumoCtrl.js";

const consCtrl = new ConsumoCtrl();
const rotaConsumo = new Router();

rotaConsumo.get('/relatorio-produtos-consumidos/', consCtrl.relatorioProdutosConsumidos)
.get('/', consCtrl.consultar)
.get('/:termo', consCtrl.consultar)
.post('/', consCtrl.gravar)
//.patch('/', consCtrl.atualizar)
//.put('/', consCtrl.atualizar)
.delete('/', consCtrl.excluir)


export default rotaConsumo;