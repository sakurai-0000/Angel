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
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    // エラーが発生したらエラー情報を返す
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};

module.exports.get = async event => {
  // パラメータで渡されたidを取得
  const { id } = event;

  // 検索条件のidを指定
  const params = {
    TableName: tableName,
    Key: { id },
  };

  try {
    const result = await dynamo.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};

// 1件登録
module.exports.put = async event => {
  // 一意な値を作るためにタイムスタンプを取得
  const id = String(Date.now());
  const { message } = event;

  const params = {
    TableName: tableName,
    Item: { id, message },
  };
  try {
    const result = await dynamo.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: event }),
  };
};