package com.example.santacasabackend.db.dal;

import com.example.santacasabackend.db.model.Paciente;

import java.util.List;

public class PacienteDAL implements IDAL<Paciente>{

    @Override
    public boolean gravar(Paciente entidade) {
        return false;
    }

    @Override
    public boolean alterar(Paciente entidade) {
        return false;
    }

    @Override
    public boolean apagar(Paciente entidade) {
        return false;
    }

    @Override
    public Paciente get(int id) {
        return null;
    }

    @Override
    public List<Paciente> get(String filtro) {
        return null;
    }
}
