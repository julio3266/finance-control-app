# 💰 Finance Control App

Aplicativo mobile para controle financeiro pessoal desenvolvido com React Native e Expo.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Configuração](#configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Redux Persist](#redux-persist)
- [Navegação](#navegação)
- [Temas](#temas)
- [Desenvolvimento](#desenvolvimento)

## 🎯 Sobre o Projeto

Finance Control App é uma aplicação mobile para gerenciamento financeiro pessoal que permite aos usuários:

- Controlar receitas e despesas
- Visualizar extrato de transações
- Acompanhar investimentos
- Gerenciar saldo e balanço mensal
- Autenticação segura com OTP

## 🛠 Tecnologias

### Core
- **React Native** 0.81.5
- **React** 19.1.0
- **Expo** ~54.0.31
- **TypeScript** ~5.9.2

### Navegação
- **@react-navigation/native** ^6.1.18
- **@react-navigation/bottom-tabs** ^6.6.1
- **@react-navigation/native-stack** ^6.11.0

### Estado e Persistência
- **@reduxjs/toolkit** ^2.2.7
- **react-redux** ^9.2.0
- **redux-persist** ^6.0.0
- **@react-native-async-storage/async-storage** 2.2.0

### UI e Estilização
- **expo-linear-gradient** ^15.0.8
- **@expo/vector-icons** ^14.0.0
- **react-native-gesture-handler** ^2.30.0
- **react-native-svg** ^15.15.1

### Validação
- **zod** ^4.3.5

### Desenvolvimento
- **ESLint** ^9.39.2
- **Prettier** ^3.8.0
- **Husky** ^9.1.7
- **lint-staged** ^16.2.7

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (instalado globalmente)
- **Git**

Para desenvolvimento iOS:
- **Xcode** (macOS apenas)
- **CocoaPods**

Para desenvolvimento Android:
- **Android Studio**
- **JDK** 17 ou superior

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd finance-control-app
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Instale as dependências nativas (iOS)**
```bash
cd ios && pod install && cd ..
```

4. **Configure as variáveis de ambiente**
```bash
cp app/utils/env.example.ts app/utils/env.ts
# Edite app/utils/env.ts com suas configurações
```

## 📁 Estrutura do Projeto

```
finance-control-app/
├── app/
│   ├── modules/              # Módulos da aplicação
│   │   ├── auth/             # Módulo de autenticação
│   │   │   ├── components/   # Componentes de autenticação
│   │   │   ├── routes/       # Rotas de autenticação
│   │   │   ├── screens/      # Telas de autenticação
│   │   │   ├── slices/       # Redux slices
│   │   │   └── utils/        # Utilitários
│   │   ├── dashboard/        # Módulo Dashboard
│   │   ├── extract/          # Módulo Extrato
│   │   ├── expenses/         # Módulo Despesas
│   │   ├── incomes/          # Módulo Receitas
│   │   ├── investiments/     # Módulo Investimentos
│   │   ├── more/             # Módulo Mais/Configurações
│   │   └── Home/             # Componentes compartilhados
│   │       ├── components/   # Componentes reutilizáveis
│   │       ├── routes/       # Rotas principais
│   │       └── screens/     # Telas antigas (em migração)
│   ├── navigation/           # Configuração de navegação
│   ├── store/                # Redux store
│   │   ├── index.ts          # Configuração do store
│   │   ├── themeSlice.ts     # Slice de tema
│   │   └── financeSlice.ts   # Slice de finanças
│   ├── ui/                   # Componentes UI genéricos
│   ├── utils/                # Utilitários globais
│   ├── App.tsx               # Componente principal
│   └── navigation/           # AppNavigator
├── android/                  # Código nativo Android
├── ios/                      # Código nativo iOS
├── package.json
├── tsconfig.json
└── README.md
```

## ✨ Funcionalidades

### Autenticação
- ✅ Login com email e senha
- ✅ Autenticação OTP (One-Time Password)
- ✅ Bloqueio de conta após tentativas falhas
- ✅ Persistência de sessão
- ✅ Verificação automática de expiração de sessão

### Dashboard
- ✅ Visualização de balanço geral
- ✅ Cards de resumo financeiro
- ✅ Header animado com gradiente

### Extrato
- ✅ Visualização de transações
- ✅ Filtro por mês
- ✅ Cards de saldo atual e mensal
- ✅ Lista de transações com separadores de data

### Receitas e Despesas
- ✅ Adição de receitas
- ✅ Adição de despesas
- ✅ Acesso via FAB (Floating Action Button)

### Investimentos
- ✅ Acompanhamento de investimentos
- ✅ Visualização de portfólio

### Mais
- ✅ Configurações
- ✅ Perfil do usuário

### Temas
- ✅ Modo claro e escuro
- ✅ Persistência da preferência de tema
- ✅ Toggle de tema

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `app/utils/env.ts` baseado em `app/utils/env.example.ts`:

```typescript
export const ENV = {
  API_URL: 'https://www.api-qa.financecontrolapp.com.br',
  API_TIMEOUT: 30000,
  ENV: 'qa',
};
```

### Configuração do Redux Persist

O Redux Persist está configurado para persistir:

- **Auth**: token, email, expiresAt, isAuthenticated, isOnboardingQualified, otpAttempts, lockUntil
- **Theme**: mode (light/dark)

A persistência é feita usando `AsyncStorage` do React Native.

## 📜 Scripts Disponíveis

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar no Web
npm run web
```

## 🔄 Redux Persist

O projeto utiliza Redux Persist para manter o estado da aplicação entre reinicializações.

### Slices Persistidos

1. **Auth Slice**
   - Token de autenticação
   - Email do usuário
   - Data de expiração
   - Status de autenticação
   - Tentativas de OTP
   - Bloqueio de conta

2. **Theme Slice**
   - Modo do tema (light/dark)

### Verificação de Sessão

A aplicação verifica automaticamente se a sessão expirou:
- Ao reidratar o estado
- A cada minuto durante o uso

## 🧭 Navegação

A aplicação utiliza React Navigation com a seguinte estrutura:

### Stack Principal
- **Auth**: Rotas de autenticação
- **Home**: Rotas principais da aplicação

### Tab Navigator (Home)
- **Dashboard**: Tela principal
- **Extract**: Extrato de transações
- **Investiments**: Investimentos
- **More**: Configurações e mais opções

### Rotas Ocultas (via FAB)
- **Expenses**: Adicionar despesas
- **Incomes**: Adicionar receitas

### FAB Menu

O Floating Action Button (FAB) central permite:
- Adicionar receitas
- Adicionar despesas

## 🎨 Temas

O aplicativo suporta dois temas:

- **Light**: Tema claro
- **Dark**: Tema escuro

O tema é persistido e restaurado automaticamente ao reiniciar o app.

### Cores Principais

- **Primary**: Roxo (#7c3aed)
- **Success**: Verde (#22c55e)
- **Error**: Vermelho (#ef4444)
- **Warning**: Amarelo (#eab308)

## 🏗 Módulos

Cada funcionalidade está organizada em módulos independentes:

### Estrutura de um Módulo

```
module-name/
├── screens/          # Telas do módulo
│   └── ScreenName/
│       ├── index.tsx
│       └── styles.tsx
├── routes/          # Configuração de rotas
│   ├── moduleRoutes.tsx
│   └── index.ts
├── components/       # Componentes específicos (opcional)
├── slices/          # Redux slices (opcional)
├── utils/           # Utilitários (opcional)
└── index.ts         # Exports principais
```

### Módulos Disponíveis

1. **auth**: Autenticação e login
2. **dashboard**: Tela principal
3. **extract**: Extrato de transações
4. **expenses**: Gerenciamento de despesas
5. **incomes**: Gerenciamento de receitas
6. **investiments**: Investimentos
7. **more**: Configurações e mais opções

## 🧪 Desenvolvimento

### Linting e Formatação

O projeto utiliza:
- **ESLint** para linting
- **Prettier** para formatação
- **Husky** para git hooks
- **lint-staged** para linting pré-commit

### Git Hooks

Antes de cada commit, o código é automaticamente:
- Lintado com ESLint
- Formatado com Prettier

### Convenções de Código

- Use TypeScript para type safety
- Componentes em PascalCase
- Arquivos de estilo com sufixo `.styles.tsx`
- Exportações organizadas em `index.ts`

## 📱 Plataformas Suportadas

- ✅ iOS
- ✅ Android
- ✅ Web (parcial)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Autores

- **Equipe Finance Control App**

## 📞 Suporte

Para suporte, entre em contato através do email de suporte ou abra uma issue no repositório.

---

Desenvolvido com ❤️ usando React Native e Expo

