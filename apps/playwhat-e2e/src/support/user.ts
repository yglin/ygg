import * as firebase from 'firebase/app';
import 'firebase/auth';

export function getTestUser(): firebase.User {
  return firebase.auth().currentUser;
}