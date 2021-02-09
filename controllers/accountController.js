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
        /**
         * crio uma nova instância  de account
         */
        newDeposit = new Account(newDeposit);
        // Salvo o valor no Banco de Dados
        await newDeposit.save();
        // retorno o saldo atualizado    
        res.send(newDeposit);
    
    } catch(error) {
        res.status(500).send("Erro ao depositar " + error);
    }

};

// EndPoint 5 =>  consultar saldo da conta => questao 6
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

export default { checkBalance, deposit, getBalance, toWithdraw };

