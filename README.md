# 🏋️‍♂️ Gymbro - Seu Parceiro de Treino

> "No pain, no gain." 💪

O **Gymbro** é uma aplicação móvel desenvolvida para gerenciamento de treinos de musculação e monitoramento de atividades cardiovasculares. O projeto foca em permitir que o usuário crie suas próprias fichas, registre exercícios personalizados e monitore corridas com GPS.

## 🚀 Funcionalidades

* **🔐 Autenticação Segura:** Login e Cadastro de usuários com Token (Django Auth).
* **📋 Gestão de Fichas:** Criação e organização de rotinas de treino (A, B, C...).
* **💪 Catálogo Híbrido de Exercícios:** * Exercícios Globais (Padrão do sistema).
    * Exercícios Customizados (Criados pelo próprio usuário).
* **🏃 Módulo Cardio:** Rastreamento de corridas com registro de tempo, distância e rota GPS.
* **📱 Interface Moderna:** Desenvolvido com Ionic Framework & Angular.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** Ionic 7, Angular, TypeScript.
* **Backend:** Python, Django REST Framework (API Integrada).
* **Armazenamento:** SQLite (Dev) / PostgreSQL (Prod).
* **Integração:** HTTP Client, Geolocation API.

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
* Node.js e npm instalados.
* Ionic CLI instalado globalmente (`npm install -g @ionic/cli`).
* Backend API rodando localmente (Django).

### Passos
1.  Clone o repositório:
    ```bash
    git clone [https://github.com/DaviCuscuz/Gymbro.git](https://github.com/DaviCuscuz/Gymbro.git)
    ```
2.  Entre na pasta do projeto:
    ```bash
    cd Gymbro
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  Configure o ambiente (se necessário, ajuste o IP da API em `src/environments/environment.ts`).
5.  Rode a aplicação:
    ```bash
    ionic serve
    ```

## 🤝 Contribuição

Este é um projeto acadêmico/pessoal. Sugestões e PRs são bem-vindos!

---
Desenvolvido por **DaviCuscuz** 🚀