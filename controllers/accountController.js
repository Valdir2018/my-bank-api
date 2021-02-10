import express from 'express';
import { accountModel  }  from '../models/accountModels.js';

const Account = accountModel;

const app = express();

// // EndPoint 3 => consultar conta e agencia
const checkBalance = async (req, res) => {
      const agency  = req.params.agencia;
      const account = req.params.conta;

      try {
        const accounts = await Account.find({ agencia: agency, conta: account});
        res.send(accounts);
      } catch(err) {
        res.status(500).send("Erro ao tentar localizar essa conta");
      } 
};

// EndPoint 4 => método para depositar
const deposit = async (req, res) => {
    const account = req.body;

    try {
        let newDeposit = await getAccount(account);
        newDeposit.balance += account.balance;
        // crio uma nova instância  de account
        newDeposit = new Account(newDeposit);
        // Salvo o valor no Banco de Dados
        await newDeposit.save();
        // retorno o saldo atualizado    
        res.send(newDeposit);
    
    } catch(error) {
        res.status(500).send("Erro ao depositar " + error);
    }

};

// EndPoint 5 =>  registrar um saque
const toWithdraw = async (req, res) => {
    const account = req.body;
    try {
        
        let newDrawMoney = await getAccount(account);
        newDrawMoney.balance -= account.balance + 1; // debita valor + taxa de 1
        if (newDrawMoney.balance < 0) {
            throw new Error('Saldo Insuficiente !');
        }
        newDrawMoney = new Account(newDrawMoney);
        await newDrawMoney.save();
        res.send(newDrawMoney);

    } catch(error) {
        res.send(error.message);
        console.log(error.message);
    }

};


// EndPoint 6 =>  consultar saldo da conta => questao 6
const getBalance =  async (req, res) => {
    const agencia  = req.params.agencia;
    const conta    = req.params.conta;

    try {
        const account = await Account.find({ agencia, conta });
        if (!account) {
            throw new Error("Conta inválida");
        } else {
            account.map(conta => {
              console.log(" Balance: ", conta.balance);
            });
        }
    } catch(err) {
       res.status(500).send("Error");
    }

}

/**
 * 
 * @param {*} account valida se a agencia e conta existe
 */
const getAccount = async(account) => {
    /**
     * Traz apenas agencia e conta do BD
     */
    const { agencia, conta } = account;
    account = { agencia, conta };
    try {

        if (typeof account.agencia !== 'undefined') {
            account = await Account.findOne(account);
        } else {
            account = await Account.findOne({ conta: account.conta });
        }

        if (!account) {
            throw new Error(`(${agencia}/${conta}) agencia/conta invalida `);
        }
        return account;
    } catch(error) {
      throw Error(error.message);
    }
}

// EndPoint 7 =>  Exclui uma conta e retorna o total de contas ativas p/ a agencia informada
const removeAccount = async (req, res) => {
   const account = req.body;
   
   try {
      let deleteAccount = await getAccount(account );
      await Account.findByIdAndRemove({ _id: deleteAccount._id });
      const accountNumber = await Account.find({ agencia: deleteAccount.agencia }).countDocuments();
      res.send({ totalAccounts: accountNumber });
     
   } catch(error) {
      res.send(error.message);
   }
};

// EndPoint 8 => realizar transferências entre contas.
const transferBalance = async (req, res) => {
    const account =  req.body;
    const transferMoney = account.valor;

    try {
         let sourceAccount = await getAccount({ conta: account.contaOrigem });
         let targetAccount = await getAccount({ conta: account.contaDestino });

         // Valida cobrança de taxa para efetuar a transferencia
         if (sourceAccount.agencia !== targetAccount.agencia ) {
             sourceAccount.balance -= 8;
         }

         //Subtrai do saldo da conta origem o valor da transferencia
         sourceAccount.balance -= transferMoney; 

         // Valida saldo da conta e menor que zero antes de efetuar a transferencia
         // Se for menor que zero, lança uma exception 
         if (sourceAccount.balance < 0 ) {
             throw new Error('Saldo insuficiente para concluir essa transferências !');
         }

         // Depositar o valor na conta de destino
         targetAccount.balance += transferMoney;
         
         //Salva as alteracoes conta origem
         sourceAccount = new Account(sourceAccount);
         await sourceAccount.save();
         
         // Salva as alterações na conta de destino
         targetAccount = new Account(targetAccount);
         await targetAccount.save();

         res.send(sourceAccount);

        
    } catch(error) {
        res.status(500).send('Erro ao finalizar a transação' + error);
    }


    
};

export default { checkBalance, deposit, getBalance, toWithdraw, removeAccount, transferBalance };

