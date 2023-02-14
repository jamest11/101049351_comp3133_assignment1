import mongoose from 'mongoose';
import { Employee } from '../../models/employee.js';

const authError = () => Error('Not authorized');
 
const queries = {
  getEmployees: async (_, __, contextValue) => {
    if(!contextValue.user) return authError();

    try {
      const employees = await Employee.find();
      return employees;
    } 
    catch(err) {
      return err;
    }
  },

  getEmployee: async (_, args, contextValue) => {
    if(!contextValue.user) return authError();

    if(!mongoose.Types.ObjectId.isValid(args.eid)) return Error('Invalid employee ID')

    try {
      const employee = await Employee.findById(args.eid);
      return employee;
    } 
    catch(err) {
      return err;
    }
  },
};

const mutations = {
  createEmployee: async (_, args, contextValue) => {
    if(!contextValue.user) return authError();

    try {
      const employee = await Employee.create(args);
      return employee;
    } 
    catch (err) {
      if(err.name === 'MongoServerError' && err.code === 11000) {
        return new Error('Employee email address already in use')
      }
      return err;
    }
  },

  updateEmployee: async (_, args, contextValue) => {
    if(!contextValue.user) return authError();
    
    if(!mongoose.Types.ObjectId.isValid(args.eid)) return Error('Invalid employee ID')

    try {
      const eid = args.eid;
      delete args.eid;

      const employee = await Employee.findByIdAndUpdate(eid, args, { new: true });
      return employee;
    } 
    catch (err) {
      if(err.name === 'MongoServerError' && err.code === 11000) {
        return new Error('Employee email address already in use')
      }
      return err;
    }
  },

  deleteEmployee: async (_, args, contextValue) => {
    if(!contextValue.user) return authError();

    if(!mongoose.Types.ObjectId.isValid(args.eid)) return Error('Invalid employee ID')

    try {

      const employee = await Employee.findByIdAndDelete(args.eid);
      
      return employee !== null ? `Employee ${employee.first_name} ${employee.last_name} deleted` : 'Employee does not exist';
    }
    catch (err) {
      return err;
    }
  }
};

export const resolvers = { queries, mutations };