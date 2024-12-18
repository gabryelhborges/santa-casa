-- drop database santa_casa;
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

create table fabricante(
    idFabricante integer not null  auto_increment,
    cnpj varchar(18) not null unique,
    f_nome varchar(70) not null,
    endereco varchar(100),
    numero integer,
    complemento varchar(200),
    bairro varchar(100),
    cidade varchar(30), -- maior nome de cidade do brasil tem 29 caracteres
    uf char(2) not null,
    telefone varchar(20),
    constraint pk_fabricante primary  key (idFabricante)
);

create table nomefarmacologico(
    far_cod integer not null auto_increment,
    nome_far varchar(70) not null, -- novalgina = diporona
    constraint pk_far primary key (far_cod)
);

create table unidade(
    un_cod integer not null auto_increment,
    unidade varchar(30) not null, -- ml, comprimido, 
    constraint pk_un primary key (un_cod)
);

create table produtos(
    prod_ID integer not null,
    Fabricante_idFabricante integer not null,
    nome varchar(45) not null,
    psicotropico varchar(1) not null,
    valor_custo decimal(10,2) not null,
    far_cod integer not null, -- nome farmacologico
    observacao varchar(300),
    descricao_uso varchar(300) not null,
    tipo varchar(50) not null,
    un_min integer not null,
    constraint pk_prod primary key (prod_ID),
    constraint fk_pf foreign key (Fabricante_idFabricante) references fabricante(idFabricante),
    constraint fk_far foreign key (far_cod) references nomefarmacologico(far_cod),
    constraint fk_unProd foreign key(un_min) references Unidade(un_cod)
);



 -- Embalagem
create table formafarmaceutica(
    ffa_cod integer not null auto_increment,
    forma varchar(40) not null, -- solução oral, comprimido, capsula, dragea 
    constraint pk_ffa primary key(ffa_cod)
);

create table loc(
    loc_id integer not null auto_increment,
    loc_nome varchar(30) not null,
    constraint pk_loc primary key (loc_id)
);
-- drop table lote;
create table lote(
    codigo varchar(15) not null,
    data_validade date not null,
    quantidade integer not null,
    produto_prod_ID integer not null,
    formafarmaceutica_ffa_cod integer  not null,
    conteudo_frasco integer not null,
    unidade_un_cod integer not null,
    total_conteudo integer not null,
    loc integer not null,
    data_entrada date not null,
    constraint pk_codigo primary key (codigo, produto_prod_ID, loc),
    constraint fk_prod_ID  foreign key (produto_prod_ID) references produtos(prod_ID), 
    constraint fk_ffa_cod foreign key (formafarmaceutica_ffa_cod) references formafarmaceutica(ffa_cod),  
    constraint fk_un_cod foreign key (unidade_un_cod) references unidade(un_cod),
    constraint fk_loc foreign key (loc) references loc(loc_id)
);
CREATE TABLE entrada(
    entrada_id INTEGER not NULL AUTO_INCREMENT,
    entrada_funcionario_id INTEGER not NULL,
    data_entrada DATE NOT NULL,
    constraint pk_id PRIMARY key (entrada_id),
    constraint fk_fun FOREIGN KEY (entrada_funcionario_id) REFERENCES funcionarios(idFuncionario)
);
CREATE TABLE itensEntrada(
    ent_id INTEGER NOT NULL,
    lote_cod VARCHAR(15) NOT NULL,
    prod_id INTEGER NOT null,
    qtde INTEGER NOT NULL,
    constraint pk_ent_id PRIMARY KEY (ent_id,lote_cod,prod_id),
    constraint fk_entrada foreign key (ent_id) REFERENCES entrada(entrada_id),
    constraint fk_lote Foreign Key (lote_cod,prod_id) REFERENCES lote(codigo,produto_prod_ID)
);

