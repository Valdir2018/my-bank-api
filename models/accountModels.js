import mongoose from 'mongoose';

const account  = mongoose.Schema({
   agencia: {
      type: Number,
      require: true
   },
   conta: {
     type: Number,
     require: true
   },
   name: {
     type: String,
     require: true
   }, 
   balance: {
     type: Number,
     require: true
   } 
});


const accountModel = mongoose.model('accounts', account);


export { accountModel };