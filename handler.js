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

// 全量取得
module.exports.getAll = async () => {
  const params = {
    TableName: tableName,
  };
  try {
    // DynamoDBにscanでアクセス
    const result = await dynamo.scan(params).promise();
    // 正常に取得できたらその値を返す
    return {
      status: 'successed',
      result: result.Items,
    };
  } catch (error) {
    // エラーが発生したらエラー情報を返す
    return {
      status: 'failed',
      result: error.message,
    };
  }
};

module.exports.get = async event => {
  // パラメータで渡されたidを取得
  const { id, mail_adress } = event;
  // 検索条件のidを指定
  const params = {
    TableName: tableName,
    Key: { id, mail_adress },
  };

  try {
    const result = await dynamo.get(params).promise();
    return {
      status: 'successed',
      result: result.Item,
    };
  } catch (error) {
    return {
      status: 'failed',
      result: error.message,
    };
  }
};

// 1件登録
module.exports.put = async (event, angelRes) => {
  // 一意な値を作るためにタイムスタンプを取得
  const id = String(Date.now());
  const { mail_adress } = event;

  const params = {
    TableName: tableName,
    Item: {
      id,
      name: 'satomitu',
      mail_adress: mail_adress,
      number_of_login: 1,
      number_of_angel: angelRes ? 1 : 0,
      number_of_bonus: 0,
      updated_by: "sakurai ryutarou",
      updated_at: "2021-01-24"
    },
  };
  try {
    const result = await dynamo.put(params).promise();
    return {
      status: 'successed',
      result: result,
    };
  } catch (error) {
    return {
      status: 'failed',
      result: error.message,
    };
  }
};

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

// 1件更新
module.exports.update = async (event, angelRes, bonusRes) => {
  const { result } = event;
  const { id, mail_adress } = result;
  const params = {
    TableName: tableName,
    Key: { id, mail_adress },
    ExpressionAttributeNames: {
      '#l': 'number_of_login',
      '#a': 'number_of_angel',
      '#b': 'number_of_bonus',
      '#ub': 'updated_by',
      '#ua': 'updated_at',
    },
    ExpressionAttributeValues: {
      ':nawNumber_of_login': result.number_of_login + 1,
      ':nawNumber_of_angel': angelRes ? result.number_of_angel + 1 : result.number_of_angel,
      ':nawNumber_of_bonus': bonusRes.res ? result.number_of_bonus + 1 : result.number_of_bonus,
      ':nawUpdated_by': 'sakurai',
      ':nawUpdated_at': '2021-01-25',
    },
    UpdateExpression: 'SET #l = :nawNumber_of_login, #a = :nawNumber_of_angel, #b = :nawNumber_of_bonus, #ub = :nawUpdated_by, #ua = :nawUpdated_at'
  };
  try {
    const result = await dynamo.update(params).promise();
    return {
      status: 'successed',
      result: result,
    };
  } catch (error) {
    return {
      status: 'failed',
      result: error.message,
    };
  }
};