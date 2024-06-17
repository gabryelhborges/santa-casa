import {Router} from "express";
import TransferenciaCtrl from "../controle/transferenciaCtrl.js";

const transfCtrl = new TransferenciaCtrl();
const rotaTransferencia = new Router();
rotaTransferencia
.get('/periodos',transfCtrl.getperiodos)
.get('/recentes',transfCtrl.getrecentes)
.get('/antigos',transfCtrl.getantigos)
.get('/',transfCtrl.consultar)
.get('/:termo',transfCtrl.consultar)
.post('/',transfCtrl.gravar)
.delete('/',transfCtrl.excluir)

export default rotaTransferencia;