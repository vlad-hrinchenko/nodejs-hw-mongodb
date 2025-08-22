import createError from 'http-errors';
import {
  getContactsPaginated,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

// GET /contacts
export const getContactsController = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// GET /contacts/:contactId
export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);

    res.status(200).json({
      status: 'success',
      message: 'Successfully found contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// POST /contacts
export const createContactController = async (req, res, next) => {
  try {
    const newContact = await createContact(req.body, req.user._id);

    res.status(201).json({
      status: 'success',
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /contacts/:contactId
export const updateContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body, req.user._id);

    res.status(200).json({
      status: 'success',
      message: 'Successfully updated the contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /contacts/:contactId
export const deleteContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    await deleteContact(contactId, req.user._id);

    res.status(204).send(); // без тіла відповіді
  } catch (error) {
    next(error);
  }
};
