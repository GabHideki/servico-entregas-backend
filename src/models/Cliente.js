class Cliente{
    constructor(id = null, nome, telefone, email, endereco ){
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.endereco = endereco;
    }

    validar(){
        if (!this.nome || this.nome.trim() === '' || typeof this.nome !== 'string') {
            throw new Error('Campo "nome" é obrigatório.');
        }
        if (!this.email || !this.email.includes('@') || typeof this.email !== 'string') {
            throw new Error('Campo "email" é obrigatório e deve ser válido.');
        }
        if (!this.endereco || this.endereco.trim() === '' || typeof this.endereco !== 'string') {
            throw new Error('Campo "endereco" é obrigatório.');
        }
    }
}

module.exports = { Cliente };