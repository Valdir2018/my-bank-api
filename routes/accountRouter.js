import express from 'express';
import controller from '../controllers/accountController.js';
const app = express();


app.get('/account/checkBalance/:agencia/:conta', controller.checkBalance);





export {app as accountRouter };