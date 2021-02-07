import express from 'express';
import { accountModel } from '../models/accountModels.js';
const app = express();



const checkBalance = async (req, res) => {
      const agency  = req.params.agencia;
      const account = req.params.conta;
      try {
        const accounts = await accountModel.find({ agencia: agency, conta: account});
        res.send(accounts);
      } catch(err) {
        res.status(500).send("Erro ao tentar localizar essa conta");
      } 
};




export default { checkBalance };

