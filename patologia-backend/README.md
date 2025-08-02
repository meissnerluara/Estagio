# patologIA - Backend

Este é o backend da plataforma **patologIA**, responsável pela API, autenticação, lógica de negócio, integração com IA e acesso ao banco de dados.

## Tecnologias Utilizadas

- Node.js
- Express
- Prisma ORM
- PostgreSQL (banco de dados, hospedado no Supabase ou outro)
- JWT (autenticação)
- Multer (upload de arquivos)
- Integração com scripts Python para IA (monai, torch, etc.)

## Funcionalidades

- Cadastro e login de alunos e professores
- CRUD de exames, perguntas, questionários e respostas
- Upload e armazenamento de imagens médicas
- Correção automática e cálculo de pontuação
- Integração com modelos de IA para análise de imagens
- API RESTful para consumo pelo frontend

## Como rodar o backend

1. **Pré-requisitos:**
   - Node.js (versão 18 ou superior)
   - npm
   - PostgreSQL
   - Python 3 (para scripts de IA, se necessário)

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o banco de dados:**
   - Crie um banco PostgreSQL
   - Configure a variável `DATABASE_URL` no arquivo `.env`

4. **Execute as migrações do Prisma:**
   ```bash
   npx prisma migrate dev
   ```

5. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

## Estrutura de Pastas

```
patologia-backend/
├── ai-models/           # Scripts Python para IA
├── monai-bundles/       # Modelos e configs de IA
├── prisma/              # Configuração do Prisma
│   ├── schema.prisma    # Esquema do banco
│   └── migrations/      # Migrações
├── src/                 # Código-fonte Node.js
│   ├── config/          # Configurações
│   ├── controllers/     # Lógica das rotas
│   ├── middlewares/     # Middlewares
│   ├── routes/          # Rotas da API
│   ├── services/        # Serviços de negócio
│   ├── uploads/         # Arquivos enviados
│   └── utils/           # Utilitários
├── package.json         # Dependências e scripts
└── README.md            # Documentação do backend
```

## Observações
- Certifique-se de que o banco de dados esteja acessível e as variáveis de ambiente estejam corretas.
- Para rodar scripts de IA, o Python e as dependências necessárias devem estar instalados no servidor.
- O backend deve ser iniciado antes do frontend para garantir o funcionamento completo da plataforma.
