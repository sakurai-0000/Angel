'use strict';

// AWS SDKをimport
const AWS = require('aws-sdk');

// 外部関数
const handler = require('./handler');
const db = require('./db');

module.exports.angel = async req => {
  const event = process.env.LOCAL
    ? JSON.parse(req.body)
    : req.queryStringParameters;

  console.log(`req: ${event}`);
  try {
    // パラメータチェック
    if (!await handler.paraCheck(event)) {
      throw new Error('Faile to get Input Parameters');
    };
    // 対象ユーザーデータ取得
    const userInfo = await db.get(event);
    if (userInfo.status === 'failed') {
      throw new Error();
    }

    // Angel Challenge
    const angelRes = handler.angelChallenge();

    // Angel Bounus
    const bonusRes = userInfo.result === {} ? handler.angelBonus(userInfo) : { res: false };

    // update
    const changeTableRes = !userInfo.result
      ? await db.put(event, angelRes)
      : await db.update(userInfo, angelRes, bonusRes);
    if (changeTableRes.status === 'failed') {
      throw new Error(changeTableRes.result);
    }
    return {
      body: JSON.stringify(
        {
          status: 'successed',
          result: {
            id: event.id,
            mail_adress: event.mail_adress,
            isAngel: angelRes.res,
            isBonus: bonusRes.res,
          },
        }),
    };
  } catch (error) {
    console.log(error);
    return {
      body: JSON.stringify({
        result: 'failed',
        message: error.message
      }),
    };
  }

};