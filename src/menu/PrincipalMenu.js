const { EstabelecimentoMenu } = require('./EstabelecimentoMenu');
const { ClienteMenu } = require('./ClienteMenu');
const { PedidoMenu } = require('./PedidoMenu');

async function PrincipalMenu(principalView) {
    let executando = true;

    try {
        while (executando) {
            console.log('\n===== SISTEMA DE ENTREGAS =====');
            console.log('1. Gerenciar estabelecimentos');
            console.log('2. Gerenciar Clientes');
            console.log('3. Gerenciar Pedidos');
            console.log('0. Sair');

            const opcao = (await principalView.perguntar('Escolha uma opção: ')).trim();

            switch (opcao) {
                case '1':
                    await EstabelecimentoMenu(principalView.rl);
                    break;
                case '2':
                    await ClienteMenu(principalView.rl);
                    break;
                case '3':
                    await PedidoMenu(principalView.rl);
                    break;
                case '0':
                    executando = false;
                    console.log('Encerrando o sistema...');
                    break;
                default:
                    console.log('Opção inválida! Escolha 1, 2, 3 ou 0.');
            }
        }
    } catch (error) {
        console.error('Erro inesperado:', error.message);
    } finally {
        principalView.fechar();
    }
}

module.exports = { PrincipalMenu };