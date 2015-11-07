import _ from 'lodash';
import { reduce } from 'async';

exports.mergeObjects = function(arr, userCB) {
  // reduce all files into one object
  reduce(arr, {}, (memo, item, cb) => {
    cb(null, _.merge(memo, item));
  }, (err, obj) => {
    userCB(err, obj);
  });
}
