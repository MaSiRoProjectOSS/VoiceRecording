
if (!JS_Conversation) {
    var JS_Conversation = {
        status_play: false,
        status_init: false,
        recognition: new webkitSpeechRecognition(),
        init: function () {
            if (JS_Conversation.status_init) { return; }
            JS_Conversation.recognition.continuous = true;
            JS_Conversation.recognition.interimResults = true;
            JS_Conversation.recognition.lang = 'ja-JP';
            JS_Conversation.recognition.onend = function () {
                JS_Conversation.add_interim("(自動停止)");
                JS_Conversation.stop();
            }
            JS_Conversation.recognition.onresult = function (event) {
                var interim_transcript = '';
                var final_transcript = '';
                var result_length = event.results.length - event.resultIndex;
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
                if ("" != final_transcript) {
                    console.log('transcript[' + result_length + "]: " + final_transcript);
                    JS_Conversation.add_word(final_transcript);
                }
                if ("" != interim_transcript) {
                    JS_Conversation.add_interim(interim_transcript);
                }
            }
            JS_Conversation.status_init = true;
            console.log("Start Speech Recognition");
        },
        play: function () {
            if (JS_Conversation.status_play) {
                JS_Conversation.stop();
            } else {
                JS_Conversation.start();
            }
        },
        start: function () {
            if (JS_Conversation.status_init) {
                JS_Conversation.recognition.start();
                JS_Conversation.status_play = true;
                JS_Conversation.add_interim("(聞き取り中)");
                document.getElementById('bt_taking').textContent = '[ON] Taking';
            }
        },
        stop: function () {
            if (JS_Conversation.status_init) {
                JS_Conversation.recognition.stop();
                JS_Conversation.status_play = false;
                document.getElementById('bt_taking').textContent = '[OFF] Taking';
            }
        },
        add_interim: function (word) {
            let date = new Date();
            document.getElementById('interim_text').textContent =
                JS_Conversation.get_date() + " " + "\"" + word + "\"";
        },
        add_word: function (word) {
            let p = document.createElement("p");
            p.textContent =
                JS_Conversation.get_date() + " " + "\"" + word + "\"";
            p.classList.add("recognition_word");
            JS_Conversation.add_interim("(聞き取り中)");
            document.getElementById('taking_text').prepend(p);
        },
        get_date: function () {
            let date = new Date();
            return JS_Conversation.zeroPadding(date.getFullYear(), 4) + "-"
                + JS_Conversation.zeroPadding(date.getMonth(), 2)
                + "-" + JS_Conversation.zeroPadding(date.getDate(), 2)
                + " " + JS_Conversation.zeroPadding(date.getHours(), 2)
                + ":" + JS_Conversation.zeroPadding(date.getMinutes(), 2)
                + ":" + JS_Conversation.zeroPadding(date.getSeconds(), 2)
        },
        zeroPadding: function (NUM, LEN) {
            return (Array(LEN).join('0') + NUM).slice(-LEN);
        }
    }
    JS_Conversation.init();
}
