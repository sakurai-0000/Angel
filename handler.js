'use strict';

// AWS SDKをimport
const AWS = require('aws-sdk');

// 環境変数にLOCALが設定されていたらローカルDB用の設定を使う(portはymlで定義したものを設定)
const options = process.env.LOCAL
  ? { region: 'localhost', endpoint: 'http://localhost:8082' }
  : {};

// DynamoDBにアクセスするためのクライアントの初期化
const dynamo = new AWS.DynamoDB.DocumentClient(options);
// 環境変数からテーブル名を取得(あとでserverless.ymlに設定します)
const tableName = process.env.tableName;

module.exports.paraCheck = async event => {
  if ((!event.id || event.id === undefined)
    || (!event.mail_adress || event.mail_adress === undefined)) {
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
  const { number_of_bonus: num } = info.result;
  return {
    res: (num + 1) % 5 === 0,
    num: num + 1,
  };
};

module.exports.angelBonus = info => {
  const { number_of_bonus: num } = info.result;
  return {
    num: num + 1,
    res: (num + 1) % 5 === 0,
  };
};
