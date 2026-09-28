class CreditoAluno{
    constructor(id, id_aluno, saldo){
        this.id_conta_credito = id;
        this.id_aluno = id_aluno;
        this.saldo = saldo;
    }
}

// const creditoAluno = new CreditoAluno(
//     "1",
//     "1",
//     "R$100"
// );

// console.log(creditoAluno);


module.exports= CreditoAluno;