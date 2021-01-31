'use strict';

// AWS SDKをimport
// const AWS = require('aws-sdk');

module.exports.paraCheck = async event => {
  if ((!event.id || event.id === undefined)
    || (!event.name || event.name === undefined)) {
    return false;
  }
  return true;
};

module.exports.angelChallenge = () => {
  const random = Math.floor(Math.random() * 10);
  return {
    res: random > 7,
  }
};

module.exports.angelBonus = info => {
  if (!info.result) return {
    res: false,
    num: 0,
  };
  const { number_of_login: num } = info.result;
  return {
    res: (num + 1) % 5 === 0,
  };
};

