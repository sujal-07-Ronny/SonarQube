import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  creditBalance: { 
    type: Number, 
    default: 5, 
    min: 0 
  }  
});

const User = model('User', userSchema);
export default User;
