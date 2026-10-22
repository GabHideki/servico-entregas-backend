const { PedidoView } = require('../view/PedidoView');

async function PedidoMenu(readlineInterface) {
    const view = new PedidoView(readlineInterface);
    let executando = true;

    try {
        while (executando) {
            console.log('\n===== SISTEMA DE PEDIDOS =====');
            console.log('1. Cadastrar pedido');
            console.log('2. Listar pedidos');
            console.log('3. Atualizar status do pedido');
            console.log('4. Deletar pedido');
            console.log('0. Voltar');

            const opcao = (await view.perguntar('Escolha uma opção: ')).trim();

            switch (opcao) {
                case '1':
                    await view.cadastrarPedido();
                    break;
                case '2':
                    await view.listarPedidos();
                    break;
                case '3':
                    await view.atualizarStatus();
                    break;
                case '4':
                    await view.deletarPedido();
                    break;
                case '0':
                    executando = false;
                    break;
                default:
                    console.log('Opção inválida! Escolha 1, 2, 3, 4 ou 0.');
            }
        }
    } catch (error) {
        console.error('Erro inesperado no menu de pedidos:', error.message);
    }
}

module.exports = { PedidoMenu };