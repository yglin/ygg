import * as express from 'express';
// import { router as orderRouter } from './order';
import { router as paymentRouter } from './payment';

export const router = express.Router();

// router.use('/orders', orderRouter);
router.use('/payments', paymentRouter);

