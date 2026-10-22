class Pedido {
    constructor(id = null, clienteId, estabelecimentoId, itens, status = 'pendente', dataCriacao = new Date(), dataAtualizacao = new Date()) {
        this.id = id;
        this.clienteId = clienteId;
        this.estabelecimentoId = estabelecimentoId;
        this.itens = itens;
        this.status = status;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
    }

    validar() {
        if (typeof this.clienteId !== 'number' || !Number.isInteger(this.clienteId) || this.clienteId <= 0) {
            throw new Error('Campo "clienteId" é obrigatório e deve ser um ID válido.');
        }

        if (typeof this.estabelecimentoId !== 'number' || !Number.isInteger(this.estabelecimentoId) || this.estabelecimentoId <= 0) {
            throw new Error('Campo "estabelecimentoId" é obrigatório e deve ser um ID válido.');
        }

        if (!Array.isArray(this.itens) || this.itens.length === 0) {
            throw new Error('Campo "itens" é obrigatório e deve ser uma lista não vazia.');
        }

        for (const item of this.itens) {
            if (typeof item.produtoId !== 'number' || !Number.isInteger(item.produtoId) || item.produtoId <= 0) {
                throw new Error('Cada item do pedido deve conter um "produtoId" válido.');
            }
            if (typeof item.quantidade !== 'number' || !Number.isInteger(item.quantidade) || item.quantidade <= 0) {
                throw new Error('Cada item do pedido deve conter uma "quantidade" inteira positiva.');
            }
        }

        if (typeof this.status !== 'string' || this.status.trim() === '') {
            throw new Error('Campo "status" é obrigatório.');
        }
    }
}

module.exports = { Pedido };