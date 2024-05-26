import { Router } from "express";
import EntradaCtrl from "../controle/entradaCtrl.js";
import e from "cors";

const entradaCtrl = new EntradaCtrl();
const rotaEntrada = new Router();

rotaEntrada.post('/',entradaCtrl.gravar)
.put('/',entradaCtrl.atualizar)
.patch('/',entradaCtrl.atualizar)
.delete('/', entradaCtrl.excluir)
.get('/',entradaCtrl.consultar)
.get('/:termo', entradaCtrl.consultar)

export default rotaEntrada;