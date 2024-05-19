import { Router } from "express";
import MotivoCtrl from "../controle/motivoCtrl.js";

const motivoCtrl = new MotivoCtrl();
const rotaMotivo = new Router();

rotaMotivo.get('/', motivoCtrl.consultar)
.get('/:termo', motivoCtrl.consultar)
.post('/',motivoCtrl.gravar)
.patch('/',motivoCtrl.atualizar)
.put('/',motivoCtrl.atualizar)
.delete('/',motivoCtrl.excluir);

export default rotaMotivo;