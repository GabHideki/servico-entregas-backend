const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
const logFile = path.join(logDir, 'app.log');

class Logger {
    static error(operacao, error) {
        const data = new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
        });

        const tipo = error?.name || 'Error';
        const mensagem = error?.message || String(error);
        const causa = error?.cause?.message;
        const registro = [
            `[${data}]`,
            `TIPO: ${tipo}`,
            `OPERAÇÃO: ${operacao}`,
            `MENSAGEM: ${mensagem}`,
            ...(causa ? [`CAUSA: ${causa}`] : []),
            '----------------------------------------',
            ''
        ].join('\n');

        try {
            fs.mkdirSync(logDir, { recursive: true });
            fs.appendFileSync(logFile, registro, 'utf8');
        } catch (logError) {
            console.error('Falha ao gravar arquivo de log:', logError.message);
        }
    }
}

module.exports = { Logger };
