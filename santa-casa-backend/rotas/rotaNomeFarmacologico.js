import { Router } from "express";
import NomeFarmacologicoCtrl from "../controle/nomeFarmacologicoCtrl.js";

const nomeFarmacoCtrl = new NomeFarmacologicoCtrl();
const rotaNomeFarmaco = new Router();

rotaNomeFarmaco.get('/', nomeFarmacoCtrl.consultar)
.get('/:termo', nomeFarmacoCtrl.consultar)
.post('/',nomeFarmacoCtrl.gravar)
.patch('/',nomeFarmacoCtrl.atualizar)
.put('/',nomeFarmacoCtrl.atualizar)
.delete('/',nomeFarmacoCtrl.excluir);

export default rotaNomeFarmaco;