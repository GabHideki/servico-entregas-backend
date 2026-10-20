class Cliente {
    constructor(id = null, nome, telefone, email, endereco) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.endereco = endereco;
    }

    validar() {
        if (typeof this.nome !== 'string' || this.nome.trim() === '') {
            throw new Error('Campo "nome" é obrigatório.');
        }

        if (typeof this.telefone !== 'string' || this.telefone.trim() === '') {
            throw new Error('Campo "telefone" é obrigatório.');
        }

        if (
            typeof this.email !== 'string' ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())
        ) {
            throw new Error('Campo "email" é obrigatório e deve ser válido.');
        }

        if (typeof this.endereco !== 'string' || this.endereco.trim() === '') {
            throw new Error('Campo "endereco" é obrigatório.');
        }
    }
}

module.exports = { Cliente };
