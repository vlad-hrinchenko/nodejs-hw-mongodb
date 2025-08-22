import createError from 'http-errors';
import {
  getContacts,
  getContactsPaginated,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

// GET /contacts
export const getContactsController = async (req, res) => {
  const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;

  const result = await getContactsPaginated({
    userId: req.user._id,
    page: Number(page) || 1,
    perPage: Number(perPage) || 10,
    sortBy,
    sortOrder,
    type,
    isFavourite,
  });

  res.status(200).json({
    status: 'success',
    message: 'Successfully found contacts!',
    data: result,
  });
};

// GET /contacts/:contactId
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 'success',
    message: 'Successfully found contact!',
    data: contact,
  });
};

// POST /contacts
export const createContactController = async (req, res) => {
  const newContact = await createContact(req.body, req.user._id);

  res.status(201).json({
    status: 'success',
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// PATCH /contacts/:contactId
export const updateContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await updateContact(contactId, req.body, req.user._id);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 'success',
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

// DELETE /contacts/:contactId
export const deleteContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const deleted = await deleteContact(contactId, req.user._id);

  if (!deleted) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
