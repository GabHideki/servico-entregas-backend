# 🛵 Sistema de Entregas (CLI)

Sistema de gerenciamento de entregas via linha de comando (CLI) desenvolvido em Node.js e MongoDB. O sistema possui arquitetura modularizada com divisão clara entre camada de apresentação, modelos, serviços de banco de dados e controle de navegação interativa via terminal.

## 🏗️ Arquitetura do Projeto

O projeto é estruturado em camadas inspiradas no padrão **MVC (Model-View-Controller)** adaptado para CLI:

```
src/
├── index.js                # Ponto de entrada principal da aplicação
├── config/
│   └── database.js         # Gerenciamento de conexão com o MongoDB
├── models/
│   ├── Cliente.js          # Modelo e validações do Cliente
│   ├── Estabelecimento.js  # Modelo e validações do Estabelecimento
│   ├── Produto.js          # Modelo e validações do Produto
│   └── Pedido.js           # Modelo e validações do Pedido (com itens e status)
├── services/
│   ├── ClienteService.js   # Regras de negócio e CRUD de Clientes
│   ├── EstabelecimentoService.js # Regras de negócio e CRUD de Estabelecimentos
│   ├── ProdutoService.js   # Operações de Produtos filtradas por Estabelecimento
│   └── PedidoService.js    # Criação, validação cruzada e gestão de Pedidos
├── view/
│   ├── PrincipalView.js    # Interface readline principal da aplicação
│   ├── ClienteView.js      # Interação via terminal para Clientes
│   ├── EstabelecimentoView.js # Interação via terminal para Estabelecimentos
│   ├── ProdutoView.js      # Interação via terminal para Produtos
│   └── PedidoView.js       # Montagem interativa e exibição de Pedidos
├── menu/
│   ├── PrincipalMenu.js    # Menu raiz do sistema
│   ├── ClienteMenu.js      # Submenu de Clientes
│   ├── EstabelecimentoMenu.js # Submenu de Estabelecimentos
│   ├── ProdutoMenu.js      # Submenu de Produtos (escopo do Estabelecimento)
│   └── PedidoMenu.js       # Submenu de Pedidos
└── utils/
    └── logger.js           # Gravador de logs de exceções em arquivo
```

## 🚀 Tecnologias Utilizadas

* **Node.js** (v18+)
* **MongoDB** (Driver oficial `mongodb`)
* **Readline / Promises** (Leitura de dados assíncrona no terminal)

## 📌 Funcionalidades

### 👥 Clientes
* Cadastrar cliente (com validação de formato de e-mail e campos obrigatórios).
* Listar clientes.
* Atualizar cliente por ID.
* Deletar cliente por ID.

### 🏢 Estabelecimentos & 🍕 Produtos (Submenu)
* Cadastrar, listar, atualizar e deletar estabelecimentos.
* **Gerenciar Produtos de um Estabelecimento (Submenu):**
  * Seleção de um estabelecimento específico para gerenciar seu cardápio.
  * Cadastro de produtos vinculados diretamente ao ID do estabelecimento.
  * Listagem, atualização e exclusão restritas ao contexto do estabelecimento selecionado.

### 🛒 Pedidos
* **Cadastro Interativo de Pedidos:**
  * Opção de listar clientes cadastrados durante o fluxo de criação.
  * Opção de listar estabelecimentos disponíveis.
  * Exibição dos produtos vinculados **exclusivamente** ao estabelecimento selecionado.
  * Adição de múltiplos itens com cálculo automático de subtotal e valor total do pedido.
* **Gerenciamento de Status:**
  * Alteração de status (`pendente`, `preparando`, `enviado`, `concluido`, `cancelado`).
* Listagem formatada com detalhes dos itens e datas.
* Exclusão de pedidos por ID.

## ⚙️ Pré-requisitos

1. **Node.js** instalado.
2. Instância do **MongoDB** em execução na porta padrão (`mongodb://localhost:27017`).
   > ℹ️ **Nota:** Caso o MongoDB já esteja rodando em segundo plano (como serviço do Windows, via Docker ou MongoDB Compass), **não é necessário** rodar o comando `mongod` manualmente.

## 🛠️ Como Executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Certifique-se de que o serviço do MongoDB está ativo na sua máquina.

3. Inicie a aplicação executando:
   ```bash
   npm start
   ```
   > *(Ou alternativamente executando diretamente: `node src/index.js`)*

## 📝 Logs de Erro

Exceções e falhas operacionais são gravadas no arquivo local:
```
logs/app.log
```