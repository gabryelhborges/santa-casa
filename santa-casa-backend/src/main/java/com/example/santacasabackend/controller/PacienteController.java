package com.example.santacasabackend.controller;

import com.example.santacasabackend.db.util.DB;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping(value="/paciente")
public class PacienteController {
    @GetMapping("teste")
    public ResponseEntity<Object> testarConexao(){
        return ResponseEntity.ok("Tela Pacientes!");
    }

    @GetMapping("acesso-banco")
    public ResponseEntity<Object> acessoBanco(){
        String msg = "";
        if(DB.conectar()){
            msg = "Conectou!!";
        }
        else{
            msg = "Não conectou :/";
        }
        return ResponseEntity.ok(msg);
    }
}
