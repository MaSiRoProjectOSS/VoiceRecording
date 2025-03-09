
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
                date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " "
                + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " "
                + "\"" + word + "\"";
        },
        add_word: function (word) {
            let date = new Date();
            let p = document.createElement("p");
            p.textContent = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " "
                + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " "
                + "\"" + word + "\"";
            p.classList.add("recognition_word");
            document.getElementById('interim_text').textContent = "";
            document.getElementById('taking_text').prepend(p);
        }
    }
    JS_Conversation.init();
}
