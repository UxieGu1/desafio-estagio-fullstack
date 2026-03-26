# TeamGuide - Gestão de Vagas e Candidaturas <br> (Desafio Full Stack)

Este projeto foi desenvolvido como solução para o desafio técnico de Estágio em Desenvolvimento Full Stack da **TeamGuide**. A aplicação consiste num sistema de gestão de vagas internas e candidaturas, onde o comportamento de um módulo impacta diretamente o outro (ex: não é possível candidatar-se a uma vaga encerrada).

## O que foi entregue?

Foquei em entregar não apenas os requisitos obrigatórios, mas também em explorar ao máximo a lista de diferenciais (bônus) propostos no edital, garantindo um código limpo, testado e fácil de rodar.

### Funcionalidades e Diferenciais Alcançados
- ✅ **CRUD Completo:** Criação, listagem, edição e exclusão nos dois módulos (Vagas e Candidaturas).
- ✅ **Regras de Negócio Rígidas:** Bloqueio de candidaturas em vagas com status `CLOSED`, gerido através de exceções customizadas no Back-end (`BusinessRuleException`).
- ✅ **Dashboard Analítico:** Gráficos interativos (Pizza e Barras) implementados no Front-end para visualizar o status das vagas e as posições mais concorridas.
- ✅ **Consultas SQL Manuais Avançadas:** Implementação de múltiplas queries manuais nativas com `JOIN`, `GROUP BY` e `ORDER BY` (ex: ranking de vagas com mais candidatos).
- ✅ **Paginação no Servidor:** Listagem de vagas paginada diretamente no banco de dados (`PageRequest` do Spring Data).
- ✅ **Filtros Dinâmicos:** Pesquisa de vagas por título.
- ✅ **UX/UI Aprimorada:** Uso de Material-UI v4 com melhorias visuais, estados vazios (Empty States), feedbacks visuais com Snackbars (Sucesso/Erro) e Tooltips.
- ✅ **Testes Automatizados:** Testes unitários no Back-end com JUnit 5 e Mockito, cobrindo as principais regras de negócio.
- ✅ **Infraestrutura via Docker:** Ficheiro `docker-compose.yml` configurado para levantar a base de dados PostgreSQL com um único comando, sem necessidade de instalações locais complexas.

---

## Tecnologias Utilizadas

**Front-end:**
- React
- Vite
- TypeScript
- Material-UI (MUI v4)
- React Query
- React Router Dom
- Recharts (para os gráficos do Dashboard)

**Back-end:**
- Java 21
- Spring Boot
- Spring Data JDBC
- PostgreSQL
- JUnit 5 & Mockito (Testes Automatizados)
- Lombok
- Validation

**Infraestrutura:**
- Docker & Docker Compose

---

## 🐳 Como rodar o projeto localmente

A arquitetura foi pensada para garantir a melhor experiência de desenvolvimento (DevEx). Siga os passos abaixo:

### 1. Subir o Banco de Dados (Docker)
Na raiz do projeto, abra o seu terminal e execute:
```bash
docker-compose up -d
```

### 2. Iniciar o Back-end (Spring Boot)
Navegue até a pasta do back-end e rode a aplicação com sua IDE ou pelo terminal:
```bash
mvn spring-boot:run
```

### 3. Iniciar o Front-end (React)
Em outro terminal, navegue até a pasta do front-end e execute:

```bash
npm install
npm run dev
```
Acesse http://localhost:5173 (ou a porta indicada no terminal) no seu navegador.

---
### Como rodar os Testes Automatizados
Os testes unitários foram focados em validar as regras de negócio essenciais (ex: impedir candidaturas em vagas fechadas) de forma isolada do banco de dados.

Para executar os testes, abra o terminal na pasta do Back-end e rode:

```bash
mvn test
```
(Ou execute diretamente através do painel de testes da sua IDE).

---

## O que eu faria numa próxima etapa (Próximos Passos)
Para manter o escopo alinhado ao tempo do desafio, algumas melhorias foram mapeadas para o futuro:

- **Autenticação e Autorização:** Implementar JWT (JSON Web Tokens) para separar a visão de "Administrador/RH" da visão de "Candidato".
- **Filtros Avançados:** Adicionar filtros por Área e Nível de Senioridade na listagem de vagas.
- **Soft Delete:** Ao invés de excluir vagas do banco de dados definitivamente, implementar uma flag de is_deleted para manter o histórico de dados analíticos intacto.
- **CI/CD:** Criar uma pipeline no GitHub Actions para rodar os testes automaticamente a cada Push.
