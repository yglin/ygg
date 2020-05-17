import * as moment from 'moment';

// Formats refers to https://momentjs.com/docs/#/displaying/format/
export const DATE_FORMATS = {
  parse: {
    dateInput: ['l', 'L']
  },
  display: {
    date: 'L',
    datetime: 'LLL',
    dateInput: 'L',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
  serialize: moment.defaultFormat
};

