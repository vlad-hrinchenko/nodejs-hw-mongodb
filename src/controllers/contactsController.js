import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';

export const getContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

    const result = await contactsService.getAllContacts({
      userId,
      page,
      perPage,
      sortBy,
      sortOrder,
      type,
      isFavourite,
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: {
        data: result.data,
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        hasPreviousPage: result.hasPreviousPage,
        hasNextPage: result.hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { contactId } = req.params;

    const contact = await contactsService.getContactById(userId, contactId);
    if (!contact) throw createError(404, 'Contact not found');

    res.json({ status: 'success', data: contact });
  } catch (error) {
    next(error);
  }
};

export const addContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contactData = req.body;

    if (!contactData.name || !contactData.phoneNumber || !contactData.contactType) {
      throw createError(400, 'Missing required fields');
    }

    const newContact = await contactsService.addContact(userId, contactData);

    res.status(201).json({
      status: 'success',
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { contactId } = req.params;
    const updateData = req.body;

    const updatedContact = await contactsService.updateContact(userId, contactId, updateData);
    if (!updatedContact) throw createError(404, 'Contact not found');

    res.json({ status: 'success', data: updatedContact });
  } catch (error) {
    next(error);
  }
};

export const removeContact = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const { contactId } = req.params;

    const deletedContact = await contactsService.removeContactById(userId, contactId);
    if (!deletedContact) throw createError(404, 'Contact not found');

    res.json({ status: 'success', message: 'Contact successfully deleted', data: deletedContact });
  } catch (error) {
    next(error);
  }
};
