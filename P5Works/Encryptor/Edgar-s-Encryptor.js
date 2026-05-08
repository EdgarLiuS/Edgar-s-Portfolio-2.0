

//obselete, no need to enumerate here
let cipher = ["XOR", "Caesar"];
let cipherModes = ["Encode", "Decode"];

let text = document.getElementById("inputText");

//--------------------------------------------------------------------------------------------------------------
//Unicode and Visual operations
function UnicodeDecoder(str) {
    let result = [];
    for (let i = 0; i < str.length; i++) {
        const cp = str.codePointAt(i);//UTF-16 edition
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
//Atbash Cipher 

function atbashForUnicode(cps) {
    const maxCodePoint = 0x10FFFF;
    for(let i = 0; i < cps.length; i++){
        cps[i] = maxCodePoint - cps[i];
    }
    return cps;
}
function atbashEncrypt(str) {
    const cps = UnicodeDecoder(str);
    const encrypted = atbashForUnicode(cps);
    return UnicodeEncoder(encrypted);
}
function atbashDecrypt(str) {
    const cps = UnicodeDecoder(str);
    const decrypted = atbashForUnicode(cps);
    return UnicodeEncoder(decrypted);
}
//--------------------------------------------------------------------------------------------------------------
//Bit Rotation
function rotateBits(cps, key, encrypt=true) {
    //who ever needs this, needs this
    const bitLength = 21; // Unicode code points fit in 21 bits
    for(let i = 0; i < cps.length; i++){
        if(encrypt){
            cps[i] = ((cps[i] << key) | (cps[i] >> (bitLength - key))) & 0x1FFFFF;
        } else {
            cps[i] = ((cps[i] >> key) | (cps[i] << (bitLength - key))) & 0x1FFFFF;
        }
        cps[i] = cps[i] % 0x110000; // ensure it's still a valid Unicode code point
    }
    return cps;
}

function rotateEncrypt(str, key) {
    const cps = UnicodeDecoder(str);
    const encrypted = rotateBits(cps, key, true);
    return UnicodeEncoder(encrypted);
}
function rotateDecrypt(str, key) {
    const cps = UnicodeDecoder(str);
    const decrypted = rotateBits(cps, key, false);
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
    if (cipher === "atbash") {
        if (mode === "encrypt") {
            output = atbashEncrypt(input);
        } else {
            output = atbashDecrypt(input);
        }
    }
    if (cipher === "rotate") {
        if (mode === "encrypt") {
            output = rotateEncrypt(input, key);
        } else {
            output = rotateDecrypt(input, key);
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
        "這晚在街中偶遇心中的她，兩腳決定不聽叫喚跟她歸家，深宵的冷風，不准吹去她，她那幽幽眼神，快要對我説話，纖纖身影，飄飄身影，默默轉來吧，對我説浪漫情人愛我嗎，貪心的晚風，竟敢擁吻她，將她秀髮温温柔柔每縷每縷放下，卑污的晚風，不應撫慰她，我已決意一生護着心中的她",
        "2.71828182845904523536028747135266249775724709369995957496696762772407663035354759457138217852516642742746639193200305992181741359662904357290033429526059563073813232862794349076323382988075319525101901157383418793070215408914993488416750924476146066808226480016847741185374234544243710753907774499206955170276183860626133138458300075204493382656029760673711320070932870912744374704723069697720931014169283681902551510865746377211125238978442505695369677078544996996794686445490598793163688923009879312773617821542499922957635148220826989519366803318252886939849646510582093923982948879332036250944311730123819706841614039701983767932068328237646480429531180232878250981945581530175671736133206981125099618188159304169035159888851934580727386673858942287922849989208680582574927961048419844436346324496848756023362482704197862320900216099023530436994184914631409343173814364054625315209618369088870701676839642437814059271456354906130310720851038375051011574770417189861068739696552126715468895703503",
        "Des yeux qui font baisser les miens Un rire qui se perd sur sa bouche Voilà le portrait sans retouche De l'homme auquel j'appartiens Quand il me prend dans ses bras Qu’il me parle tout bas Je vois la vie en rose Il me dit des mots d'amour Des mots de tous les jours Et ça me fait quelque chose Il est entré dans mon cœur Une part de bonheur Dont je connais la cause C'est lui pour moi Moi pour lui dans la vie Il me l'a dit l'a juré pour la vie Et dès que je l'aperçois Alors je sens en moi Mon cœur qui ba Des nuits d'amour à plus finir Un grand bonheur qui prend sa place Des ennuis des chagrins s’effacent Heureux heureux à en mourir Quand il me prend dans ses bras Qu'il me parle tout bas Je vois la vie en rose ll me dit des mots d'amour Des mots de tous les jours Et ça me fait quelque chose ll est entré dans mon cœur Une part de bonheur Dont je connais la cause C’est toi pour moi Moi pour toi Dans la vie Tu me l'as dit m’as juré Pour la vie Et dès que je t'aperçois Alors je sens en moi Mon cœur qui bat.",
        "Shader 'Custom/BRDF' { Properties { _BaseColor ('Base Color', Color) = (1,1,1,1) _AmbientStrength ('Ambient Strength', Range(0,1)) = 0.1 _Roughness ('Roughness', Range(0,1)) = 0.5 _Metallic ('Metallic', Range(0,1)) = 0.0 _BaseMap ('Base Map', 2D) = 'white' {} } SubShader { Tags { 'RenderPipeline' = 'UniversalPipeline' 'RenderType'     = 'Opaque' 'Queue'          = 'Geometry' } Pass { Name 'ForwardLit' Tags { 'LightMode' = 'UniversalForward' } HLSLPROGRAM // must have #pragma vertex   vert #pragma fragment frag #pragma multi_compile _ _MAIN_LIGHT_SHADOWS _MAIN_LIGHT_SHADOWS_CASCADE #include 'Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl' #include 'Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl' // material properties CBUFFER_START(UnityPerMaterial) float4 _BaseColor; half _AmbientStrength; half _Roughness; half _Metallic; TEXTURE2D(_BaseMap); SAMPLER(sampler_BaseMap); CBUFFER_END // vertex shader inputs struct Attributes { float3 positionOS : POSITION; // object space position float3 normalOS   : NORMAL;   // object space normal float2 uv         : TEXCOORD0; // UV coordinates (if needed for textures) }; struct Varyings { float4 positionCS   : SV_POSITION; // clip space position for rasterization float3 normalWS     : TEXCOORD0;   // world normal for lighting float4 shadowCoord  : TEXCOORD1;   // shadow map position float3 positionWS   : TEXCOORD2;   // world space position float2 uv           : TEXCOORD3;   // pass UVs to fragment shader if needed }; Varyings vert (Attributes IN) { Varyings OUT; // use URP's built-in functions to get vertex positions and normals in the correct spaces VertexPositionInputs posInputs = GetVertexPositionInputs(IN.positionOS); VertexNormalInputs   nrmInputs = GetVertexNormalInputs(IN.normalOS); OUT.positionCS  = posInputs.positionCS; OUT.normalWS    = nrmInputs.normalWS; //calculate shadow coordinates for the main light OUT.shadowCoord = GetShadowCoord(posInputs); OUT.positionWS = posInputs.positionWS; OUT.uv = IN.uv; return OUT; } //--------------------------------------------------------------------------------------------------------- //Diffuse half DiffuseLambert(half3 normal, half3 lightDir) { return saturate(dot(normal, lightDir)); } //--------------------------------------------------------------------------------------------------------- //Get shadow tool half GetShadowAttenuation(Light light, float4 shadowCoord) { return light.shadowAttenuation; } //--------------------------------------------------------------------------------------------------------- //Specular half SpecularBlinnPhong(half3 normal, half3 lightDir, half3 viewDir, half roughness) { half3 halfDir = normalize(lightDir + viewDir); half NdotH = saturate(dot(normal, halfDir)); return pow(NdotH, 1.0 / roughness); } //--------------------------------------------------------------------------------------------------------- //PBR Bidirectional Reflectance Distribution Function half3 FresnelSchlick(half3 F0, half NdotV) { return F0 + (1.0 - F0) * pow(1.0 - NdotV, 5.0); } half3 FresnelSchlickRoughness(half3 F0, half NdotV, half roughness) { half3 oneMinusRoughness = half3(1.0 - roughness, 1.0 - roughness, 1.0 - roughness); half3 FSR = F0 + (max(oneMinusRoughness, F0) - F0) * pow(1.0 - NdotV, 5.0); return FSR; } half3 GeometrySmith(half3 normal, half3 viewDir, half3 lightDir, half roughness) { half k = (roughness + 1.0) * (roughness + 1.0) / 8.0; // remapping roughness to [0,1] half NdotV = saturate(dot(normal, viewDir)); half NdotL = saturate(dot(normal, lightDir)); half G_V = NdotV / (NdotV * (1.0 - k) + k); half G_L = NdotL / (NdotL * (1.0 - k) + k); return G_V * G_L; } half3 NormalDistribution(half3 normal, half3 halfDir, half roughness) { half alpha = roughness * roughness; half alpha2 = alpha * alpha; half NdotH = saturate(dot(normal, halfDir)); half denom = NdotH * NdotH * (alpha2 - 1.0) + 1.0; return alpha2 / (PI * denom * denom); } half3 BRDF(half3 normal, half3 lightDir, half3 viewDir, half roughness, half metallic) { half3 F0 = lerp(half3(0.04, 0.04, 0.04), _BaseColor.rgb, metallic); half NdotV = saturate(dot(normal, viewDir)); half NdotL = saturate(dot(normal, lightDir)); half3 halfDir = normalize(lightDir + viewDir); half3 F = FresnelSchlickRoughness(F0, NdotV, roughness); half  G = GeometrySmith(normal, viewDir, lightDir, roughness); half  D = NormalDistribution(normal, halfDir, roughness); half3 specular = (F * G * D) / max(4.0 * NdotV * NdotL, 0.001); // --- Lambert diffuse with energy conservation --- half3 kd = (1.0 - F) * (1.0 - metallic); half3 diffuse = kd * _BaseColor.rgb * NdotL; return diffuse + specular; } //--------------------------------------------------------------------------------------------------------- //Image Based Lighting function half3 IBL(half3 normal, half3 viewDir, half roughness, half metallic) { half3 F0 = lerp(0.04.xxx, _BaseColor.rgb, metallic); half NdotV = saturate(dot(normal, viewDir)); // --- Diffuse IBL --- half3 diffuseIBL = SampleSH(normal) * _BaseColor.rgb * (1 - metallic); // --- Specular IBL --- half3 R = reflect(-viewDir, normal); // 手动采样 unity_SpecCube0 half mip = roughness * 6.0; half3 specEnv = SAMPLE_TEXTURECUBE_LOD(unity_SpecCube0, samplerunity_SpecCube0, R, mip).rgb; half3 F = FresnelSchlickRoughness(F0, NdotV, roughness)*0.5; half3 specularIBL = specEnv * F; return diffuseIBL + specularIBL; } //--------------------------------------------------------------------------------------------------------- //Additional lights function half3 AdditionalLights(half3 normal, Varyings IN, half roughness) { half3 viewDir = normalize(_WorldSpaceCameraPos - IN.positionWS); half3 sum = 0; uint lightCount = GetAdditionalLightsCount(); for (uint i = 0; i < lightCount; i++) { Light light = GetAdditionalLight(i, IN.positionWS); half3 brdf = BRDF(normal, light.direction, viewDir, roughness, _Metallic); half NdotL = saturate(dot(normal, light.direction)); half shadow = GetShadowAttenuation(light, IN.shadowCoord); sum += light.color * NdotL * brdf * light.distanceAttenuation * shadow; } return sum; } //--------------------------------------------------------------------------------------------------------- //output of the fragment shader half4 frag (Varyings IN) : SV_Target { half3 normalWS = normalize(IN.normalWS); Light mainLight = GetMainLight(IN.shadowCoord); half3 viewDir = normalize(_WorldSpaceCameraPos - IN.positionWS); // --- PBR BRDF --- half3 brdf = BRDF(normalWS, mainLight.direction, viewDir, _Roughness, _Metallic); half NdotL = saturate(dot(normalWS, mainLight.direction)); half shadow = GetShadowAttenuation(mainLight, IN.shadowCoord); half3 litColor = mainLight.color * NdotL * brdf * shadow; half3 finalColor = litColor * _BaseColor.rgb; finalColor += AdditionalLights(normalWS, IN, _Roughness); half3 ibl = IBL(normalWS, viewDir, _Roughness, _Metallic); finalColor += ibl; return half4(finalColor, _BaseColor.a); } ENDHLSL } Pass { Name 'ShadowCaster' Tags { 'LightMode' = 'ShadowCaster' } ZWrite On ZTest LEqual ColorMask 0 HLSLPROGRAM #pragma vertex vert #pragma fragment frag #include 'Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl' struct Attributes { float3 positionOS : POSITION; float3 normalOS   : NORMAL; }; struct Varyings { float4 positionCS : SV_POSITION; }; Varyings vert (Attributes IN) { Varyings OUT; OUT.positionCS = TransformObjectToHClip(IN.positionOS); return OUT; } float4 frag() : SV_Target { return 0; } ENDHLSL } } }",
        "Is this the real life? Is this just fantasy? Caught in a landslide, No escape from reality. Open your eyes, Look up to the skies and see, I'm just a poor boy, I need no sympathy, Because I'm easy come, easy go, Little high, little low, Any way the wind blows doesn't really matter to me, to me. Mama, just killed a man, Put a gun against his head, pulled my trigger, now he's dead. Mama, life had just begun, But now I've gone and thrown it all away. Mama, ooh, Didn't mean to make you cry, If I'm not back again this time tomorrow, Carry on, carry on as if nothing really matters. Too late, my time has come, Sends shivers down my spine, body's aching all the time. Goodbye, everybody, I've got to go, Gotta leave you all behind and face the truth. Mama, ooh (any way the wind blows), I don't want to die, I sometimes wish I'd never been born at all. I see a little silhouette of a man, Scaramouche, Scaramouche, will you do the Fandango? Thunderbolt and lightning, very, very frightening me. Galileo, Galileo, Galileo, Galileo, Galileo Figaro magnifico. I'm just a poor boy, nobody loves me. He's just a poor boy from a poor family, Spare him his life from this monstrosity. Easy come, easy go, will you let me go? Bismillah! No, we will not let you go. (Let him go!) Bismillah! We will not let you go. (Let him go!) Bismillah! We will not let you go. (Let me go) Will not let you go. (Let me go)(Never) Never let you go (Let me go) (Never) let you go (Let me go) Ah No, no, no, no, no, no, no. Oh mama mia, mama mia, mama mia, let me go. Beelzebub has a devil put aside for me, for me, for meee!",
        "In the town where I was born Lived a man who sailed to sea And he told us of his life In the land of submarines So we sailed up to the sun Till we found a sea of green And we lived beneath the waves In our yellow submarine We all live in a yellow submarine Yellow submarine, yellow submarine We all live in a yellow submarine Yellow submarine, yellow submarine And our friends are all aboard Many more of them live next door And the band begins to play We all live in a yellow submarine Yellow submarine, yellow submarine We all live in a yellow submarine Yellow submarine, yellow submarine Full speed ahead Mr. Boatswain, full speed ahead Full speed ahead It is our only goal Full speed ahead Mr. Boatswain, full speed ahead Full speed ahead Full speed ahead Mr. Boatswain, full speed ahead Full speed ahead Full speed ahead Mr. Boatswain, full speed ahead Full speed ahead (In the town where I was born Lived a man   who sailed to sea And he told us of his life In the land of submarines So we sailed up to the sun Till we found a sea of green And we lived beneath the waves In our yellow submarine We all live in a yellow submarine Yellow submarine, yellow submarine We all live in a yellow submarine Yellow submarine, yellow submarine And our friends are all aboard Many more of them live next door And the band begins to play We all live in a yellow submarine Yellow submarine, yellow submarine We all live in a yellow submarine Yellow submarine, yellow submarine Full speed ahead Mr. Boatswain, full speed ahead Full speed ahead It is our only goal Full speed ahead Mr. Boatswain, full speed ahead Full speed ahead Full speed ahead Mr. Boatswain, full speed ahead Full speed ahead Full speed ahead Mr. Boatswain, full speed ahead Full speed ahead)",
        "成汤乃黄帝之后也，姓子氏。初，帝喾次妃简狄祈于高禖，有玄鸟之祥，遂生契。契事唐虞为司徒，教民有功，封于商。传十三世生太乙，是为成汤。闻伊尹耕于有辛之野而乐尧舜之道，是个大贤，即时以币帛，三遣使往聘之，而不敢用，进之于天子。桀王无道，信谗逐贤而不能用，复归之于汤。后桀王日事荒淫，杀直臣关龙逢，众庶莫敢直言。汤使人哭之，桀王怒，囚汤于夏台。后汤得释而归国，出郊，见人张网四面而祝之曰：“从天坠者，从地出者，从四方来者，皆罹吾网。”汤解其三面，止置一面，更祝曰：“欲左者左，欲右者右，欲高者高，欲下者下，不用命者乃入吾网。”汉南闻之曰：“汤德至矣！”归之者四十余国。桀恶日暴，民不聊生。伊尹乃相汤伐桀，放桀于南巢。诸侯大会，汤退而就诸侯之位，诸侯皆推汤为天子，于是汤始即位，都于亳。元年乙未，汤在位，除桀虐政，顺民所喜，远近归之。因桀无道，大旱七年，成汤祈祷桑林，天降大雨。又以庄山之金铸币，救民之命。作乐《大濩》，濩者护也，言汤宽仁大德，能救护生民也。在位十三年而崩，寿百岁，享国六百四十年，传至商受而止：成汤太甲沃丁太庚小甲雍己太戊仲丁外壬，河掸甲祖乙祖辛沃甲祖丁南庚阳甲盘庚小辛，小乙武丁祖庚祖甲廪辛庚丁武乙太丁帝乙纣王。"
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
    //const input = document.getElementById("inputText").value;
    const output = document.getElementById("outputText").value;
    document.getElementById("inputText").value = output;
    document.getElementById("outputText").value = " ";
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
