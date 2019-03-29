import * as express from 'express';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

// admin.initializeApp(functions.config().firebase);
admin.initializeApp();
// admin.firestore().settings({ timestampsInSnapshots: true });

const corsHandler = cors({origin: true});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// ========================== Http Functions, hub with Express ===================
import { router } from './app/api';
import { httpErrorHandler } from './app/error/http-error';

const app = express();
app.disable('x-powered-by');
app.use(corsHandler);

// app.get("/test", (req: express.Request, res: express.Response) => {
//   res.status(200).send('Using express with Firebase Functions works~!!!');
// });

app.use('', router);
app.use(httpErrorHandler);

exports.api = functions.https.onRequest(app);

// ========================== Event Functions ===========================
export * from './app/event';

