import * as express from 'express';
import { create } from './create';
// import * as payment from './payment-api';

export const router = express.Router();
router.post('/', create);

// router.post('/:method', payment.createPayment);
// router.post('/paid/:method', payment.checkPaid);
