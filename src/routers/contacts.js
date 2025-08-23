import express from 'express';
import { authenticate } from '../middlewares/authenticate.js'; // твій файл
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactByIdController,
  deleteContactByIdController,
} from '../controllers/contacts.js';

const router = express.Router();

// Додаємо middleware на всі контакти
router.use(authenticate);

router.get('/', getContactsController);
router.get('/:contactId', getContactByIdController);
router.post('/', createContactController);
router.patch('/:contactId', updateContactByIdController);
router.delete('/:contactId', deleteContactByIdController);

export default router;
