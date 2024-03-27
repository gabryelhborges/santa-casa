import { Router } from "express";
import PacienteCtrl from "../controle/pacienteCtrl.js";

const pacCtrl = new PacienteCtrl();
const rotaPaciente = new Router();

rotaPaciente.get('/', pacCtrl.consultar)
.get('/:termo', pacCtrl.consultar)
.post('/', pacCtrl.gravar)
.patch('/', pacCtrl.atualizar)
.put('/', pacCtrl.atualizar)
.delete('/', pacCtrl.excluir);

export default rotaPaciente;