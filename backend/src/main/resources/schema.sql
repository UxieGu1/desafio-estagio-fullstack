--Tabela de vagas:
CREATE TABLE IF NOT EXISTS tb_vagas{
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    area VARCHAR(150) NOT NULL,
    tipo VARCHAR(50) NOT NULL, --ex: estagio, junior e pleno
    status VARCHAR(50) NOT NULL DEFAULT 'aberta' -- ex: aberta e fechada
};

CREATE TABLE IF NOT EXISTS candidaturas (
    id BIGSERIAL PRIMARY KEY,
    vaga_id BIGINT NOT NULL,
    nome_candidato VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'em_analise', -- ex: em_analise, aprovado, reprovado

--relacionamento 1:N
    CONSTRAINT fk_vaga
    FOREIGN KEY (vaga_id)
    REFERENCES vagas(id)
    ON DELETE RESTRICT
);