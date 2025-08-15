import createError from 'http-errors';
import {
  getContactsPaginated,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';

// GET /contacts
export const getContactsController = async (req, res) => {
  const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;

  const result = await getContactsPaginated({
    page: Number(page) || 1,
    perPage: Number(perPage) || 10,
    sortBy,
    sortOrder,
    type,
    isFavourite
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
};

// GET /contacts/:contactId
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};

// POST /contacts
export const createContactController = async (req, res) => {
  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// PATCH /contacts/:contactId
export const updateContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await updateContactById(contactId, req.body);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

// DELETE /contacts/:contactId
export const deleteContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const deleted = await deleteContactById(contactId);

  if (!deleted) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).end();
};
