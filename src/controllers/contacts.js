import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContactById,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Contact found successfully!',
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { name, phoneNumber, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Missing required fields');
  }

  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const updateData = req.body;

  const updatedContact = await updateContactById(contactId, updateData);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const deleted = await deleteContactById(contactId);

  if (!deleted) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).end(); // ⛔ 204 — без тіла
};