create table consumo(
	cons_id integer not null auto_increment,
    cons_pac_id integer not null,
    cons_func_id integer not null,
    cons_loc_id integer not null,
    cons_dataConsumo datetime DEFAULT CURRENT_TIMESTAMP,
    constraint pk_cons_id primary key (cons_id),
    constraint fk_cons_pac_id foreign key (cons_pac_id) references Pacientes(id_paciente),
    constraint fk_cons_func_id foreign key (cons_func_id) references Funcionarios(idFuncionario),
    constraint fk_cons_loc_id foreign key (cons_loc_id) references Loc(loc_id)
);

create table itensConsumo(
	ic_cons_id integer not null,
    ic_lote_codigo varchar(15) not null,
    ic_prod_id integer not null,
    ic_qtdeConteudoUtilizado integer not null,
    constraint pk_ic primary key (ic_cons_id, ic_lote_codigo, ic_prod_id),
    constraint fk_ic_cons_id foreign key (ic_cons_id) references Consumo(cons_id) ON DELETE CASCADE,
    constraint fk_ic_lote_codigo_e_produto_id foreign key (ic_lote_codigo, ic_prod_id) references Lote(codigo, produto_prod_ID)
);


create table transferencia(
    tf_id integer not null auto_increment,
    tf_data datetime default CURRENT_TIMESTAMP,
    tf_func_id integer not null,
    tf_origem integer not null,
    tf_destino integer not null,
    constraint fk_origem foreign key (tf_origem) references loc(loc_id),
    constraint fk_destino foreign key (tf_destino) references loc(loc_id),
    constraint fk_func foreign key (tf_func_id) references Funcionarios(idFuncionario),
    constraint pk_tf primary key(tf_id)
);

-- drop table itensTransferidos
CREATE TABLE itensTransferidos (
    itf_id INT NOT NULL AUTO_INCREMENT,
    itf_tf_id INT NOT NULL,
    itf_lote_cod VARCHAR(15) NOT NULL,
    itf_qtdetransferida INT NOT NULL,
    CONSTRAINT fk_itf_transf_id FOREIGN KEY (itf_tf_id) REFERENCES transferencia(tf_id),
    CONSTRAINT fk_itf_lote_cod FOREIGN KEY (itf_lote_cod) REFERENCES lote(codigo),
    CONSTRAINT pk_itf PRIMARY KEY (itf_id)
);

create table Motivo(
    motivo_id integer not null auto_increment,
    motivo varchar(70) not null,
    constraint pk_motivo primary key(motivo_id)
);

create table baixa(
    idBaixa integer not null auto_increment,
    b_idFuncionario integer not null,
    b_locId integer not null,
    dataBaixa datetime DEFAULT CURRENT_TIMESTAMP,
    constraint pk_baixa primary key(idBaixa),
    constraint fk_baixa_func foreign key(b_idFuncionario) references Funcionarios(idFuncionario),
    constraint fk_baixa_loc foreign key(b_locId) references Loc(loc_id)
);

create table itensBaixa(
    ib_idBaixa integer not null,
    ib_idProduto integer not null,
    ib_idMotivo integer not null,
    ib_idQtde integer not null,
    ib_idLote varchar(15) not null,
    ib_idUnidade integer not null,
    ib_idObservacao varchar(200),
    constraint pk_ib primary key(ib_idBaixa, ib_idLote, ib_idProduto),
    constraint fk_ib_idBaixa foreign key(ib_idBaixa) references Baixa(idBaixa) ON DELETE CASCADE,
    constraint fk_iblote_ibprod foreign key (ib_idLote, ib_idProduto) references Lote(codigo, produto_prod_ID),
    constraint fk_un_baixa foreign key(ib_idUnidade) references Unidade(un_cod),
    constraint fk_ibMotivo foreign key(ib_idMotivo) references Motivo(motivo_id)
     
);

