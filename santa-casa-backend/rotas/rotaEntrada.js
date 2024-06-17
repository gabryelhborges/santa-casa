import { Router } from "express";
import EntradaCtrl from "../controle/entradaCtrl.js";
import e from "cors";

const entradaCtrl = new EntradaCtrl();
const rotaEntrada = new Router();

rotaEntrada.post('/',entradaCtrl.gravar)
.get('/itens/', entradaCtrl.consultar2)
.delete('/:termo', entradaCtrl.excluir)
.get('/novo/',entradaCtrl.consultarNovosLotes)
.get('/total/',entradaCtrl.consultarTotal)
.get('/totalitens/',entradaCtrl.consultarTotalItens)
.get('/ultima/',entradaCtrl.consultarUltima)
.get('/',entradaCtrl.consultar)
.get('/:termo', entradaCtrl.consultar)




export default rotaEntrada;