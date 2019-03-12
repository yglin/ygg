import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

// import * as express from 'express';

// const app = express();

// app.get('/api', (req, res) => {
//   res.send(`Welcome to firebase-functions!`);
// });

// const port = process.env.port || 3333;
// app.listen(port, (err) => {
//   if (err) {
//     console.error(err);
//   }
//   console.log(`Listening at http://localhost:${port}`);
// });
