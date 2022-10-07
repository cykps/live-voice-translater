var flagSpeech = 0;
var nowURL = "https://mt-auto-minhon-mlt.ucri.jgn-x.jp/api/mt/generalNT_ja_en/";
var nowURL2 = "https://mt-auto-minhon-mlt.ucri.jgn-x.jp/api/mt/generalNT_ja_ko/";
const selectBox = document.querySelector('#changeLang');
const selectBox2 = document.querySelector('#changeLang2');

function changLang(countryCode) {
    nowURL = "https://mt-auto-minhon-mlt.ucri.jgn-x.jp/api/mt/generalNT_ja_" + countryCode +"/";
    console.log(nowURL)
}

function changLang2(countryCode) {
    nowURL2 = "https://mt-auto-minhon-mlt.ucri.jgn-x.jp/api/mt/generalNT_ja_" + countryCode +"/";
    console.log(nowURL2)
}

selectBox.addEventListener('change',() => {
    let countryCode = selectBox.options[selectBox.selectedIndex].id;
    changLang(countryCode);
},false);

selectBox2.addEventListener('change',() => {
    let countryCode2 = selectBox2.options[selectBox2.selectedIndex].id;
    changLang2(countryCode2);
},false);

//以下[https://monomonotech.jp/kurage/iot/webspeechapi_voice_recognition.html]を参考
function vr_function() {
    SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ja';
    recognition.interimResults = true;
    recognition.continuous = true;
    console.log("感知");
    recognition.onerror = function () {
        if (flagSpeech == 0)
            vr_function();
    };
    recognition.onsoundend = function () {
        vr_function();
    };
    recognition.onresult = function (event) {
        var results = event.results;
        for (var i = event.resultIndex; i < results.length; i++) {
            if (results[i].isFinal) {
                document.getElementById('result').innerHTML += results[i][0].transcript + "<br>";
                document.getElementById('result2').innerHTML += results[i][0].transcript + "<br>";

                setTimeout(handle, 1, results[i][0].transcript, "resultT", true);
                setTimeout(handle2, 1, results[i][0].transcript, "resultT2", true);

                vr_function();

            }
            else {
                document.getElementById('tmp').innerHTML = results[i][0].transcript;
                document.getElementById('tmp2').innerHTML = results[i][0].transcript;
                setTimeout(handle, 1, results[i][0].transcript, "tmpT", false);
                setTimeout(handle2, 1, results[i][0].transcript, "tmpT2", false);
                flagSpeech = 1;
            }
        }
    }
    flagSpeech = 0;
    recognition.start();
    console.log("実行済み")
}
vr_function();
console.log("実行");



//以下[https://qiita.com/relu/items/69083a48ef67b2f64d3e]から一部改変
async function handle(text, eleId, isPlus) {
    name = "devps";
    key = "a9f269c29c2b0ccaa92e1dd75a13592706340957c";
    secret = "47094932051d304b156967253cac0452";

    const oauth = OAuth({
        consumer: { key, secret },
        signature_method: "HMAC-SHA1",
        hash_function(base_string, key) {
            return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
        }
    });

    var options = {
        url: nowURL,
        method: "POST",
        data: { text, name, key, type: "json" }
    };

    const cors_support = "https://corsproxy.io/?";
    const res = await fetch(cors_support + options.url, {
        method: options.method,
        body: new URLSearchParams(options.data),
        headers: oauth.toHeader(oauth.authorize(options))
    }).then((r) => r.json());
    console.log(res);
    if (isPlus) {
        document.getElementById(eleId).innerHTML += res.resultset.result.text + "<br>";
    } else {
        document.getElementById(eleId).innerHTML = res.resultset.result.text + " ";
    }
}

async function handle2(text, eleId, isPlus) {
    name = "devps";
    key = "a9f269c29c2b0ccaa92e1dd75a13592706340957c";
    secret = "47094932051d304b156967253cac0452";

    const oauth = OAuth({
        consumer: { key, secret },
        signature_method: "HMAC-SHA1",
        hash_function(base_string, key) {
            return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
        }
    });

    var options2 = {
        url: nowURL2,
        method: "POST",
        data: { text, name, key, type: "json" }
    };

    const cors_support = "https://corsproxy.io/?";
    const res = await fetch(cors_support + options2.url, {
        method: options2.method,
        body: new URLSearchParams(options2.data),
        headers: oauth.toHeader(oauth.authorize(options2))
    }).then((r) => r.json());
    console.log(res);
    if (isPlus) {
        document.getElementById(eleId).innerHTML += res.resultset.result.text + "<br>";
    } else {
        document.getElementById(eleId).innerHTML = res.resultset.result.text + " ";
    }
}

//[https://mt-auto-minhon-mlt.ucri.jgn-x.jp/]