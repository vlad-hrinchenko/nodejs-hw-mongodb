import express from 'express';
import {
  // базові назви
  getContacts,
  getContactById,
  addContact,
  patchContact,
  removeContact,
  // аліаси (раптом ти десь уже імпортуєш ці імена)
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactByIdController,
  deleteContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

const router = express.Router();

/**
 * ВАРІАНТ 1 (рекомендований): використовувати реальні назви без "Controller"
 */
router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));
router.post('/', validateBody(createContactSchema), ctrlWrapper(addContact));
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContact));
router.delete('/:contactId', isValidId, ctrlWrapper(removeContact));

/**
 * ВАРІАНТ 2 (залишив на випадок, якщо десь у коді очікуються саме *Controller-імена)
 * Розкоментуй замість варіанта 1, якщо хочеш старі назви.
 */
// router.get('/', ctrlWrapper(getContactsController));
// router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
// router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));
// router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactByIdController));
// router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactByIdController));

export default router;
