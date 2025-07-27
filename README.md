# 💻 Sistema de Gerenciamento de Ativos de TI

Este projeto é uma aplicação web para controle e visualização de ativos de tecnologia da informação, como computadores, celulares, switches, access points e coletores. Utiliza autenticação e banco de dados com **Supabase** e foi desenvolvido com foco em uma interface fluida, moderna e responsiva.

## 🚀 Funcionalidades

- ✅ Login e Registro de usuários (via Supabase Auth)
- 🔐 Controle de permissões por **papéis de usuário** (`admin` e `user`)
- 📊 Dashboard dinâmico com contagem total de ativos
- 🖥️ Cadastro e listagem de:
  - Computadores
  - Celulares
  - Switches
  - Access Points (APs)
  - Coletores
- ✏️ Admins podem adicionar, editar e deletar ativos
- 👀 Usuários comuns podem apenas visualizar os ativos
- 🧠 Dados reais armazenados e consultados dinamicamente via Supabase
- 📅 Atualização automática de timestamps nas alterações

## 🧰 Tecnologias Utilizadas

- [React.js](https://reactjs.org/)
- [Supabase](https://supabase.com/) (Auth + Database + RLS)
- [Chakra UI](https://chakra-ui.com/) ou outro framework de UI (caso aplicável)
- [TypeScript](https://www.typescriptlang.org/) (opcional)

## 🛡️ Controle de Acesso

Utiliza Row Level Security (RLS) do Supabase com funções e políticas para garantir:

| Ação               | Admin | Usuário Comum |
|--------------------|:-----:|:-------------:|
| Visualizar ativos  | ✅    | ✅            |
| Cadastrar ativos   | ✅    | ❌            |
| Editar ativos      | ✅    | ❌            |
| Deletar ativos     | ✅    | ❌            |

🌐 Link do Deploy
https://infra-control-suite.lovable.app/login

