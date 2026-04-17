


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
    const inputPreview = record.input.slice(0, 30) + "...";
    const outputPreview = record.output.slice(0, 30) + "...";

    //display in button
    btn.innerHTML = `
        <div class="history-left">
            <div>Input: ${inputPreview}</div>
            <div>Key: ${record.key}</div>
            <div>Output: ${outputPreview}</div>
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


