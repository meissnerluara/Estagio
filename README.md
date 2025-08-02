# patologIA

Plataforma educacional desenvolvida como trabalho de estágio do 7º semestre do curso de Sistemas de Informação da Universidade de Mogi das Cruzes (UMC).
Voltada para estudantes e professores da área da saúde, com foco em exames de imagem médica, questões de múltipla escolha e apoio de Inteligência Artificial para diagnósticos.

## Funcionalidades
- Cadastro e login de alunos e professores
- Professores podem cadastrar exames com imagens, criar perguntas e montar questionários personalizados
- Alunos podem responder questionários, visualizar resultados e reforçar conhecimentos
- Correção automática das respostas e cálculo de pontuação
- Visualização de respostas dos alunos por questionário
- Análise de imagens médicas com IA
- Interface intuitiva e responsiva

## Tecnologias Utilizadas
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Autenticação:** JWT
- **Upload de arquivos:** Multer
- **Integração IA:** Python (executado via backend)

## Estrutura do Projeto
```
patologia-frontend/   # Aplicação React (interface do usuário)
patologia-backend/    # API Node.js/Express, scripts de IA e banco de dados
```

## Como rodar o projeto

1. **Pré-requisitos:**
   - Node.js (18+)
   - npm
   - PostgreSQL
   - Python 3 (para scripts de IA)

2. **Clone o repositório:**
   ```bash
   git clone https://github.com/meissnerluara/patologia-backend.git
   ```

3. **Siga as instruções dos READMEs em cada pasta (`patologia-frontend` e `patologia-backend`) para instalar dependências, configurar variáveis de ambiente e rodar o projeto.**

## Licença
Este projeto é open source, sob a licença MIT.