--insert baixa
INSERT INTO baixa () VALUES ();
INSERT INTO baixa () VALUES ();
INSERT INTO baixa () VALUES ();
INSERT INTO baixa () VALUES ();
INSERT INTO baixa () VALUES ();
INSERT INTO baixa () VALUES ();

--insert itensBaixa

-- insert dos motivos
INSERT INTO Motivo (motivo) VALUES ('Vencido');
INSERT INTO Motivo (motivo) VALUES ('Danificado');
INSERT INTO Motivo (motivo) VALUES ('Roubado');
INSERT INTO Motivo (motivo) VALUES ('Extraviado');
INSERT INTO Motivo (motivo) VALUES ('Recolhido pelo fornecedor');
INSERT INTO Motivo (motivo) VALUES ('Uso em treinamento');

-- insert nos pacientes
insert into pacientes(cpf, nome, raca, estado_civil, sexo, data_nascimento, endereco, bairro, telefone, profissao, numero, complemento, cep, naturalidade, nome_pai, nome_responsavel, nome_mae, nome_social, utilizar_nome_social, religiao, orientacao_sexual) values('526.217.888-07','Leon B Ronchi', 'branco','S','M','2004-02-07','Rua Monsenhor Nakamura','Parque dos Orixás','(18) 98106-9187','estudante','1146','Não há complemento','19160-000','Brasileiro','Sergio','Geovanna','Marcia','Solange','S','Ateu',3);
insert into pacientes(cpf, nome, raca, estado_civil, sexo, data_nascimento, endereco, bairro, telefone, profissao, numero, complemento, cep, naturalidade, nome_pai, nome_responsavel, nome_mae, nome_social, utilizar_nome_social, religiao, orientacao_sexual) values('999.999.999-99','Fulano da Silva Sauro','pardo','C','M','1997-10-13','Rua tal','Bairro X','(99) 99998-9999','marceneiro','9999','complemento X','00000-000','Testeiro','Fulanão','Fulaninho','Fulanona','Robson','N','Catolico',3);
insert into pacientes(cpf, nome, raca, estado_civil, sexo, data_nascimento, endereco, bairro, telefone, profissao, numero, complemento, cep, naturalidade, nome_pai, nome_responsavel, nome_mae, nome_social, utilizar_nome_social, religiao, orientacao_sexual) values('396.354.698-02','Yago Akio', 'preto','V','F','1500-02-28','Rua do arco-iris','Bairro do unicornio','(69) 96969-6969','Garoto de Programa','69','Complemento A','12345-123','Japonês','Ricardo','Gabryel H Borges','Liria','Suzane Von Richthofen','S','Petista',3);
-- select * from pacientes;

-- insert nos funcionários
insert into funcionarios values(default, 'Gabryel H Borges', 'S','','478.067.288-05','(18) 99808-2343');
insert into funcionarios values(default, 'Aglae Pereira Zaupa','N','SP-12345-6','069.916.188-61','(11) 95555-5999');
insert into funcionarios values(default, 'Gabriel Carrocini', 'N','','999.999.999-99','(18) 10101-0011');
--  * from funcionarios;

-- insert nos locais
insert into loc(loc_nome) values('farmacia');
insert into loc(loc_nome) values('sala de medicação');

