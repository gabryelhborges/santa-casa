import { Router } from "express";
import FormaFarmaceuticaCtrl from "../controle/formaFarmaceuticaCtrl.js";

const formaCtrl = new FormaFarmaceuticaCtrl();
const rotaForma = new Router();

rotaForma.get('/', formaCtrl.consultar)
.get('/:termo', formaCtrl.consultar)
.post('/',formaCtrl.gravar)
.patch('/',formaCtrl.atualizar)
.put('/',formaCtrl.atualizar)
.delete('/',formaCtrl.excluir);

export default rotaForma;