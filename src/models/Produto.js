class Produto {
    constructor(id = null, estabelecimentoId, nome, preco, descricao) {
        this.id = id;
        this.estabelecimentoId = estabelecimentoId;
        this.nome = nome;
        this.preco = preco;
        this.descricao = descricao;
    }

    validar() {
        if (typeof this.nome !== 'string' || this.nome.trim() === '') {
            throw new Error('Campo "nome" é obrigatório.');
        }
        if (typeof this.preco !== 'number' || !Number.isFinite(this.preco) || this.preco <= 0) {
            throw new Error('O preço deve ser um número positivo.');
        }
        if (typeof this.descricao !== 'string' || this.descricao.trim() === '') {
            throw new Error('Campo "descricao" é obrigatório.');
        }
    }
}

module.exports = { Produto };