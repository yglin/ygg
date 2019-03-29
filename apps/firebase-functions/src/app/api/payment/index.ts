import * as express from 'express';
import * as asyncHandler from 'express-async-handler';
import { create } from './create';
import { checkPaid } from './check-paid';
// import * as payment from './payment-api';

export const router = express.Router();
router.post('/', asyncHandler(create));
router.post('/paid/:method', asyncHandler(checkPaid));

// router.post('/:method', payment.createPayment);
// router.post('/paid/:method', payment.checkPaid);
