create database santa_casa;
use santa_casa;
create table pacientes (
    id_paciente           integer not null auto_increment,
    cpf                   varchar(14) not null unique,
    nome                  varchar(50) not null,
    raca                  varchar(8) not null,
    estado_civil          varchar(1) not null,
    sexo                  varchar(1) not null,
    data_nascimento       date, -- YYYY-MM-DD
    endereco              varchar(100),
    bairro                varchar(50),
    telefone              varchar(20),
    profissao             varchar(50),
    cadastro              timestamp default current_timestamp,
    numero                varchar(10),
    complemento           varchar(60),
    cep                   varchar(10),
    naturalidade          varchar(50),
    nome_pai              varchar(50),
    nome_responsavel      varchar(50),
    nome_mae              varchar(50),
    nome_social           varchar(60),
    utilizar_nome_social  varchar(1) default 'N',
    religiao              varchar(50),
    orientacao_sexual     integer default 0, --  0 -HETEROSSEXUAL  1- HOMOSSEXUAL  2- BISSEXUAL 3- OUTRO
    constraint pkPacientes primary key (id_paciente)
);

create table funcionarios(
    idFuncionario       integer not null auto_increment,
    nome_funcionario    varchar(60) not null,
    farmaceutico        varchar(1),
    coren               varchar(14),
    cpf                 varchar(14) not null unique,
    telefone_funcionario varchar(20),
    constraint pfFuncionario primary key (idFuncionario)
);

create table fornecedor(
    idFornecedor integer not null  auto_increment,
    cnpj varchar(18) not null unique,
    f_nome varchar(70) not null,
    endereco varchar(100),
    numero integer,
    complemento varchar(200),
    bairro varchar(100),
    cidade varchar(30), -- maior nome de cidade do brasil tem 29 caracteres
    uf char(2) not null,
    telefone varchar(20),
    constraint pk_fornecedor primary  key (idFornecedor)
);

create table produtos(
    prod_ID integer not null,
    Fornecedor_idFornecedor integer not null,
    nome varchar(45) not null,
    psicotropico varchar(1) not null,
    valor_custo decimal(5,2) not null,
    ultima_compra date,
    ultima_saida date,
    observacao varchar(300),
    descricao_uso varchar(300) not null,
    quantidade_total integer not null,
    tipo varchar(50) not null,
    constraint pk_prod primary key (prod_ID),
    constraint fk_pf foreign key (Fornecedor_idFornecedor) references fornecedor(idFornecedor)
);

create table fabricante(
    fab_cod integer not null auto_increment,
    fab_nome varchar(70) not null,
    constraint pk_fab primary key (fab_cod)
);

create table unidade(
    un_cod integer not null auto_increment,
    unidade varchar(30) not null,
    constraint pk_un primary key (un_cod)
);

create table nomefarmacologico(
    far_cod integer not null auto_increment,
    nome_far varchar(70) not null,
    constraint pk_far primary key (far_cod)
);

create table formafarmaceutica(
    ffa_cod integer not null auto_increment,
    forma varchar(40) not null,
    constraint pk_ffa primary key(ffa_cod)
);