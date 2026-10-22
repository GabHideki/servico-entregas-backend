class Estabelecimento{
    constructor(id = null, nome, categoria, telefone, endereco ){
        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    validar() {
        if (typeof this.nome !== 'string' || this.nome.trim() === '') {
            throw new Error('Campo "nome" é obrigatório.');
        }

        if (typeof this.categoria !== 'string' || this.categoria.trim() === '') {
            throw new Error('Campo "categoria" é obrigatório.');
        }

        if (typeof this.telefone !== 'string' || this.telefone.trim() === '') {
            throw new Error('Campo "telefone" é obrigatório.');
        }

        if (typeof this.endereco !== 'string' || this.endereco.trim() === '') {
            throw new Error('Campo "endereco" é obrigatório.');
        }
    }
}

module.exports = { Estabelecimento };