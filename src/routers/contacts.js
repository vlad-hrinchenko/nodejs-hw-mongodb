import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactByIdController,
  deleteContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';

const router = express.Router();

// Додаємо authenticate до всіх роутів
router.use(authenticate);

// GET /contacts
router.get('/', ctrlWrapper(getContactsController));
// GET /contacts/:contactId
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
// POST /contacts
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));
// PATCH /contacts/:contactId
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactByIdController));
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

const router = express.Router();

// GET /contacts?page=&perPage=&sortBy=name&sortOrder=asc|desc&type=&isFavourite=
router.get('/', ctrlWrapper(getContactsController));

// GET /contacts/:contactId
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// POST /contacts
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));

// PATCH /contacts/:contactId
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactByIdController),
);

// DELETE /contacts/:contactId
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactByIdController));

export default router;
