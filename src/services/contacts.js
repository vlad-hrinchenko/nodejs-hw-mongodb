import { Contact } from '../models/Contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateContactById = async (id, updateData) => {
  return await Contact.findByIdAndUpdate(id, updateData, {
    new: true, 
    runValidators: true,
  });
};

export const deleteContactById = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
