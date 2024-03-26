package com.example.santacasabackend.db.util;

public class DB {
    static private Conexao con=new Conexao();
    static public boolean conectar()
    {
        return con.conectar("jdbc:postgresql://localhost:5432/",
                "projetopi2", "postgres", "postgres123");

    }
    static public Conexao getCon()
    {
        return con;
    }

    private DB() {
    }
}
