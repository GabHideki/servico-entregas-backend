const { PrincipalView } = require('./view/PrincipalView');
const { PrincipalMenu } = require('./menu/PrincipalMenu');

async function main() {
    const principalView = new PrincipalView();
    await PrincipalMenu(principalView);
}

main();