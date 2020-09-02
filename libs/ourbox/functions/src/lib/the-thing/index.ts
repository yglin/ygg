import {
  generateOnCreateFunctions,
  generateOnUpdateFunctions,
  generateOnDeleteFunctions
} from '@ygg/the-thing/functions';
import {
  ImitationBox,
  ImitationItem,
  ImitationItemTransfer
} from '@ygg/ourbox/core';

const TheThingImitations = [ImitationBox, ImitationItem, ImitationItemTransfer];

const onCreateFunctions = generateOnCreateFunctions(TheThingImitations);
for (const key in onCreateFunctions) {
  if (Object.prototype.hasOwnProperty.call(onCreateFunctions, key)) {
    const theFunction = onCreateFunctions[key];
    exports[key] = theFunction;
  }
}

const onUpdateFunctions = generateOnUpdateFunctions(TheThingImitations);
for (const key in onUpdateFunctions) {
  if (Object.prototype.hasOwnProperty.call(onUpdateFunctions, key)) {
    const theFunction = onUpdateFunctions[key];
    exports[key] = theFunction;
  }
}

const onDeleteFunctions = generateOnDeleteFunctions(TheThingImitations);
for (const key in onDeleteFunctions) {
  if (Object.prototype.hasOwnProperty.call(onDeleteFunctions, key)) {
    const theFunction = onDeleteFunctions[key];
    exports[key] = theFunction;
  }
}
