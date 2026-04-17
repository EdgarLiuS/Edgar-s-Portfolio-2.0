


let cipher = ["XOR", "Caesar"];
let cipherModes = ["Encode", "Decode"];
let text = document.getElementById("inputText");

//--------------------------------------------------------------------------------------------------------------
//Unicode and Visual operations
function UnicodeDecoder(str) {
    let result = [];
    for (let i = 0; i < str.length; i++) {
        const cp = str.codePointAt(i);
        result.push(cp);
        if (cp > 0xFFFF) i++;
    }
    return result;
}



function UnicodeEncoder(arr){
    let result = "";
    for(let i = 0; i < arr.length; i++){
        result += String.fromCodePoint(arr[i]);
    }
    return result;
}

function VisualEncoder(cps) {
    return cps.map(cp => cp + 0x4E00);
}

function VisualDecoder(cps) {
    return cps.map(cp => cp - 0x4E00);
}

//--------------------------------------------------------------------------------------------------------------
//XOR
function xorCore(cps, key) {

    for(let i = 0; i < cps.length; i++){

        cps[i] = (cps[i] ^ key);

    }

    return cps;
}

function xorEncrypt(str, key) {
    const cps = UnicodeDecoder(str);
    const encrypted = xorCore(cps, key);
    return UnicodeEncoder(encrypted);
}


function xorDecrypt(str, key) {
    const cps = UnicodeDecoder(str);
    const decrypted = xorCore(cps, key);
    return UnicodeEncoder(decrypted);
}


//--------------------------------------------------------------------------------------------------------------
//Caesar
function caesarCore(cps, offset) {
    for(let i = 0; i < cps.length; i++){

        cps[i] = (cps[i] + offset) % 0x110000;
    }

    return cps;
}

function caesarEncrypt(str, offset) {
    const cps = UnicodeDecoder(str);
    const encrypted = caesarCore(cps, offset);
    
    return UnicodeEncoder(encrypted);
}



function caesarDecrypt(str, offset) {
    const cps = UnicodeDecoder(str);
    const decrypted = caesarCore(cps, -offset);
    return UnicodeEncoder(decrypted);
}

//--------------------------------------------------------------------------------------------------------------
//Vigenère Cipher
function vigenereCore(cps, keyCps, encrypt=true) {
    const keyLength = keyCps.length;
    for(let i = 0; i < cps.length; i++){
        const keyCp = keyCps[i % keyLength];
        if(encrypt){
            cps[i] = (cps[i] + keyCp) % 0x110000;
        } else {
            cps[i] = (cps[i] - keyCp + 0x110000) % 0x110000;
        }
    }
    return cps;
}
function parseNumericKey(key) {
    return String(key).split("").map(d => Number(d));
}


function vigenereEncrypt(str, key) {
    
    const cps = UnicodeDecoder(str);
    const keyCps = parseNumericKey(key);
    const encrypted = vigenereCore(cps, keyCps, true);
    return UnicodeEncoder(encrypted);
}
function vigenereDecrypt(str, key) {
    const cps = UnicodeDecoder(str);
    const keyCps = parseNumericKey(key);
    const decrypted = vigenereCore(cps, keyCps, false);
    return UnicodeEncoder(decrypted);
}
//--------------------------------------------------------------------------------------------------------------
//Morse Code
function morseCore(str, encrypt=true) {
    const MORSE_TABLE = {
    "A": ".-",    "B": "-...",  "C": "-.-.",  "D": "-..",
    "E": ".",     "F": "..-.",  "G": "--.",   "H": "....",
    "I": "..",    "J": ".---",  "K": "-.-",   "L": ".-..",
    "M": "--",    "N": "-.",    "O": "---",   "P": ".--.",
    "Q": "--.-",  "R": ".-.",   "S": "...",   "T": "-",
    "U": "..-",   "V": "...-",  "W": ".--",   "X": "-..-",
    "Y": "-.--",  "Z": "--..",

    "0": "-----", "1": ".----", "2": "..---", "3": "...--",
    "4": "....-", "5": ".....", "6": "-....", "7": "--...",
    "8": "---..", "9": "----.",

    " ": "/" 
    //can't really encrypt chinese and japanese etc, I have no access to those tables
    };
    if(encrypt){
        const upperStr = str.toUpperCase();
        let result = "";
        for(let char of upperStr){
            for(let key in MORSE_TABLE){
                if(key === char){
                    result += MORSE_TABLE[key] + " ";
                    break;
                }
            }
        }
        return result.trim();
    } else {
        const inverseTable = {};
        for(let key in MORSE_TABLE){
            inverseTable[MORSE_TABLE[key]] = key;
        }
        const words = str.split(" ");
        let result = "";
        for(let word of words){
            if(inverseTable[word]){
                result += inverseTable[word];
            } else {
                result += word;
            }
        }
        return result;
    }

};
function morseEncrypt(str) {
    const cps = morseUnicode(str);
    const encrypted = morseCore(cps, true);
    return encrypted;
}
function morseDecrypt(str) {
    const decrypted = morseCore(str, false);
    console.log("decrypted:", decrypted);
    const result = morseDeUnicode(decrypted);
    console.log("str:", result);
    return result;
}

function morseUnicode(str){
    const cps = UnicodeDecoder(str);
    let result = "";
    for(let i = 0; i < cps.length; i++){
        const cp = cps[i];
        let hex = cp.toString(16);
        let escaped = "U" + hex + " ";
        result += escaped;
    }
    return result;
}
function morseDeUnicode(str){
    const parts = str.split(/\s+/);
    let cps = [];
    for(let part of parts){
        if(part.startsWith("U")){
            let hex = part.slice(1);
            let cp = parseInt(hex, 16);
            cps.push(cp);
        }
    }
    return UnicodeEncoder(cps);
}
//--------------------------------------------------------------------------------------------------------------
//pure unicode encrypt and decrypt
//found 
function pureUnicodeEncrypt(str) {
    const cps = UnicodeDecoder(str);

    let result = "";

    for (let i = 0; i < cps.length; i++) {
        const cp = cps[i];

        // convert code point to hexadecimal
        let hex = cp.toString(16);

        // format
        let escaped = "\\u{" + hex + "}";

        result += escaped;
    }

    return result;
}



