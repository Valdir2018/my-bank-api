import express from 'express';
import controller from '../controllers/accountController.js';
const app = express();


app.get('/account/checkBalance/:agencia/:conta', controller.checkBalance);
app.get('/account/getBalance/:agencia/:conta', controller.getBalance);
app.patch('/account/deposit/', controller.deposit);
app.patch('/account/towithdraw/', controller.toWithdraw);




export {app as accountRouter };