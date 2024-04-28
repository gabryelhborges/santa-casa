import { Router  } from "express";
import localCtrl from "../controle/localCtrl.js";

const locCtrl = new localCtrl();
const rotaLocal = new Router();

rotaLocal.get('/', locCtrl.consultar)
.get('/:termo',locCtrl.consultar)
.post('/',locCtrl.gravar)
.patch('/',locCtrl.atualizar)
.put('/',locCtrl.atualizar)
.delete('/',locCtrl.excluir);

export default rotaLocal;