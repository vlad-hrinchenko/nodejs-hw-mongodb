import { Contact } from '../models/Contact.js';
import createHttpError from 'http-errors';

// GET всі контакти користувача
export const getContacts = async (userId) => {
  return await Contact.find({ userId });
};

// GET контакт за id для конкретного користувача
export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) throw createHttpError(404, 'Contact not found');
  return contact;
};

// CREATE контакт з userId
export const createContact = async (data, userId) => {
  const newContact = await Contact.create({ ...data, userId });
  return newContact;
};

// UPDATE контакт користувача
export const updateContact = async (contactId, data, userId) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    { new: true }
  );
  if (!updatedContact) throw createHttpError(404, 'Contact not found');
  return updatedContact;
};

// DELETE контакт користувача
export const deleteContact = async (contactId, userId) => {
  const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (!deletedContact) throw createHttpError(404, 'Contact not found');
  return deletedContact;
};
