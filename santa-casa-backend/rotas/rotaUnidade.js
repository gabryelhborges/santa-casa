import { Router } from "express";
import UnidadeCtrl from "../controle/unidadeCtrl.js";

const uniCtrl = new UnidadeCtrl();
const rotaUnidade = new Router();

rotaUnidade.get('/', uniCtrl.consultar)
.get('/:termo', uniCtrl.consultar)
.post('/', uniCtrl.gravar)
.patch('/', uniCtrl.atualizar)
.put('/', uniCtrl.atualizar)
.delete('/', uniCtrl.excluir);

export default rotaUnidade;