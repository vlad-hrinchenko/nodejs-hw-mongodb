import express from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactByIdController,
  deleteContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', validateObjectId, ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(createContactController));
router.patch('/:contactId', validateObjectId, ctrlWrapper(updateContactByIdController));
router.delete('/:contactId', validateObjectId, ctrlWrapper(deleteContactByIdController));

export default router;
