const { ClienteView } = require('../view/ClienteView');

async function ClienteMenu(readlineInterface) {
    const menu = new ClienteView(readlineInterface);
    let executando = true;

    try {
        while (executando) {
            console.log('\n===== SISTEMA DE CLIENTES =====');
            console.log('1. Cadastrar cliente');
            console.log('2. Listar clientes');
            console.log('3. Atualizar cliente');
            console.log('4. Deletar cliente');
            console.log('0. Voltar');

            const opcao = (await menu.perguntar('Escolha uma opção: ')).trim();

            switch (opcao) {
                case '1':
                    await menu.cadastrarCliente();
                    break;
                case '2':
                    await menu.listarClientes();
                    break;
                case '3':
                    await menu.atualizarCliente();
                    break;
                case '4':
                    await menu.deletarCliente();
                    break;
                case '0':
                    executando = false;
                    break;
                default:
                    console.log('Opção inválida! Tente novamente.');
            }
        }
    } catch (error) {
        console.error('Erro inesperado no menu de clientes:', error.message);
    }
}

module.exports = { ClienteMenu };