function pureUnicodeDecrypt(str) {
    const regex = /\\u\{([0-9a-fA-F]+)\}/g;
    let match;
    const cps = [];

    while ((match = regex.exec(str)) !== null) {//regex.exec(str) for finding all matches in the string
        cps.push(parseInt(match[1], 16));//parse it!
    }

    return UnicodeEncoder(cps);
}


//--------------------------------------------------------------------------------------------------------------
//DOM communication
function encrypt() {
    const input = document.getElementById("inputText").value;
    let key = parseInt(document.getElementById("key").value);
    const cipher = document.getElementById("mode").value;
    const mode = document.getElementById("processingMode").value;
    if(isNaN(key)){
        generateRandomKey();
        key = parseInt(document.getElementById("key").value);
    }
    let output = "";

    if (cipher === "xor") {
        if (mode === "encrypt") {
            output = xorEncrypt(input, key);
        } else {
            output = xorDecrypt(input, key);
        }
    }

    if (cipher === "caesar") {
        if (mode === "encrypt") {
            output = caesarEncrypt(input, key);
        } else {
            output = caesarDecrypt(input, key);
        }
    }
    if (cipher === "vigenere") {
        
        if (mode === "encrypt") {
            output = vigenereEncrypt(input, key);
            
        } else {
            output = vigenereDecrypt(input, key);
        }
    }
    if (cipher === "morse") {
        if (mode === "encrypt") {
            output = morseEncrypt(input);
        } else {
            output = morseDecrypt(input);
        }
    }
    if (cipher === "unicode") {
        if (mode === "encrypt") {
            output = pureUnicodeEncrypt(input);
        } else {
            output = pureUnicodeDecrypt(input);
        }
    }
    if (cipher === "simpleUnicode") {
        if (mode === "encrypt") {
            output = morseUnicode(input);
        } else {
            output = morseDeUnicode(input);
        }
    }
    addHistory(input, cipher, mode, key, output);
    
    document.getElementById("outputText").value = output;
}
function switchMode() {
    const mode = document.getElementById("processingMode");
    if (mode.value === "encrypt") {
        mode.value = "decrypt";
    } else {
        mode.value = "encrypt";
    }
}
function copyOutput() {
    const text = document.getElementById("outputText").value;
    navigator.clipboard.writeText(text)
    
}
function generateRandomKey() {
    const randomKey = Math.floor(Math.random() * 0x110);
    document.getElementById("key").value = randomKey;
}
function setKey(key) {
    document.getElementById("key").value = key;
}

function clearText() {
    document.getElementById("inputText").value = "";
    document.getElementById("outputText").value = "";
}
function clearOutput() {
    document.getElementById("outputText").value = "";
}
function sampleText() {
    const sample = ["滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢。古今多少事，都付笑谈中。",
        "The quick brown fox jumps over the lazy dog. 1234567890!@#$%^&*()_+-=[]{}|;':\",./<>?`~",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take arms against a sea of troubles And by opposing end them. To die—to sleep, No more; and by a sleep to say we end The heart-ache and the thousand natural shocks That flesh is heir to: 'tis a consummation Devoutly to be wish'd. To die, to sleep; To sleep, perchance to dream—ay, there's the rub: For in that sleep of death what dreams may come, When we have shuffled off this mortal coil, Must give us pause—there's the respect That makes calamity of so long life. For who would bear the whips and scorns of time, Th'oppressor's wrong, the proud man's contumely, The pangs of dispriz'd love, the law's delay, The insolence of office, and the spurns That patient merit of th'unworthy takes, When he himself might his quietus make With a bare bodkin? Who would fardels bear, To grunt and sweat under a weary life, But that the dread of something after death, The undiscovere'd country, from whose bourn No traveller returns, puzzles the will, And makes us rather bear those ills we have Than fly to others that we know not of? Thus conscience doth make cowards of us all, And thus the native hue of resolution Is sicklied o'er with the pale cast of thought, And enterprises of great pith and moment With this regard their currents turn awry And lose the name of action.",
        "Hola, Hello, こんにちは, 안녕하세요, 你好, Bonjour, Ciao, Привет, مرحبا, สวัสดี, γειά σου, שלום, नमस्ते, Hej, Ahoj, Bună ziua, Szia, Guten Tag, Olá, Merhaba, Sawubona, Zdravstvuyte, Kia ora, Tere, Sveiki, Halo, Cześć, Hei, Salve, Dzień dobry",
        "😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥳🤩🥺😭😢😂🤣😊🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥳🤩🥺😭",
        "3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420198938095257201065485863278865936153381827968230301952035301852968995773622599413891249721775283479131515574857242454150695950829533116861727855889075098381754637464939319255060400927701671139009848824012858361603563707660104710181942955596198946767837449448255379774726847104047534646208046684259069491293313677028989152104752162056966024058038150193511253382430035587640247496473263914199272604269922796782354781636009341721641219924586315030286182974555706749838505494588586926995690927210797509302955321",
        "The New York City Subway is a rapid transit system in New York City, serving four of the city's five boroughs: Manhattan, Brooklyn, Queens, and the Bronx. It is owned by the government of New York City and leased to the New York City Transit Authority,[14] an affiliate agency of the state-run Metropolitan Transportation Authority (MTA).[15] Opened on October 27, 1904, the New York City Subway is one of the world's oldest public transit systems, one of the most-used, and the one with the most stations,[16] with 472 stations in operation[17] (423, if stations connected by transfers are counted as single stations).[1]",
        "好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好",
        "手持两把锟斤拷，口中疾呼烫烫烫",
        "People always told me,'Be careful of what you do, Don't go around breaking young girls' hearts, And mother always told me,'Be careful of who you love, And be careful of what you do, 'Cause the lie becomes the truth.' Billie Jean is not my lover, She's just a girl who claims that I am the one, But the kid is not my son.",
        "Don't need reason, don't need rhyme Ain't nothin' I'd rather do Goin' down, party time My friends are gonna be there too, yeah I'm on the highway to hell On the highway to hell Highway to hell I'm on the highway to hell No stop signs, speed limit Nobody's gonna slow me down Like a wheel, gonna spin it Nobody's gonna mess me around Hey Satan, payin' my dues Playin' in a rocking band Hey momma, look at me I'm on my way to the promised land, wow",
        "這晚在街中偶遇心中的她，兩腳決定不聽叫喚跟她歸家，深宵的冷風，不准吹去她，她那幽幽眼神，快要對我説話，纖纖身影，飄飄身影，默默轉來吧，對我説浪漫情人愛我嗎，貪心的晚風，竟敢擁吻她，將她秀髮温温柔柔每縷每縷放下，卑污的晚風，不應撫慰她，我已決意一生護着心中的她"
    ];
    const randomIndex = Math.floor(Math.random() * sample.length);
    document.getElementById("inputText").value = sample[randomIndex];
}
function loadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md';

    input.onchange = event => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById("inputText").value = e.target.result;
        };
        reader.readAsText(file, "utf-8"); 
    };

    input.click();
}


