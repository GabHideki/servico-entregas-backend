class Produto{
    constructor(id = null, estabelecimentoId, nome, preco, descricao){
        this.id = id;
        this.estabelecimentoId = estabelecimentoId;
        this.nome = nome;
        this.preco = preco;
        this.descricao = descricao;
    }

    validar(){
        if (!this.nome || this.nome.trim() === '' || typeof this.nome !== 'string') {
            throw new Error('Campo "nome" é obrigatório.');
        }
        if (!this.preco || typeof this.preco !== 'number' || this.preco <= 0) {
            throw new Error('Campo "preco" é obrigatório e deve ser um número positivo.');
        }
        if (!this.descricao || this.descricao.trim() === '' || typeof this.descricao !== 'string') {
            throw new Error('Campo "descricao" é obrigatório.');
        }
    }
}

module.exports = { Produto };