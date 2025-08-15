import { Contact } from '../models/Contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactsPaginated = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite
}) => {
  const skip = (page - 1) * perPage;

  const filter = {};

  if (type) {
    filter.contactType = type;
  }

  if (typeof isFavourite !== 'undefined') {
    filter.isFavourite = isFavourite === 'true';
  }

  const totalItems = await Contact.countDocuments(filter);

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
    hasPreviousPage: page > 1,
    hasNextPage: page < Math.ceil(totalItems / perPage),
  };
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
