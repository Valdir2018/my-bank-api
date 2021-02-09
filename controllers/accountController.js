import express from 'express';
import { accountModel  }  from '../models/accountModels.js';

const Account = accountModel;

const app = express();


// consultar conta e agencia
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

// endPoint para depositar
const deposit = async (req, res) => {
    const agencia = req.params.agencia;
    const conta = req.params.conta;
    const newDeposit = req.params.depvalue;

    try {
        const accounts = await Account.find({ agencia, conta });
        console.log(typeof accounts);
    
        accounts.balance += newDeposit;
    
        accounts = new Account(accounts);
    
        await accounts.save();
    
        
    } catch(err) {
        res.status(500).send("Não foi possivel finalizar seu depósito");
    }

};

// consultar saldo da conta => questao 6
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

export default { checkBalance, deposit, getBalance };

