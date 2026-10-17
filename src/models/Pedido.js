class Pedido{
    constructor(id = null, clienteId, estabelecimentoId, itens, status = 'pendente', dataCriacao = new Date(), dataAtualizacao = new Date()){
        this.id = id;
        this.clienteId = clienteId;
        this.estabelecimentoId = estabelecimentoId;
        this.itens = itens;
        this.status = status;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
    }

    validar(){
        if (!this.clienteId) {
            throw new Error('Campo "clienteId" é obrigatório.');
        }
        if (!this.estabelecimentoId) {
            throw new Error('Campo "estabelecimentoId" é obrigatório.');
        }
        if (!this.itens || !Array.isArray(this.itens) || this.itens.length === 0) {
            throw new Error('Campo "itens" é obrigatório e deve ser uma lista não vazia.');
        }
    }
}

module.exports = { Cliente };