-- insert nos fabricantes
insert into fabricante values(default, '54.516.661/0001-01','Johnson & Johnson','Av. Pres. Juscelino Kubitschek',2041,'','Vila Nova Conceição','São Paulo','SP','0800 703 6363');
insert into fabricante values(default, '56.994.502/0001-30','Novartis','Av. Professor Vicente Rao',90,'','Cidade Monções','Sao Paulo','SP','0800 020 7758');
insert into fabricante values(default, '33.009.945/0001-23','Roche','R. Dr. Rubens Gomes Bueno',691,'','Santo Amaro','Sao Paulo','SP','0800 772 0295');
insert into fabricante values(default, '61.072.393/0001-33','Pfizer','R. Alexandre Dumas',1860,'','Santo Amaro','Sao Paulo','SP','(11) 5185-8500');
insert into fabricante values(default, '02.685.377/0001-57','Sanofi', 'Av. das Nações Unidas',14401,'Zona Sul','Chácara Santo Antônio', 'Sao Paulo', 'SP', '(11) 2889-3800');
insert into fabricante values(default, '33.069.212/0001-84','Merck', 'Av. das Nações Unidas',12995,'30 andar','Pinheiros','Sao Paulo', 'SP', '(11) 3346-8507');
insert into fabricante values(default, '33.247.743/0001-10','GSK (GlaxoSmithKline)','R. Carneiro da Cunha',303,'','Vila da Saúde','Sao Paulo','SP','(11) 2276-2183');
insert into fabricante values(default, '60.318.797/0001-00','AstraZeneca','Rodovia Raposo Tavares',0,'KM 26.9 S/N','Moinho Velho','Cotia', 'SP', '(11) 3737-1200');
insert into fabricante values(default, '18.459.628/0001-15','Bayer','R. Domingos Jorge',1100,'','Vila Socorro','Sao Paulo', 'SP','(11) 5694-5166');
insert into fabricante values(default, '15.670.288/0002-60','Gilead Sciences','Av. Dr. Chucri Zaidan',1240,'','Morumbi', 'Sao Paulo', 'SP','0800 771 0744');
-- select * from fabricante;

-- insert nas unidades
insert into unidade values(default,'Comprimido');
insert into unidade values(default,'Mililitro');
insert into unidade values(default,'Caixa');
insert into unidade values(default,'Frasco');
-- select * from unidade;

-- insert nas formas farmacêuticas
insert into formafarmaceutica values(default,'comprimido');
insert into formafarmaceutica values(default,'cápsula');
insert into formafarmaceutica values(default,'drágea');
insert into formafarmaceutica values(default,'pastilha');
insert into formafarmaceutica values(default,'supositório');
insert into formafarmaceutica values(default,'pomada');
insert into formafarmaceutica values(default,'gel');
insert into formafarmaceutica values(default,'creme');
insert into formafarmaceutica values(default,'xarope');
insert into formafarmaceutica values(default,'gota');
insert into formafarmaceutica values(default,'solução nasal');
insert into formafarmaceutica values(default,'oftálmica');
insert into formafarmaceutica values(default,'injetável');
insert into formafarmaceutica values(default,'spray');
insert into formafarmaceutica values(default,'aerossol');
-- select * from formafarmaceutica;

INSERT INTO nomefarmacologico (nome_far) VALUES ('Novalgina');
INSERT INTO nomefarmacologico (nome_far) VALUES ('Dipirona');
INSERT INTO nomefarmacologico (nome_far) VALUES ('Paracetamol');
INSERT INTO nomefarmacologico (nome_far) VALUES ('Ibuprofeno');
INSERT INTO nomefarmacologico (nome_far) VALUES ('Aspirina');


