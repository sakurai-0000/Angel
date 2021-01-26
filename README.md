# インストール
## ServerlessFrameworkのインストール
npm i -g serverless

## DynamoDBにアクセスするために必要なライブラリを追加
npm i -g aws-sdk

## ServerlessFrameworkを使ってDBをインストール
sls dynamodb install

## ローカルでDBにアクセスする
sls dynamodb start

## DynamoDBをローカルで動かすためのplugin
npm i -g serverless-dynamodb-local

## API Gatewayをローカルで動かすためのplugin
npm i -g serverless-offline@next

## ローカルで関数の実行
LOCAL=true sls invoke local --function XXXX　--data YYY
- LOCAL=trueは環境変数としてLOCALにtrueを設定

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

## ローカルサーバーの立ち上げ
LOCAL=true sls offline start
- LOCAL=trueは環境変数としてLOCALにtrueを設定
- postman等で確認

# デプロイ
## AWSにアクセスするための設定
serverless config credentials --provider aws --key aws_access_key_id --secret aws_secret_access_key
- aws_access_key_id
  アクセスキー
- aws_secret_access_key
  シークレットアクセスキー

## デプロイ
sls deploy
serverless deploy --region ap-northeast-1

## デプロイした関数の実行
sls invoke --function XXXX --data YYYY --region ap-northeast-1

