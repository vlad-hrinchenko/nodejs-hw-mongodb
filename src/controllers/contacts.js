import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const contacts = await getContacts(req.user._id);
  res.json({ status: 'success', data: contacts });
};

export const getContactByIdController = async (req, res) => {
  const contact = await getContactById(req.params.contactId, req.user._id);
  res.json({ status: 'success', data: contact });
};

export const createContactController = async (req, res) => {
  const newContact = await createContact(req.body, req.user._id);
  res.status(201).json({ status: 'success', data: newContact });
};

export const updateContactByIdController = async (req, res) => {
  const updatedContact = await updateContact(req.params.contactId, req.body, req.user._id);
  res.json({ status: 'success', data: updatedContact });
};

export const deleteContactByIdController = async (req, res) => {
  await deleteContact(req.params.contactId, req.user._id);
  res.status(204).send();
};
