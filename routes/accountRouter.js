import express from 'express';
import controller from '../controllers/accountController.js';

const app = express();

app.get('/account/checkBalance/:agencia/:conta', controller.checkBalance);
app.get('/account/getBalance/:agencia/:conta', controller.getBalance);
app.patch('/account/deposit/', controller.deposit);
app.patch('/account/towithdraw/', controller.toWithdraw);
app.delete('/account/removeaccount/', controller.removeAccount);
app.patch('/account/transferbalance/', controller.transferBalance);


export {app as accountRouter };