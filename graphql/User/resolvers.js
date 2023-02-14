import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.js';

const queries = {
  signIn: async (_, args) => {
    try {
      const user = await User.findOne({ username: args.username });
      const match = await bcrypt.compare(args.password, user.password);
  
      if(match) {
        const token =  jwt.sign({ id: user._id, username: user.username }, process.env.TOKEN_KEY, { expiresIn: '2h' });
  
        return { token };
      }
    }
    catch(err) {
      return err;
    }
  },
};

const mutations = {
  register: async (_, args) => {
    try {
      const hash = await bcrypt.hash(args.password, parseInt(process.env.SALT_ROUNDS));
    
      const user = new User(args);
      user.password = hash;

      await user.save();

      return user;
    } 
    catch(err) {
      if(err.name === 'MongoServerError' && err.code === 11000) {
        return new Error('Email address or username already in use')
      }
      
      return err;
    }
  },
};

export const resolvers = { queries, mutations };