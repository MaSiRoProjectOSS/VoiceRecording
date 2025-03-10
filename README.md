# 比較用音声認識認識用サーバー

音声認識の動作確認と認識を比較することを目的としてます。
各システムはDockerコンテナとして構築します。

## インストール方法

### 事前準備

Dockerを使用して構築しますので、Dockerがインストールされている必要があります。
またユーザーをdockerグループをお願いします。

```bash
sudo usermod -aG docker $USER
```

### webkitSpeechRecognition

Chromeブラウザの音声認識機能を使用するため、HTTPSでアクセスする必要があります。
そのため、ローカルサーバーを構築します。

```bash
cd httpd
bash setup.sh
```

構築後、ブラウザで`https://<ipアドレス>:18443`にアクセスしてください。
環境を変えたい場合は、```httpd/src/httpd.config.ini```で変更出来ます。


## システム構成

ブラウザを経由して、構築した音声認識システムにアクセスします。

```plantuml@startuml システム構成

actor User
rectangle Browser

rectangle docker as "Docker Container" {
    rectangle Julius
    rectangle Whisper
    rectangle VoskServer
}
rectangle pip as "Python Package" {
    rectangle Vosk
}

cloud WebSpeechAPI


User -up- Browser : https
Browser -up- Julius
Browser -up- Whisper
Browser -up- WebSpeechAPI

rectangle client_vosk as "client_vosk.py"

User -up- Vosk : mic
User -up- client_vosk
client_vosk -up- VoskServer : WebSocket

@enduml

```

### 一覧

| システム名 | 特徴                                                                 | モデル名                 | サイズ | (VRAM)  | URL                                                  |
| ---------- | -------------------------------------------------------------------- | ------------------------ | ------ | ------- | ---------------------------------------------------- |
| Julius     | 汎用大語彙連続音声認識エンジン<br>辞書ファイルで特定の単語をひろえる | dictation-kit-4.5        | 456 MB |         | https://julius.osdn.jp/                              |
| VOSK       | オフラインで音声認識ができる                                         | vosk-model-small-ja-0.22 | 48M    |         | https://alphacephei.com/vosk/                        |
| ^          | ^                                                                    | vosk-model-ja-0.22       | 1Gb    |         | ^                                                    |
| Whisper    | 雑踏などノイズにも強い                                               | tiny                     | 39 M   | (1 GB)  | https://github.com/ahmetoner/whisper-asr-webservice/ |
| ^          | ^                                                                    | base                     | 74 M   | (1 GB)  | ^                                                    |
| ^          | ^                                                                    | small                    | 244 M  | (2 GB)  | ^                                                    |
| ^          | ^                                                                    | medium                   | 769 M  | (5 GB)  | ^                                                    |
| ^          | ^                                                                    | large                    | 1550 M | (10 GB) | ^                                                    |

### 個別設定

| システム名   | ポート番号<br />(HOST) | ポート番号<br />(DOCKER) | --  |
| ------------ | ---------------------- | ------------------------ | --- |
| local Server | 18443                  | 443                      |     |
| ^            | 18080                  | 80                       |     |
| Julius       | 10500                  | 10500                    |     |
| VOSK         | 2700                   | 2700                     |     |
| Whisper      | 9001                   | 9000                     | GPU |
| ^            | 9002                   | 9000                     | CPU |
