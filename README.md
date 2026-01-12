# Econet Challenge

## 📑 Sumário

- [🚀 Tecnologias Utilizadas](#🚀-tecnologias-utilizadas)
- [🛠️ Como Rodar o Projeto](#🛠️-como-rodar-o-projeto)
- [📂 Estrutura de Pastas](#📂estrutura-de-pastas)
- [📋 Funcionalidades Implementadas](#📋-funcionalidades-implementadas)
- [🧪 O que testar](#🧪-o-que-testar)
- [📝 Observações Técnicas](#📝-observações-técnicas)

## 🏢 Gerenciador de Empresas e Usuários (Vue 3)

Este projeto é um desafio técnico de frontend focado no gerenciamento de empresas e seus respectivos usuários. A aplicação foi construída utilizando Vue 3 com a Composition API.

### Emblemas

![linux]
![pnpm]
![vue]
![vite]
![axios]
![typescript]
![json-server]

## 🚀 Tecnologias Utilizadas

- Vue 3 (Script Setup & Composition API);
- Vite (Build tool);
- Vue Router (Gerenciamento de rotas);
- Axios (Consumo de API);
- JSON Server (API Fake).

## 🛠️ Como rodar o projeto

1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

2. Instalar dependências

```bash
pnpm install
```

3. Criar e configurar o `.env` (use o `.env.example` para saber quais variáveis usar)

4. Executar o Backend

Abra em um terminal separado e rode o comando abaixo:

```bash
pnpm run backend
```

4. Executar o Frontend

Abra em um terminal separado e rode o comando abaixo:

```bash
pnpm run dev
```

Acesse a URL exibida no terminal (geralmente http://localhost:5173).

## 📂 Estrutura de Pastas

O projeto segue uma estrutura modular para facilitar a manutenção:

- `src/assets`: Imagens e Favicons.
- `src/components`: Componentes reutilizáveis como Modais, Alertas e telas de Carregamento.
- `src/enums`: Conjunto de valores para os Cargos dos Usuários.
- `src/interfaces`: Interfaces para as classes e atributos de Usuário e Empresa.
- `src/plugins`: Configurações do Axios.
- `src/routers`: Rotas para as telas.
- `src/views`: Telas principais (Listagem, Formulário, Detalhes).

## 🧪 O que testar

Ao rodar a aplicação, você pode validar os seguintes fluxos obrigatórios:

- Listagem de Empresas: Verifique o loading state ao carregar e a paginação ao final da tabela.
- Cadastro: Tente salvar uma empresa sem nome ou com CNPJ incompleto para ver a validação visual.
- Edição: Altere o status de uma empresa de "Ativa" para "Inativa" e salve.
- Detalhes e Usuários:
  - Entre nos detalhes de uma empresa.
  - Abra o modal e adicione um usuário.
  - Remova um usuário e veja a lista atualizar automaticamente.

## 📝 Observações Técnicas

- Validação de CNPJ: Foi implementada uma lógica de validação de formato e tamanho.
- Persistência: Todas as operações (Create, Read, Update, Delete) estão integradas via Axios com o banco de dados fake.

[linux]: https://img.shields.io/badge/Linux-%230e121d?logo=linux&logoColor=white
[typescript]: https://img.shields.io/badge/TypeScript-white?logo=typescript&logoColor=blue
[vue]: https://img.shields.io/badge/Vue%203-%2334495e?logo=vue.js
[pnpm]: https://img.shields.io/badge/pnpm-white?logo=pnpm
[axios]: https://img.shields.io/badge/Axios-white?logo=axios&logoColor=purple
[vite]: https://img.shields.io/badge/Vite-purple?logo=vite&logoColor=yellow
[json-server]: https://img.shields.io/badge/JSON%20Server-grey?logo=json&logoColor=yellow
