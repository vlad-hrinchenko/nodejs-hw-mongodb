import { Contact } from '../models/Contact.js';
import createHttpError from 'http-errors';

/**
 * GET контакти користувача з пагінацією, сортуванням та фільтрами
 */
export const getContactsPaginated = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite
}) => {
  page = Number(page) < 1 ? 1 : Number(page);
  perPage = Number(perPage) < 1 ? 10 : Number(perPage);
  const skip = (page - 1) * perPage;

  const filter = { userId };
  if (type) filter.contactType = type;
  if (typeof isFavourite !== 'undefined') {
    filter.isFavourite = typeof isFavourite === 'string' 
      ? isFavourite.toLowerCase() === 'true' 
      : Boolean(isFavourite);
  }

  const totalItems = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(perPage);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

/**
 * CREATE контакт з прив'язкою до користувача
 */
export const createContact = async (data, userId) => {
  return Contact.create({ ...data, userId });
};

/**
 * GET контакт за id для конкретного користувача
 */
export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) throw createHttpError(404, 'Contact not found');
  return contact;
};

/**
 * UPDATE контакт користувача
 */
export const updateContact = async (contactId, data, userId) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    { new: true, runValidators: true }
  );
  if (!updatedContact) throw createHttpError(404, 'Contact not found');
  return updatedContact;
};

/**
 * DELETE контакт користувача
 */
export const deleteContact = async (contactId, userId) => {
  const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (!deletedContact) throw createHttpError(404, 'Contact not found');
  return deletedContact;
};
