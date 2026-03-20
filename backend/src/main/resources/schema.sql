--Tabela de vagas:
CREATE TABLE IF NOT EXISTS tb_vagas{
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    area VARCHAR(150) NOT NULL,
    tipo VARCHAR(50) NOT NULL, --ex: estagio, junior e pleno
    status VARCHAR(50) NOT NULL DEFAULT 'aberta' -- ex: aberta e fechada
};

