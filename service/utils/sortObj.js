module.exports = function(obj) {
  let newObj = {};
  let arr = Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
  for (let i = 0; i < arr.length; i++) {
    newObj[arr[i]] = obj[arr[i]];
  }
  return newObj;
};