-- insert produtos
INSERT INTO produtos (prod_ID, Fabricante_idFabricante, nome, psicotropico, valor_custo, far_cod, observacao, descricao_uso, tipo, un_min)
VALUES (1, 1, 'Novalgina 500mg', 'N', 5.50, 1, 'Analgésico e antitérmico', 'Uso oral, dose única diária', 'Remedio', 2);
INSERT INTO produtos (prod_ID, Fabricante_idFabricante, nome, psicotropico, valor_custo, far_cod, observacao, descricao_uso, tipo, un_min)
VALUES (2, 2, 'Dipirona Sódica 1g', 'N', 7.80, 2, 'Usado para dor e febre', 'Uso oral ou intravenoso, conforme orientação médica', 'Remedio', 1);
INSERT INTO produtos (prod_ID, Fabricante_idFabricante, nome, psicotropico, valor_custo, far_cod, observacao, descricao_uso, tipo, un_min)
VALUES (3, 3, 'Paracetamol 750mg', 'N', 3.20, 3, 'Analgésico e antipirético', 'Uso oral, até 4 vezes ao dia', 'Remedio',1);
INSERT INTO produtos (prod_ID, Fabricante_idFabricante, nome, psicotropico, valor_custo, far_cod, observacao, descricao_uso, tipo, un_min)
VALUES (4, 4, 'Ibuprofeno 600mg', 'N', 4.50, 4, 'Anti-inflamatório e analgésico', 'Uso oral, 3 vezes ao dia', 'Remedio', 1);
INSERT INTO produtos (prod_ID, Fabricante_idFabricante, nome, psicotropico, valor_custo, far_cod, observacao, descricao_uso, tipo, un_min)
VALUES (5, 5, 'Aspirina 100mg', 'N', 2.00, 5, 'Analgésico e anti-inflamatório', 'Uso oral, uma vez ao dia', 'Remedio', 1);

-- insert lote
INSERT INTO lote (codigo, data_validade, quantidade, produto_prod_ID, formafarmaceutica_ffa_cod, conteudo_frasco, unidade_un_cod, total_conteudo, loc, data_entrada)
VALUES ('L001', '2024-12-31', 100, 1, 1, 500, 2, 50000, 1, '2024-06-14');

INSERT INTO lote (codigo, data_validade, quantidade, produto_prod_ID, formafarmaceutica_ffa_cod, conteudo_frasco, unidade_un_cod, total_conteudo, loc, data_entrada)
VALUES ('L002', '2025-06-30', 200, 2, 2, 1000, 1, 200000, 1, '2024-06-14');

INSERT INTO lote (codigo, data_validade, quantidade, produto_prod_ID, formafarmaceutica_ffa_cod, conteudo_frasco, unidade_un_cod, total_conteudo, loc, data_entrada)
VALUES ('L003', '2024-08-15', 150, 3, 3, 10, 1, 125000, 1, '2024-06-14');

INSERT INTO lote (codigo, data_validade, quantidade, produto_prod_ID, formafarmaceutica_ffa_cod, conteudo_frasco, unidade_un_cod, total_conteudo, loc, data_entrada)
VALUES ('L004', '2025-02-28', 250, 4, 4, 500, 1, 150000, 1, '2024-06-14');

INSERT INTO lote (codigo, data_validade, quantidade, produto_prod_ID, formafarmaceutica_ffa_cod, conteudo_frasco, unidade_un_cod, total_conteudo, loc, data_entrada)
VALUES ('L005', '2024-11-30', 400, 5, 5, 32, 1, 12800, 1, '2024-06-14');

INSERT INTO lote (codigo, data_validade, quantidade, produto_prod_ID, formafarmaceutica_ffa_cod, conteudo_frasco, unidade_un_cod, total_conteudo, loc, data_entrada)
VALUES ('L006', '2024-12-30', 300, 5, 5, 20, 1, 6000, 1, '2024-06-14');

-- select * from lote;

-- insert consumo
insert into consumo(cons_pac_id, cons_func_id, cons_dataConsumo, cons_loc_id) values(1, 1, '2024-04-26', 1);
insert into consumo(cons_pac_id, cons_func_id, cons_dataConsumo, cons_loc_id) values(2, 2, '2026-07-30', 1);

-- insert itens consumo
insert into itensConsumo(ic_cons_id, ic_lote_codigo, ic_prod_id, ic_qtdeConteudoUtilizado) VALUES(2, 'L00001', 12, 11);
insert into itensConsumo(ic_cons_id, ic_lote_codigo, ic_prod_id, ic_qtdeConteudoUtilizado) VALUES(2, 'L0001', 2, 6);
insert into itensConsumo(ic_cons_id, ic_lote_codigo, ic_prod_id, ic_qtdeConteudoUtilizado) VALUES(1, 'L0001', 3, 2);

