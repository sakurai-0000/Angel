# ローカル実行
## ローカルで関数の実行
sls invoke local --function XXXX --data YYYY
- sls invoke
  関数を呼び出す
- local
  AWSにアクセスするのではなく手元のファイルにアクセスする
- --function XXXX
  実行したい関数
- --data YYYY
  input

## ローカルで関数の実行
LOCAL=true sls invoke local --function XXXX
- LOCAL=trueは環境変数としてLOCALにtrueを設定

# AWS設定
## AWSにアクセスするための設定
serverless config credentials --provider aws --key aws_access_key_id --secret aws_secret_access_key
- aws_access_key_id
  アクセスキー
- aws_secret_access_key
  シークレットアクセスキー

# デプロイ
## デプロイ
sls deploy
serverless deploy --region ap-northeast-1

## デプロイした関数の実行
sls invoke --function XXXX --data YYYY --region ap-northeast-1


# DynamoDB
## DynamoDBにアクセスするために必要なライブラリを追加
npm i -D aws-sdk

## DynamoDBをローカルで動かすための設定
npm i -D serverless-dynamodb-local

## ServerlessFrameworkを使ってDBをインストール
sls dynamodb install

## ローカルでDBにアクセスする
sls dynamodb start

