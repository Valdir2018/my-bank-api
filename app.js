import express from 'express';
import mongoose from 'mongoose';
import { accountRouter } from './routes/accountRouter.js';



/**
 * conectando ao MongoDb
 */
(async function() {
    try {
        await  mongoose.connect("mongodb+srv://valdir:valdirsilva@cluster0.ckrxu.mongodb.net/db_my_bank_api",   {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true
        });
      } catch(err) {
        console.log('Falha ao se conectar ao banco de dados');
     }
})();

// criando o app com express
const app = express();
app.use(express.json());
app.use(accountRouter);

app.get('/', (req, res) => {
   res.send('API started');
});



app.listen(3000, () => {
    console.log('API RODANDO NA PORTA 3000');
})