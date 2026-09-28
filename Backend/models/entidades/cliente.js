class Cliente{
    constructor(id, nome, tipo, telefone, observacoes, ativo, data){
        
        this.id_cliente = id;
        this.nome = nome;
        this.tipo_cliente = tipo;
        this.telefone = telefone;
        this.observacoes = observacoes;
        this.ativo = ativo;
        this.data_cadastro = data;
    }
}

// const cliente = new Cliente(
//     "1",
//     "Camilly",
//     "Aluno",
//     "123456",
//     "3A",
//     "Responsável",
//     "11999999999"
// );

// console.log(cliente);

module.exports = Cliente;