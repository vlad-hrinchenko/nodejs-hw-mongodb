import { Contact } from '../models/Contact.js';

export const getAllContacts = async () => {
  return await Contact.find(); 
};
