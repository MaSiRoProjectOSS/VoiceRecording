# 比較用音声認識認識用サーバー

音声認識の動作確認と認識を比較することを目的としてます。
各システムはDockerコンテナとして構築します。

## インストール方法

## システム構成

ブラウザを経由して、構築した音声認識システムにアクセスします。

<!-- @import "docs/plantuml/System.puml" -->

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
