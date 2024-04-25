import { Router } from "express";
import LoteCtrl from "../controle/loteCtrl.js";

const loteCtrl = new LoteCtrl();
const rotaLote = new Router();

rotaLote.get('/', loteCtrl.consultar)
.get('/:termo', loteCtrl.consultar)
.post('/', loteCtrl.gravar)
.patch('/', loteCtrl.atualizar)
.put('/', loteCtrl.atualizar)
.delete('/', loteCtrl.excluir);

export default rotaLote;