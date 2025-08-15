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
  // Пагінація з бекап-значеннями та межами
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const perPage = Math.max(1, Math.min(100, parseInt(req.query.perPage, 10) || 10));

  // Сортування (за вимогами — дозволяємо лише name)
  const allowedSortBy = new Set(['name']);
  const sortBy = allowedSortBy.has(String(req.query.sortBy)) ? String(req.query.sortBy) : 'name';
  const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

  // Необов'язкові фільтри (опціональний крок)
  const type = req.query.type;
  const isFavourite =
    typeof req.query.isFavourite !== 'undefined'
      ? String(req.query.isFavourite).toLowerCase() === 'true'
      : undefined;

  const result = await getContactsPaginated({
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
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

  res.status(204).end(); // 204 без тіла
};
