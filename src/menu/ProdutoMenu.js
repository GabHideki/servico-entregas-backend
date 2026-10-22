const { ProdutoView } = require('../view/ProdutoView');

async function ProdutoMenu(estabelecimento, readlineInterface) {
    const view = new ProdutoView(readlineInterface);
    let executando = true;

    while (executando) {
        console.log(`\n===== GERENCIAR PRODUTOS (${estabelecimento.nome.toUpperCase()}) =====`);
        console.log('1. Cadastrar produto');
        console.log('2. Listar produtos');
        console.log('3. Atualizar produto');
        console.log('4. Deletar produto');
        console.log('0. Voltar ao menu de Estabelecimentos');

        const opcao = (await view.perguntar('Escolha uma opção: ')).trim();

        switch (opcao) {
            case '1':
                await view.cadastrarProduto(estabelecimento);
                break;
            case '2':
                await view.listarProdutos(estabelecimento);
                break;
            case '3':
                await view.atualizarProduto(estabelecimento);
                break;
            case '4':
                await view.deletarProduto(estabelecimento);
                break;
            case '0':
                executando = false;
                break;
            default:
                console.log('Opção inválida! Escolha 1, 2, 3, 4 ou 0.');
        }
    }
}

module.exports = { ProdutoMenu };