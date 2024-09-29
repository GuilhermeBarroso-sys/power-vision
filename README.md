# Power Vision - Controle de Estoque

Este é um aplicativo de controle de estoque desenvolvido para a empresa Power Vision. O objetivo deste aplicativo é fornecer uma solução simples e eficiente para o gerenciamento de estoque de câmeras e equipamentos de segurança eletrônica. O aplicativo foi desenvolvido utilizando **React Native** com **Expo**, e utiliza um servidor **Node.js** com **PostgreSQL** para a persistência de dados.

## Funcionalidades

- Login de usuários com autenticação.
- Listagem dos produtos cadastrados no estoque.
- Criação de novos produtos com nome, descrição, preço e quantidade.
- Edição e atualização das informações dos produtos.
- Deleção de produtos do estoque.
- Exportação dos dados do estoque para um arquivo CSV.

## Tecnologias Utilizadas

- **React Native** (Expo)
- **TypeScript**
- **Node.js** (Backend)
- **PostgreSQL** (Banco de Dados)
- **Axios** (Para comunicação com o backend)
- **Expo Image Picker** (Para upload de imagens de produtos)

## Pré-requisitos

- **Node.js** instalado na máquina (v18 ou superior).
- **Expo CLI** instalado globalmente:
  ```
  npm install -g expo-cli
  ```
- **PostgreSQL** como banco de dados.
- **npm** ou **yarn** como gerenciador de pacotes.

## Instalação

1. Clone o repositório:
   ```
   git clone git@github.com:GuilhermeBarroso-sys/power-vision.git
   cd power-vision
   ```
   
2. Instale as dependências do projeto:
   ```
   npm install
   ```

3. Inicie o aplicativo Expo:
   ```
   cd app
   expo start
   ```

4. No terminal, escaneie o código QR com o aplicativo Expo Go para visualizar o aplicativo no seu dispositivo.


## Uso do Aplicativo

1. **Login**: O usuário deve se autenticar para acessar o sistema.
2. **Listagem de Produtos**: A tela inicial exibirá a lista de todos os produtos cadastrados no sistema.
3. **Adicionar Produto**: Use o botão "Adicionar Produto" para abrir o modal de cadastro de novos produtos.
4. **Editar Produto**: Selecione um produto para editar suas informações ou atualizar o estoque.
5. **Deletar Produto**: Utilize o ícone de lixeira para excluir um produto, com a confirmação de exclusão.
6. **Exportar Dados**: Há uma opção para exportar os dados do estoque como um arquivo CSV.

