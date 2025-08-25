// Перевірка валідності MongoDB ObjectId (ESM)

import { isValidObjectId } from 'mongoose'; // якщо використовуєш mongoose

export const isValidId = (req, res, next) => {
  // підтримуємо і params.id, і params.contactId, і будь-який :*Id
  const id =
    req.params.id ??
    req.params.contactId ??
    Object.values(req.params).find((v) => /[a-f0-9]{24}/i.test(String(v)));

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid id format',
    });
  }

  next();
};
