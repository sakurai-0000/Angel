'use strict';

// AWS SDKをimport
const AWS = require('aws-sdk');

// 外部関数
const handler = require('./handler');

module.exports.angel = async event => {
  try {
    // パラメータチェック
    if (!await handler.paraCheck(event.queryStringParameters)) {
      throw new Error('Faile to get Input Parameters');
    };
    // 対象ユーザーデータ取得
    const userInfo = await handler.get(event.queryStringParameters);
    if (userInfo.status === 'failed') {
      throw new Error();
    }
    // Angel Challenge
    const angelRes = handler.angelChallenge();

    // Angel Bounus
    const bonusRes = userInfo.result === {} ? handler.angelBonus(userInfo) : { res: false };

    // update
    const changeTableRes = !userInfo.result
      ? await handler.put(event.queryStringParameters, angelRes)
      : await handler.update(userInfo, angelRes, bonusRes);
    if (changeTableRes.status === 'failed') {
      throw new Error(changeTableRes.result);
    }

    const res = {
      mail_adress: event.queryStringParameters.mail_adress,
      isAngel: angelRes.res,
      isBonus: bonusRes.res,
    };
    return {
      status: 'successed',
      result: JSON.stringify(res),
    };
  } catch (error) {
    console.log(error);
    return {
      result: 'failed',
      message: error.message,
      body: JSON.stringify({ message: error.message }),
    };
  }

};