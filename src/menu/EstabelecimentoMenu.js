const { EstabelecimentoView } = require('../view/EstabelecimentoView');

async function EstabelecimentoMenu(readlineInterface) {
    const view = new EstabelecimentoView(readlineInterface);
    let executando = true;

    try {
        while (executando) {
            console.log('\n===== SISTEMA DE ESTABELECIMENTOS =====');
            console.log('1. Cadastrar estabelecimento');
            console.log('2. Listar estabelecimentos');
            console.log('3. Atualizar estabelecimento');
            console.log('4. Deletar estabelecimento');
            console.log('5. Gerenciar produtos do estabelecimento');
            console.log('0. Voltar');

            const opcao = (await view.perguntar('Escolha uma opção: ')).trim();

            switch (opcao) {
                case '1':
                    await view.cadastrarEstabelecimento();
                    break;
                case '2':
                    await view.listarEstabelecimentos();
                    break;
                case '3':
                    await view.atualizarEstabelecimento();
                    break;
                case '4':
                    await view.deletarEstabelecimento();
                    break;
                case '5':
                    await view.gerenciarProdutosDoEstabelecimento();
                    break;
                case '0':
                    executando = false;
                    break;
                default:
                    console.log('Opção inválida! Escolha 1, 2, 3, 4, 5 ou 0.');
            }
        }
    } catch (error) {
        console.error('Erro inesperado no menu de estabelecimentos:', error.message);
    }
}

module.exports = { EstabelecimentoMenu };