function saveToFile() {
    const text = document.getElementById("outputText").value;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encrypted.txt';
    a.click();
    URL.revokeObjectURL(url);
}
function readFromClip() {
    navigator.clipboard.readText().then(text => {
        document.getElementById("inputText").value = text;
    });
}
function copyKey() {
    const key = document.getElementById("key").value;
    navigator.clipboard.writeText(key);
}
function swapText() {
    const input = document.getElementById("inputText").value;
    const output = document.getElementById("outputText").value;
    document.getElementById("inputText").value = output;
    document.getElementById("outputText").value = input;
}


//--------------------------------------------------------------------------------------------------------------
//history
const historyKey = "encryptorHistory";
function loadHistory() {
    const raw = localStorage.getItem(historyKey);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return []; 
    }
}

let maxHistory = 100;// 5mb limit, we got plenty of space for this
function saveHistory(history) {
    localStorage.setItem(historyKey, JSON.stringify(history));
}
    
function addHistory(text, encryptor, processingMode,key, output) {
    let record = {//record struct
        time: Date.now(),
        mode: encryptor,
        processingMode: processingMode,//encrypt or decrypt
        key: key,
        input: text,
        output: output
    };

    let history = loadHistory();
    history.push(record);

    if (history.length > maxHistory) {
        let removed = history.shift();
        removeHistoryButton(removed.time); //delete the oldest button
    }

    saveHistory(history);

    addHistoryButton(record); // adds a button for the new record
}


function clearHistory() {
    localStorage.removeItem(historyKey);

    const area = document.getElementById("historyArea");
    area.innerHTML = "";//wipe all buttons
}

//visual
function addHistoryButton(record) {
    const area = document.getElementById("historyArea");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "historyElement";
    btn.dataset.id = record.time;

    //format time
    const date = new Date(record.time);
    const timeString = date.toLocaleString();

    //preview (first 30 chars) + "..."
    const inputPreview = escapeHTML(record.input.slice(0, 30) + "...");
    const outputPreview = escapeHTML(record.output.slice(0, 25) + "...");
    //const keyPreview = escapeHTML(record.key);
    //display in button
    btn.innerHTML = `
        <div class="history-left">
            <div>${inputPreview}</div>
            <div>└ ─ Output: ${outputPreview}</div>
            <div>└ ─ ─ Key: ${record.key}</div>
        </div>
        <div class="history-time">${timeString}</div>
    `;

    btn.onclick = () => {
        document.getElementById("inputText").value = record.input;
        document.getElementById("key").value = record.key;
        document.getElementById("processingMode").value = record.processingMode;
        document.getElementById("mode").value = record.mode;
        document.getElementById("outputText").value = record.output;
    };
    btn.title = 
        `${inputPreview}
        Key: ${record.key}
        Processing Mode: ${record.processingMode}
        Output: ${outputPreview}
        Time: ${timeString}
        Mode: ${record.mode}`;
        


    area.prepend(btn);//put to the top

}

