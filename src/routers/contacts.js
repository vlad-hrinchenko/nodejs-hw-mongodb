import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { contactCreateSchema, contactUpdateSchema } from '../schemas/contactSchemas.js';
import {
  getContacts,
  getContactById,
  addContact,
  patchContact,
  removeContact
} from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));
router.post('/', validateBody(contactCreateSchema), ctrlWrapper(addContact));
router.patch('/:contactId', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(patchContact));
router.delete('/:contactId', isValidId, ctrlWrapper(removeContact));

export default router;
