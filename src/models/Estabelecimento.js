class Estabelecimento{
    constructor(id = null, nome, categoria, telefone, endereco ){
        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    validar(){
        if (!this.nome || this.nome.trim() === '' || typeof this.nome !== 'string') {
            throw new Error('Campo "nome" é obrigatório.');
        }
        if (!this.categoria || this.categoria.trim() === '' || typeof this.categoria !== 'string') {
            throw new Error('Campo "categoria" é obrigatório.');
        }
        if (!this.endereco || this.endereco.trim() === '' || typeof this.endereco !== 'string') {
            throw new Error('Campo "endereco" é obrigatório.');
        }
        if(!this.telefone || this.telefone.trim() === '' || typeof this.telefone !== 'string') {
            throw new Error('Campo "telefone" é obrigatório.');
        }
    }
}

module.exports = { Estabelecimento };