function escapeHTML(str) {
    //prevent some naughty code
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



function removeHistoryButton(id) {
    const area = document.getElementById("historyArea");
    const btn = area.querySelector(`button[data-id="${id}"]`);
    if (btn) btn.remove();
}

function loadHistoryButtons() {
    const history = loadHistory();
    const area = document.getElementById("historyArea");
    area.innerHTML = ""; //no duplication

    history.forEach(record => {
        addHistoryButton(record);
    });
}

window.onload = loadHistoryButtons;


//--------------------------------------------------------------------------------------------------------------
//Debug
let enc = xorEncrypt("滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢。古今多少事，都付笑谈中。", 0x1234);
let dec = xorDecrypt(enc, 0x1234);
console.log("XOR Encrypted:", enc); 
console.log("XOR Decrypted:", dec); 

let caesarEnc = caesarEncrypt("滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢。古今多少事，都付笑谈中。", 0x1234);
let caesarDec = caesarDecrypt(caesarEnc, 0x1234);
console.log("Caesar Encrypted:", caesarEnc);
console.log("Caesar Decrypted:", caesarDec);


let testStr = "糮糮蝋繫尨舩縀罞邅翬三郅蓰∶琛蕪瀤鼑鵘䬀桎∶蕦久嶩矓䔜䏔䲒䬡萇沖∶摉䇥簠码繫簮尾狛政毿甼琑諺∶尴䫂罾荦䞨擌舖∶䇐峾䬮严岿苉峬椥鸼尙";
console.log("Original:", testStr);
console.log("XOR Decrypter:", xorDecrypt(testStr, 0x1234));
//returned 滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢。古今多少事，都付笑谈中

//I found this cool tool messing around with the code
//https://lelinhtinh.github.io/de4js/
//https://www.lddgo.net/encrypt/js
//const _0x39506d=_0x41da;(function(_0x205eba,_0x31e381){const _0x4c885e=_0x41da,_0x5c4195=_0x205eba();while(!![]){try{const _0x93e7dc=-parseInt(_0x4c885e(0xab))/0x1*(-parseInt(_0x4c885e(0x78))/0x2)+parseInt(_0x4c885e(0xbd))/0x3+parseInt(_0x4c885e(0xa1))/0x4*(-parseInt(_0x4c885e(0x7c))/0x5)+parseInt(_0x4c885e(0xb3))/0x6+parseInt(_0x4c885e(0x9a))/0x7*(parseInt(_0x4c885e(0x88))/0x8)+parseInt(_0x4c885e(0xca))/0x9+-parseInt(_0x4c885e(0x8c))/0xa;if(_0x93e7dc===_0x31e381)break;else _0x5c4195['push'](_0x5c4195['shift']());}catch(_0x501090){_0x5c4195['push'](_0x5c4195['shift']());}}}(_0x3455,0xb8d55));let cipher=[_0x39506d(0x8a),_0x39506d(0x82)],cipherModes=[_0x39506d(0xd3),_0x39506d(0x79)],text=document[_0x39506d(0x93)](_0x39506d(0xa8));function UnicodeDecoder(_0x400300){const _0xfd6b54=_0x39506d;let _0x196fb1=[];for(let _0x2f55d9=0x0;_0x2f55d9<_0x400300[_0xfd6b54(0x9c)];_0x2f55d9++){const _0x2de133=_0x400300['codePointAt'](_0x2f55d9);_0x196fb1[_0xfd6b54(0xcf)](_0x2de133);if(_0x2de133>0xffff)_0x2f55d9++;}return _0x196fb1;}function UnicodeEncoder(_0x355010){const _0xc0ca42=_0x39506d;let _0x27267b='';for(let _0x25f0da=0x0;_0x25f0da<_0x355010[_0xc0ca42(0x9c)];_0x25f0da++){_0x27267b+=String[_0xc0ca42(0xc7)](_0x355010[_0x25f0da]);}return _0x27267b;}function VisualEncoder(_0x190294){const _0x5768f2=_0x39506d;return _0x190294[_0x5768f2(0x94)](_0x339fd2=>_0x339fd2+0x4e00);}function VisualDecoder(_0x5153d7){const _0x4ab67f=_0x39506d;return _0x5153d7[_0x4ab67f(0x94)](_0x56e2bc=>_0x56e2bc-0x4e00);}function xorCore(_0x21e3bd,_0x23cf8b){const _0x195cb7=_0x39506d;for(let _0x30c940=0x0;_0x30c940<_0x21e3bd[_0x195cb7(0x9c)];_0x30c940++){_0x21e3bd[_0x30c940]=_0x21e3bd[_0x30c940]^_0x23cf8b;}return _0x21e3bd;}function xorEncrypt(_0x113e36,_0x262fc7){const _0x88887=UnicodeDecoder(_0x113e36),_0x275daf=xorCore(_0x88887,_0x262fc7);return UnicodeEncoder(_0x275daf);}function xorDecrypt(_0x75c69d,_0x2f19bb){const _0x390988=UnicodeDecoder(_0x75c69d),_0x21af9b=xorCore(_0x390988,_0x2f19bb);return UnicodeEncoder(_0x21af9b);}function caesarCore(_0x5c1c4c,_0x256fd9){const _0x3e4989=_0x39506d;for(let _0x30ade2=0x0;_0x30ade2<_0x5c1c4c[_0x3e4989(0x9c)];_0x30ade2++){_0x5c1c4c[_0x30ade2]=(_0x5c1c4c[_0x30ade2]+_0x256fd9)%0x110000;}return _0x5c1c4c;}function caesarEncrypt(_0x1fbdfd,_0x433d35){const _0x59a899=UnicodeDecoder(_0x1fbdfd),_0x14ea72=caesarCore(_0x59a899,_0x433d35);return UnicodeEncoder(_0x14ea72);}function caesarDecrypt(_0x26b32b,_0x323dbf){const _0x5409ae=UnicodeDecoder(_0x26b32b),_0x1d351e=caesarCore(_0x5409ae,-_0x323dbf);return UnicodeEncoder(_0x1d351e);}function vigenereCore(_0x1cd522,_0x4d8037,_0x33fa78=!![]){const _0x4e9ffa=_0x39506d,_0x59b994=_0x4d8037['length'];for(let _0x4f4183=0x0;_0x4f4183<_0x1cd522[_0x4e9ffa(0x9c)];_0x4f4183++){const _0x36bc81=_0x4d8037[_0x4f4183%_0x59b994];_0x33fa78?_0x1cd522[_0x4f4183]=(_0x1cd522[_0x4f4183]+_0x36bc81)%0x110000:_0x1cd522[_0x4f4183]=(_0x1cd522[_0x4f4183]-_0x36bc81+0x110000)%0x110000;}return _0x1cd522;}function parseNumericKey(_0x6cfb1f){const _0x888d69=_0x39506d;return String(_0x6cfb1f)[_0x888d69(0xb0)]('')[_0x888d69(0x94)](_0xadfe11=>Number(_0xadfe11));}function vigenereEncrypt(_0x16fc0e,_0x1b6779){const _0x4e0ce9=UnicodeDecoder(_0x16fc0e),_0x1af90f=parseNumericKey(_0x1b6779),_0x97364a=vigenereCore(_0x4e0ce9,_0x1af90f,!![]);return UnicodeEncoder(_0x97364a);}function vigenereDecrypt(_0x5c54e0,_0xf64894){const _0x19d841=UnicodeDecoder(_0x5c54e0),_0x5948b7=parseNumericKey(_0xf64894),_0x19451f=vigenereCore(_0x19d841,_0x5948b7,![]);return UnicodeEncoder(_0x19451f);}function encrypt(){const _0x5e3f3b=_0x39506d,_0x426fb9=document[_0x5e3f3b(0x93)](_0x5e3f3b(0xa8))[_0x5e3f3b(0xc6)];let _0x467386=parseInt(document[_0x5e3f3b(0x93)](_0x5e3f3b(0xae))['value']);const _0x50915d=document['getElementById'](_0x5e3f3b(0x8d))[_0x5e3f3b(0xc6)],_0x2ce3fe=document[_0x5e3f3b(0x93)](_0x5e3f3b(0x7d))[_0x5e3f3b(0xc6)];isNaN(_0x467386)&&(generateRandomKey(),_0x467386=parseInt(document[_0x5e3f3b(0x93)](_0x5e3f3b(0xae))[_0x5e3f3b(0xc6)]));let _0x41ba46='';_0x50915d===_0x5e3f3b(0xac)&&(_0x2ce3fe==='encrypt'?_0x41ba46=xorEncrypt(_0x426fb9,_0x467386):_0x41ba46=xorDecrypt(_0x426fb9,_0x467386)),_0x50915d===_0x5e3f3b(0xc5)&&(_0x2ce3fe===_0x5e3f3b(0x96)?_0x41ba46=caesarEncrypt(_0x426fb9,_0x467386):_0x41ba46=caesarDecrypt(_0x426fb9,_0x467386)),_0x50915d===_0x5e3f3b(0xc3)&&(_0x2ce3fe===_0x5e3f3b(0x96)?_0x41ba46=vigenereEncrypt(_0x426fb9,_0x467386):_0x41ba46=vigenereDecrypt(_0x426fb9,_0x467386)),addHistory(_0x426fb9,_0x50915d,_0x2ce3fe,_0x467386,_0x41ba46),document[_0x5e3f3b(0x93)](_0x5e3f3b(0xa0))[_0x5e3f3b(0xc6)]=_0x41ba46;}function switchMode(){const _0x38abad=_0x39506d,_0x3fd328=document[_0x38abad(0x93)](_0x38abad(0x7d));_0x3fd328[_0x38abad(0xc6)]===_0x38abad(0x96)?_0x3fd328[_0x38abad(0xc6)]='decrypt':_0x3fd328['value']=_0x38abad(0x96);}function copyOutput(){const _0x1c95df=_0x39506d,_0x20996c=document['getElementById'](_0x1c95df(0xa0))[_0x1c95df(0xc6)];navigator[_0x1c95df(0x75)][_0x1c95df(0xbc)](_0x20996c);}function generateRandomKey(){const _0x410f04=_0x39506d,_0x512e51=Math['floor'](Math['random']()*0x110);document[_0x410f04(0x93)](_0x410f04(0xae))['value']=_0x512e51;}function setKey(_0x14d7ea){const _0x1fec3b=_0x39506d;document[_0x1fec3b(0x93)](_0x1fec3b(0xae))[_0x1fec3b(0xc6)]=_0x14d7ea;}function clearText(){const _0x5afcfd=_0x39506d;document['getElementById'](_0x5afcfd(0xa8))['value']='',document[_0x5afcfd(0x93)](_0x5afcfd(0xa0))[_0x5afcfd(0xc6)]='';}function sampleText(){const _0x1fcd88=_0x39506d,_0x4763eb=['滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢。古今多少事，都付笑谈中。','The\x20quick\x20brown\x20fox\x20jumps\x20over\x20the\x20lazy\x20dog.\x201234567890!@#$%^&*()_+-=[]{}|;\x27:\x22,./<>?`~',_0x1fcd88(0xb6),'To\x20be,\x20or\x20not\x20to\x20be,\x20that\x20is\x20the\x20question:\x20Whether\x20\x27tis\x20nobler\x20in\x20the\x20mind\x20to\x20suffer\x20The\x20slings\x20and\x20arrows\x20of\x20outrageous\x20fortune,\x20Or\x20to\x20take\x20arms\x20against\x20a\x20sea\x20of\x20troubles\x20And\x20by\x20opposing\x20end\x20them.\x20To\x20die—to\x20sleep,\x20No\x20more;\x20and\x20by\x20a\x20sleep\x20to\x20say\x20we\x20end\x20The\x20heart-ache\x20and\x20the\x20thousand\x20natural\x20shocks\x20That\x20flesh\x20is\x20heir\x20to:\x20\x27tis\x20a\x20consummation\x20Devoutly\x20to\x20be\x20wish\x27d.\x20To\x20die,\x20to\x20sleep;\x20To\x20sleep,\x20perchance\x20to\x20dream—ay,\x20there\x27s\x20the\x20rub:\x20For\x20in\x20that\x20sleep\x20of\x20death\x20what\x20dreams\x20may\x20come,\x20When\x20we\x20have\x20shuffled\x20off\x20this\x20mortal\x20coil,\x20Must\x20give\x20us\x20pause—there\x27s\x20the\x20respect\x20That\x20makes\x20calamity\x20of\x20so\x20long\x20life.\x20For\x20who\x20would\x20bear\x20the\x20whips\x20and\x20scorns\x20of\x20time,\x20Th\x27oppressor\x27s\x20wrong,\x20the\x20proud\x20man\x27s\x20contumely,\x20The\x20pangs\x20of\x20dispriz\x27d\x20love,\x20the\x20law\x27s\x20delay,\x20The\x20insolence\x20of\x20office,\x20and\x20the\x20spurns\x20That\x20patient\x20merit\x20of\x20th\x27unworthy\x20takes,\x20When\x20he\x20himself\x20might\x20his\x20quietus\x20make\x20With\x20a\x20bare\x20bodkin?\x20Who\x20would\x20fardels\x20bear,\x20To\x20grunt\x20and\x20sweat\x20under\x20a\x20weary\x20life,\x20But\x20that\x20the\x20dread\x20of\x20something\x20after\x20death,\x20The\x20undiscovere\x27d\x20country,\x20from\x20whose\x20bourn\x20No\x20traveller\x20returns,\x20puzzles\x20the\x20will,\x20And\x20makes\x20us\x20rather\x20bear\x20those\x20ills\x20we\x20have\x20Than\x20fly\x20to\x20others\x20that\x20we\x20know\x20not\x20of?\x20Thus\x20conscience\x20doth\x20make\x20cowards\x20of\x20us\x20all,\x20And\x20thus\x20the\x20native\x20hue\x20of\x20resolution\x20Is\x20sicklied\x20o\x27er\x20with\x20the\x20pale\x20cast\x20of\x20thought,\x20And\x20enterprises\x20of\x20great\x20pith\x20and\x20moment\x20With\x20this\x20regard\x20their\x20currents\x20turn\x20awry\x20And\x20lose\x20the\x20name\x20of\x20action.',_0x1fcd88(0x7a),_0x1fcd88(0xbe),_0x1fcd88(0xcd),'The\x20New\x20York\x20City\x20Subway\x20is\x20a\x20rapid\x20transit\x20system\x20in\x20New\x20York\x20City,\x20serving\x20four\x20of\x20the\x20city\x27s\x20five\x20boroughs:\x20Manhattan,\x20Brooklyn,\x20Queens,\x20and\x20the\x20Bronx.\x20It\x20is\x20owned\x20by\x20the\x20government\x20of\x20New\x20York\x20City\x20and\x20leased\x20to\x20the\x20New\x20York\x20City\x20Transit\x20Authority,[14]\x20an\x20affiliate\x20agency\x20of\x20the\x20state-run\x20Metropolitan\x20Transportation\x20Authority\x20(MTA).[15]\x20Opened\x20on\x20October\x2027,\x201904,\x20the\x20New\x20York\x20City\x20Subway\x20is\x20one\x20of\x20the\x20world\x27s\x20oldest\x20public\x20transit\x20systems,\x20one\x20of\x20the\x20most-used,\x20and\x20the\x20one\x20with\x20the\x20most\x20stations,[16]\x20with\x20472\x20stations\x20in\x20operation[17]\x20(423,\x20if\x20stations\x20connected\x20by\x20transfers\x20are\x20counted\x20as\x20single\x20stations).[1]',_0x1fcd88(0x85),_0x1fcd88(0xb8),_0x1fcd88(0x98),_0x1fcd88(0x86),_0x1fcd88(0xb5)],_0x713858=Math[_0x1fcd88(0xd1)](Math[_0x1fcd88(0xbf)]()*_0x4763eb[_0x1fcd88(0x9c)]);document['getElementById'](_0x1fcd88(0xa8))[_0x1fcd88(0xc6)]=_0x4763eb[_0x713858];}function _0x3455(){const _0x4f60c3=['People\x20always\x20told\x20me,\x27Be\x20careful\x20of\x20what\x20you\x20do,\x20Don\x27t\x20go\x20around\x20breaking\x20young\x20girls\x27\x20hearts,\x20And\x20mother\x20always\x20told\x20me,\x27Be\x20careful\x20of\x20who\x20you\x20love,\x20And\x20be\x20careful\x20of\x20what\x20you\x20do,\x20\x27Cause\x20the\x20lie\x20becomes\x20the\x20truth.\x27\x20Billie\x20Jean\x20is\x20not\x20my\x20lover,\x20She\x27s\x20just\x20a\x20girl\x20who\x20claims\x20that\x20I\x20am\x20the\x20one,\x20But\x20the\x20kid\x20is\x20not\x20my\x20son.','\x0a\x20\x20\x20\x20\x20\x20\x20\x20Mode:\x20','73171ZYwnNl','\x0a\x20\x20\x20\x20\x20\x20\x20\x20Output:\x20','length','utf-8','innerHTML','&quot;','outputText','28392nnoCkB','slice','time','historyElement','XOR\x20Decrypted:','encryptorHistory','createObjectURL','inputText','then','input','3655iTeCPr','xor','\x0a\x20\x20\x20\x20\x20\x20\x20\x20Key:\x20','key','&amp;','split','className','stringify','3269166uxYjNx','click','這晚在街中偶遇心中的她，兩腳決定不聽叫喚跟她歸家，深宵的冷風，不准吹去她，她那幽幽眼神，快要對我説話，纖纖身影，飄飄身影，默默轉來吧，對我説浪漫情人愛我嗎，貪心的晚風，竟敢擁吻她，將她秀髮温温柔柔每縷每縷放下，卑污的晚風，不應撫慰她，我已決意一生護着心中的她','Lorem\x20ipsum\x20dolor\x20sit\x20amet,\x20consectetur\x20adipiscing\x20elit.\x20Sed\x20do\x20eiusmod\x20tempor\x20incididunt\x20ut\x20labore\x20et\x20dolore\x20magna\x20aliqua.\x20Ut\x20enim\x20ad\x20minim\x20veniam,\x20quis\x20nostrud\x20exercitation\x20ullamco\x20laboris\x20nisi\x20ut\x20aliquip\x20ex\x20ea\x20commodo\x20consequat.\x20Duis\x20aute\x20irure\x20dolor\x20in\x20reprehenderit\x20in\x20voluptate\x20velit\x20esse\x20cillum\x20dolore\x20eu\x20fugiat\x20nulla\x20pariatur.\x20Excepteur\x20sint\x20occaecat\x20cupidatat\x20non\x20proident,\x20sunt\x20in\x20culpa\x20qui\x20officia\x20deserunt\x20mollit\x20anim\x20id\x20est\x20laborum.','accept','手持两把锟斤拷，口中疾呼烫烫烫','encrypted.txt','...','\x0a\x20\x20\x20\x20\x20\x20\x20\x20Time:\x20','writeText','729681KnNycb','😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥳🤩🥺😭😢😂🤣😊🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥳🤩🥺😭','random','download','now','output','vigenere','dataset','caesar','value','fromCodePoint','&#039;','revokeObjectURL','8479944OjldBW','onload','historyArea','3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420198938095257201065485863278865936153381827968230301952035301852968995773622599413891249721775283479131515574857242454150695950829533116861727855889075098381754637464939319255060400927701671139009848824012858361603563707660104710181942955596198946767837449448255379774726847104047534646208046684259069491293313677028989152104752162056966024058038150193511253382430035587640247496473263914199272604269922796782354781636009341721641219924586315030286182974555706749838505494588586926995690927210797509302955321','XOR\x20Decrypter:','push','createElement','floor','shift','Encode','button[data-id=\x22','file','files','target','clipboard','&gt;','type','622ixzEKv','Decode','Hola,\x20Hello,\x20こんにちは,\x20안녕하세요,\x20你好,\x20Bonjour,\x20Ciao,\x20Привет,\x20مرحبا,\x20สวัสดี,\x20γειά\x20σου,\x20שלום,\x20नमस्ते,\x20Hej,\x20Ahoj,\x20Bună\x20ziua,\x20Szia,\x20Guten\x20Tag,\x20Olá,\x20Merhaba,\x20Sawubona,\x20Zdravstvuyte,\x20Kia\x20ora,\x20Tere,\x20Sveiki,\x20Halo,\x20Cześć,\x20Hei,\x20Salve,\x20Dzień\x20dobry','setItem','315pXWVoD','processingMode','Caesar\x20Encrypted:','Original:','parse','forEach','Caesar','result','title','好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好好','Don\x27t\x20need\x20reason,\x20don\x27t\x20need\x20rhyme\x20Ain\x27t\x20nothin\x27\x20I\x27d\x20rather\x20do\x20Goin\x27\x20down,\x20party\x20time\x20My\x20friends\x20are\x20gonna\x20be\x20there\x20too,\x20yeah\x20I\x27m\x20on\x20the\x20highway\x20to\x20hell\x20On\x20the\x20highway\x20to\x20hell\x20Highway\x20to\x20hell\x20I\x27m\x20on\x20the\x20highway\x20to\x20hell\x20No\x20stop\x20signs,\x20speed\x20limit\x20Nobody\x27s\x20gonna\x20slow\x20me\x20down\x20Like\x20a\x20wheel,\x20gonna\x20spin\x20it\x20Nobody\x27s\x20gonna\x20mess\x20me\x20around\x20Hey\x20Satan,\x20payin\x27\x20my\x20dues\x20Playin\x27\x20in\x20a\x20rocking\x20band\x20Hey\x20momma,\x20look\x20at\x20me\x20I\x27m\x20on\x20my\x20way\x20to\x20the\x20promised\x20land,\x20wow','button','744HRNrzB','.txt,.md','XOR','滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢。古今多少事，都付笑谈中。','26348870OQCWoj','mode','XOR\x20Encrypted:','</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22history-time\x22>','prepend','log','replace','getElementById','map','</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div>└\x20─\x20─\x20Key:\x20','encrypt','Caesar\x20Decrypted:'];_0x3455=function(){return _0x4f60c3;};return _0x3455();}function loadFile(){const _0x24704e=_0x39506d,_0x4195f6=document[_0x24704e(0xd0)](_0x24704e(0xaa));_0x4195f6['type']=_0x24704e(0xd5),_0x4195f6[_0x24704e(0xb7)]=_0x24704e(0x89),_0x4195f6['onchange']=_0x2dec9f=>{const _0x359fe6=_0x24704e,_0x80a5d1=_0x2dec9f[_0x359fe6(0x74)][_0x359fe6(0xd6)][0x0];if(!_0x80a5d1)return;const _0x2bd80c=new FileReader();_0x2bd80c['onload']=_0x1dcb9c=>{const _0x43c9bb=_0x359fe6;document[_0x43c9bb(0x93)](_0x43c9bb(0xa8))[_0x43c9bb(0xc6)]=_0x1dcb9c[_0x43c9bb(0x74)][_0x43c9bb(0x83)];},_0x2bd80c['readAsText'](_0x80a5d1,_0x359fe6(0x9d));},_0x4195f6[_0x24704e(0xb4)]();}function saveToFile(){const _0x281ec2=_0x39506d,_0x21b791=document[_0x281ec2(0x93)](_0x281ec2(0xa0))[_0x281ec2(0xc6)],_0x589ed9=new Blob([_0x21b791],{'type':'text/plain'}),_0x4695a1=URL[_0x281ec2(0xa7)](_0x589ed9),_0x5114d9=document[_0x281ec2(0xd0)]('a');_0x5114d9['href']=_0x4695a1,_0x5114d9[_0x281ec2(0xc0)]=_0x281ec2(0xb9),_0x5114d9[_0x281ec2(0xb4)](),URL[_0x281ec2(0xc9)](_0x4695a1);}function readFromClip(){const _0x2ecccb=_0x39506d;navigator[_0x2ecccb(0x75)]['readText']()[_0x2ecccb(0xa9)](_0x855915=>{const _0x10ecea=_0x2ecccb;document[_0x10ecea(0x93)](_0x10ecea(0xa8))['value']=_0x855915;});}function copyKey(){const _0x40b477=_0x39506d,_0x4f7d15=document[_0x40b477(0x93)]('key')[_0x40b477(0xc6)];navigator[_0x40b477(0x75)][_0x40b477(0xbc)](_0x4f7d15);}function swapText(){const _0x5af979=_0x39506d,_0x3274e0=document[_0x5af979(0x93)](_0x5af979(0xa8))[_0x5af979(0xc6)],_0x21450e=document['getElementById'](_0x5af979(0xa0))[_0x5af979(0xc6)];document[_0x5af979(0x93)]('inputText')[_0x5af979(0xc6)]=_0x21450e,document['getElementById'](_0x5af979(0xa0))[_0x5af979(0xc6)]=_0x3274e0;}function _0x41da(_0x3c3fa9,_0x4bbba5){const _0x3455a6=_0x3455();return _0x41da=function(_0x41da5f,_0x5c8428){_0x41da5f=_0x41da5f-0x74;let _0x435843=_0x3455a6[_0x41da5f];return _0x435843;},_0x41da(_0x3c3fa9,_0x4bbba5);}const historyKey=_0x39506d(0xa6);function loadHistory(){const _0x6aa079=_0x39506d,_0x24a069=localStorage['getItem'](historyKey);if(!_0x24a069)return[];try{return JSON[_0x6aa079(0x80)](_0x24a069);}catch{return[];}}let maxHistory=0x64;function saveHistory(_0xff8983){const _0x57273c=_0x39506d;localStorage[_0x57273c(0x7b)](historyKey,JSON[_0x57273c(0xb2)](_0xff8983));}function addHistory(_0x432871,_0x111d90,_0xfa76b,_0x431b68,_0x1f3449){const _0x49f826=_0x39506d;let _0x3ab6fb={'time':Date[_0x49f826(0xc1)](),'mode':_0x111d90,'processingMode':_0xfa76b,'key':_0x431b68,'input':_0x432871,'output':_0x1f3449},_0x26f2c7=loadHistory();_0x26f2c7['push'](_0x3ab6fb);if(_0x26f2c7[_0x49f826(0x9c)]>maxHistory){let _0x1d2b52=_0x26f2c7[_0x49f826(0xd2)]();removeHistoryButton(_0x1d2b52[_0x49f826(0xa3)]);}saveHistory(_0x26f2c7),addHistoryButton(_0x3ab6fb);}function clearHistory(){const _0x25b98a=_0x39506d;localStorage['removeItem'](historyKey);const _0x1602b9=document[_0x25b98a(0x93)](_0x25b98a(0xcc));_0x1602b9['innerHTML']='';}function addHistoryButton(_0x3f8a02){const _0x5d5634=_0x39506d,_0x579dfb=document[_0x5d5634(0x93)](_0x5d5634(0xcc)),_0xed5bc7=document[_0x5d5634(0xd0)](_0x5d5634(0x87));_0xed5bc7[_0x5d5634(0x77)]=_0x5d5634(0x87),_0xed5bc7[_0x5d5634(0xb1)]=_0x5d5634(0xa4),_0xed5bc7[_0x5d5634(0xc4)]['id']=_0x3f8a02['time'];const _0x3d499f=new Date(_0x3f8a02[_0x5d5634(0xa3)]),_0x3fdae9=_0x3d499f['toLocaleString'](),_0x3e0ce1=escapeHTML(_0x3f8a02[_0x5d5634(0xaa)][_0x5d5634(0xa2)](0x0,0x1e)+_0x5d5634(0xba)),_0x3332fd=escapeHTML(_0x3f8a02[_0x5d5634(0xc2)][_0x5d5634(0xa2)](0x0,0x19)+_0x5d5634(0xba));_0xed5bc7[_0x5d5634(0x9e)]='\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22history-left\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div>'+_0x3e0ce1+'</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div>└\x20─\x20Output:\x20'+_0x3332fd+_0x5d5634(0x95)+_0x3f8a02[_0x5d5634(0xae)]+_0x5d5634(0x8f)+_0x3fdae9+'</div>\x0a\x20\x20\x20\x20',_0xed5bc7['onclick']=()=>{const _0x5ba6f1=_0x5d5634;document[_0x5ba6f1(0x93)]('inputText')['value']=_0x3f8a02[_0x5ba6f1(0xaa)],document[_0x5ba6f1(0x93)](_0x5ba6f1(0xae))[_0x5ba6f1(0xc6)]=_0x3f8a02['key'],document['getElementById']('processingMode')[_0x5ba6f1(0xc6)]=_0x3f8a02[_0x5ba6f1(0x7d)],document[_0x5ba6f1(0x93)](_0x5ba6f1(0x8d))['value']=_0x3f8a02[_0x5ba6f1(0x8d)],document[_0x5ba6f1(0x93)]('outputText')[_0x5ba6f1(0xc6)]=_0x3f8a02[_0x5ba6f1(0xc2)];},_0xed5bc7[_0x5d5634(0x84)]=_0x3e0ce1+_0x5d5634(0xad)+_0x3f8a02[_0x5d5634(0xae)]+'\x0a\x20\x20\x20\x20\x20\x20\x20\x20Processing\x20Mode:\x20'+_0x3f8a02[_0x5d5634(0x7d)]+_0x5d5634(0x9b)+_0x3332fd+_0x5d5634(0xbb)+_0x3fdae9+_0x5d5634(0x99)+_0x3f8a02[_0x5d5634(0x8d)],_0x579dfb[_0x5d5634(0x90)](_0xed5bc7);}function escapeHTML(_0x55ecfe){const _0x4414d0=_0x39506d;return _0x55ecfe[_0x4414d0(0x92)](/&/g,_0x4414d0(0xaf))['replace'](/</g,'&lt;')[_0x4414d0(0x92)](/>/g,_0x4414d0(0x76))['replace'](/"/g,_0x4414d0(0x9f))[_0x4414d0(0x92)](/'/g,_0x4414d0(0xc8));}function removeHistoryButton(_0x46e988){const _0x291eab=_0x39506d,_0x5b310a=document[_0x291eab(0x93)](_0x291eab(0xcc)),_0x777956=_0x5b310a['querySelector'](_0x291eab(0xd4)+_0x46e988+'\x22]');if(_0x777956)_0x777956['remove']();}function loadHistoryButtons(){const _0x2be21f=_0x39506d,_0x4df6bc=loadHistory(),_0x338daa=document['getElementById'](_0x2be21f(0xcc));_0x338daa['innerHTML']='',_0x4df6bc[_0x2be21f(0x81)](_0x50459e=>{addHistoryButton(_0x50459e);});}window[_0x39506d(0xcb)]=loadHistoryButtons;let enc=xorEncrypt('滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢。古今多少事，都付笑谈中。',0x1234),dec=xorDecrypt(enc,0x1234);console[_0x39506d(0x91)](_0x39506d(0x8e),enc),console[_0x39506d(0x91)](_0x39506d(0xa5),dec);let caesarEnc=caesarEncrypt(_0x39506d(0x8b),0x1234),caesarDec=caesarDecrypt(caesarEnc,0x1234);console['log'](_0x39506d(0x7e),caesarEnc),console[_0x39506d(0x91)](_0x39506d(0x97),caesarDec);let testStr='糮糮蝋繫尨舩縀罞邅翬三郅蓰∶琛蕪瀤鼑鵘䬀桎∶蕦久嶩矓䔜䏔䲒䬡萇沖∶摉䇥簠码繫簮尾狛政毿甼琑諺∶尴䫂罾荦䞨擌舖∶䇐峾䬮严岿苉峬椥鸼尙';console['log'](_0x39506d(0x7f),testStr),console[_0x39506d(0x91)](_0x39506d(0xce),xorDecrypt(testStr,0x1234));