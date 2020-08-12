import { UserAccessorFunctions } from './user-accessor';
import { dataAccessor, emcee, router } from '@ygg/shared/functions';
import { NotificationFactoryFunctions } from './notification-factory';
import { AuthenticatorFunctions } from './authenticator';
import { NotificationAcessorFunctions } from './notification-accessor';

export const notificationAccessor = new NotificationAcessorFunctions(
  dataAccessor
);
export const authenticator = new AuthenticatorFunctions();
export const userAccessor = new UserAccessorFunctions(dataAccessor);
export const notificationFactory = new NotificationFactoryFunctions(
  userAccessor,
  dataAccessor,
  authenticator,
  emcee,
  notificationAccessor,
  router
);
