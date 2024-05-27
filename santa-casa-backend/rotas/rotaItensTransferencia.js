import { Router } from "express";
import ItensTransferenciaCtrl from "../controle/itensTransferenciaCtrl.js";
const itfCtrl = new ItensTransferenciaCtrl();
const rotaItensTransferencia = new Router();

rotaItensTransferencia.get('/',itfCtrl.consultar)
.get('/:termo',itfCtrl.consultar)
.post('/',itfCtrl.gravar)
.delete('/',itfCtrl.excluir);

export default rotaItensTransferencia;