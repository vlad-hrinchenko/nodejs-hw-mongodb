import { Router } from 'express';
import { getAllContacts, getContactById, createContactController, updateContactController, deleteContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactSchema, patchContactSchema } from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';
import { upsertContactController } from "../controllers/contacts.js";
import { updateContactSchema } from "../db/models/contact.js"

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));

router.patch('/:contactId', isValidId, validateBody(patchContactSchema), ctrlWrapper(updateContactController));

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

router.post(
  '/',
  
  upload.single('photo'), 
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.put(
  '/:contactId',
  
  isValidId,
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);

router.patch(
  '/:contactId',
  
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);


export default router;