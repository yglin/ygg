import { TheThingImitation } from './imitation';

export const ImitationDog: TheThingImitation = new TheThingImitation().fromJSON({
  id: 'QiD2PUDv8EucsVRv16xlcA',
  name: 'dog',
  description: 'Dog imitation for The Thing',
  view: 'dog',
  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Collage_of_Nine_Dogs.jpg/390px-Collage_of_Nine_Dogs.jpg',
  filter: {
    tags: ['dog', 'puppy', '狗狗']
  },
  cellsDef: {
    品種: {
      name: '品種',
      type: 'text',
      required: true
    },
    性別: {
      name: '性別',
      type: 'text',
      required: true
    }
  }
});
