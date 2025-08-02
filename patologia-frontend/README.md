# patologIA - Frontend

Este é o frontend da plataforma **patologIA**, uma aplicação educacional para estudantes e professores da área da saúde, focada em exames de imagem médica, questões de múltipla escolha e apoio de Inteligência Artificial para diagnósticos.

## Tecnologias Utilizadas

- React
- Vite
- Tailwind CSS
- Axios (requisições HTTP)
- react-toastify (notificações)

## Funcionalidades

- Interface intuitiva e responsiva
- Cadastro e login de alunos e professores
- Visualização e resposta de questionários
- Visualização de resultados
- Upload de imagens médicas
- Consumo de API do backend

## Como rodar o frontend

1. **Pré-requisitos:**
   - Node.js (versão 18 ou superior)
   - npm

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse o aplicativo:**
   - Abra o navegador e vá para `http://localhost:3000`

## Estrutura de Pastas

```
patologia-frontend/
├── public/           # Arquivos públicos (index.html, imagens)
├── src/              # Código-fonte React
│   ├── assets/       # Imagens e arquivos estáticos
│   ├── components/   # Componentes reutilizáveis
│   ├── contexts/     # Contextos globais (ex: Auth)
│   ├── pages/        # Páginas do aplicativo
│   ├── services/     # Serviços de API
│   ├── styles/       # Estilos globais e módulos CSS
│   └── App.jsx       # Componente principal
├── package.json      # Dependências e scripts
└── README.md         # Documentação do frontend
```

## Observações
- O frontend consome a API do backend, portanto, certifique-se de que o backend esteja rodando e a URL da API esteja configurada corretamente.