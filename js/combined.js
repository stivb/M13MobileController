

//resetPedalBoardFxChains();

function isInMobileApp()
{
    return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
}

function copyToClipboard(ctrlId)
{
        $(ctrlId).focus();
        $(ctrlId).select();
        document.execCommand('copy');
}

function setUserEmailAddress(emAddr)
{
    localStorage["emAddr"] = emAddr;
}

function getUserEmailAddress()
{
    if (!localStorage["emAddr"]) return "";
    return localStorage["emAddr"];
}

function setUserMacAddress(macAddr)
{
    localStorage["macAddr"] = macAddr;
}

function getUserMacAddress()
{
    if (!localStorage["macAddr"]) return "";
    return localStorage["macAddr"];
}

function setCurrentPbfxChainName(nome)
{
    localStorage["currentPbfxChainName"] = nome;
}

function getCurrentPbfxChainName()
{
    return localStorage["currentPbfxChainName"];


}


function importSongChainsFromJSON(stringifiedSongChains)
{
    var importedSongChains = JSON.parse(stringifiedSongChains);
    if (importedSongChains!=null)
    {
        localStorage['previousPedalBoardFxChains'] = localStorage["pedalBoardFxChains"];
        localStorage["pedalBoardFxChains"] = stringifiedSongChains;
    }
}

function getPedalBoardFxChains()
{

    if (localStorage["pedalBoardFxChains"] && localStorage["pedalBoardFxChains"].length>5)     return JSON.parse(localStorage["pedalBoardFxChains"]);
    return new Object();
}

function getPedalBoardFilterColors(k)
{
    var ka = k || getCurrentPbfxChainName();
    var pbItems = loadFxChainState(ka);
    var retval = new Array();
    $.each(pbItems, function( index, value ) {
    if (value.EffectColor!=null) retval.push(value.EffectColor);
    });
    //alert(JSON.stringify(retval) + JSON.stringify(pbItems))
    return retval;
    }

function getPedalBoardSceneFromChainName(k)
{
    var pedalBoardFxChains = getPedalBoardFxChains();
    var sceneDescript = pedalBoardFxChains[k].pedalBoard;
    return sceneDescript.charAt(1)*1;
}

function getPedalBoardChainByName(k)
{
    var retval = null;
    var pedalBoardFxChains = getPedalBoardFxChains();
    return  pedalBoardFxChains[k].pedalBoard;
}

function makePedalBoardBackground(k)
{

    retval = "background:";
    var colors = getPedalBoardFilterColors(k);
    if (colors.length==0) return retval+="black";
    if (colors.length==1) return retval+= colors[0];
    var percentage = 100/colors.length;
    retval += "linear-gradient(to right"
    $.each(colors, function( index, value ) {
        retval +="," + value + " " + percentage*index + "%," +  value + " " + percentage*(index+1) + "%";
    });
    return retval;


}

function getPedalBoardEffectNames()
{

    var pbItems = loadFxChainState(getCurrentPbfxChainName());
    var retval = new Array();
    $.each(pbItems, function( index, value ) {
        retval.push(value.Effect);
    });
    return retval;
}




function savePedalBoardFxChains(pbfxChainz)
{
    localStorage["pedalBoardFxChains"] = JSON.stringify(pbfxChainz);
}


function allPedalBoardFxKeys()
{
    var pedalBoardFxChains = getPedalBoardFxChains();
    return Object.keys(pedalBoardFxChains);
}

function allPedalBoardFxKeysByLetter()
{
    var arr = allPedalBoardFxKeys();
    arr.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    return arr;
}


function allPedalBoardFxKeysOrderedByScene()
{
    var tuples = [];
    var retval = [];
    var pedalBoardFxChains = getPedalBoardFxChains();

    for (var key in pedalBoardFxChains) tuples.push([key, pedalBoardFxChains[key]]);

    tuples.sort(function(a, b) {
        a = parseInt(a[1].pedalBoard.charAt(1),16);
        b = parseInt(b[1].pedalBoard.charAt(1),16);

        return a < b ? -1 : (a > b ? 1 : 0);
    });

    for (var i = 0; i < tuples.length; i++) {
        var key = tuples[i][0];
        var value = tuples[i][1];
        retval.push(key);

        // do something with key and value
    }


    //var pedalBoardFxChains = getPedalBoardFxChains();
    //var objs = pedalBoardFxChains.sort(OrderByScene());
    //return Object.keys(objs);
    return retval;
}

function OrderByScene() {
    return function(a, b) {
        if (a["pedalBoard"].charAt(1)*1 > b["pedalBoard"].charAt(1)*1) {
            return 1;
        } else if (a["pedalBoard"].charAt(1)*1 < b["pedalBoard"].charAt(1)*1)  {
            return -1;
        }
        return 0;
    }
}

function printOut(pbfxChainName,theChain)
{
    var em = getUserEmailAddress();
    var retval = "mailto:" + em + "?subject=" + pbfxChainName + "&body=";

    retval+=printOutEffectChainDescriptor(pbfxChainName,theChain);
    return retval;

}

function printOutEffectChainDescriptor(pbfxChainName,theChain)
{

    retval = "";
    var pc =0
    $.each(theChain, function( index, theEffect ) {
        if (JSON.stringify(theEffect).length<6) return true;
        retval+="---"+theEffect.Effect+"---%0D%0A";
        var effectKeys = removeNonNumericFromArray(Object.keys(theEffect));
        $.each(effectKeys, function (idx,key){
            pc = theEffect[key];
            retval+=getTitleAndNotch(key, pc)+ "(" + pc + "%)%0D%0A";
        });
    });
    return retval;
}

function getTitleAndNotch(titleIncludingNotches, percentage)
{

    if (titleIncludingNotches.indexOf('[')==-1 && titleIncludingNotches.indexOf('{')==-1) return titleIncludingNotches;
    if (titleIncludingNotches.indexOf('[')!=-1) return parseSqBracketsNotches(titleIncludingNotches, percentage);
    else return parseCurlyBracesNotches(titleIncludingNotches, percentage);
}

function parseSqBracketsNotches(titleIncludingNotches,percentage)
{
    var notchesString = titleIncludingNotches.match(/\[([^\]]+)\]/)[1];
    var title = titleIncludingNotches.replace(/\[.*$/,"");
    var notchesArray = notchesString.split('|');
    var notchesArrayLength = notchesArray.length;
    var defaultRetVal = title + " " + notchesArray[notchesArrayLength - 1];
    var units = 100 / notchesArrayLength;
    for (var i = 1; i < notchesArray.length; i++) {
        if (percentage < units * i) {
            defaultRetVal = title + " " + notchesArray[i - 1];
            break;
        }
    }
    return defaultRetVal;
}

function minusNotches(titleIncludingNotches)
{
    var title = titleIncludingNotches.replace(/\[.*$/,"");
    title = title.replace((/\{.*$/),"");
    return title;

}

function parseCurlyBracesNotches (titleIncludingNotches,percentage)
{

    var notchesString = titleIncludingNotches.match(/\{(.+?)\}/)[1];
    var justSuffix = titleIncludingNotches.match(/\}(.*$)/)[1];
    var justPrefix = titleIncludingNotches.replace(/\{.*$/,"");

    var notchesArray = notchesString.split('-');
    var notchScaleStart = notchesArray[0]*1;
    var notchScaleEnd= notchesArray[1]*1;
    var notchRange = Math.abs(notchScaleEnd-notchScaleStart);
    var currVal = Math.round(notchScaleStart + percentage*notchRange/100);
    return justPrefix + " " + currVal + justSuffix;
}


function printOutAll()
{
    var em = getUserEmailAddress();
    var separator = "%0D%0A-------------__songtitle__--------------%0D%0A";
    var retval = "mailto:" + em + "?subject=M13 Full Effects Chains" + "&body=";
    var allKeys =  allPedalBoardFxKeys();

    $.each(allKeys, function( index, key ) {
        var newSeparator = separator.replace("__songtitle__",key);

        var fx = loadFxChainState(key);
        retval += newSeparator + printOutEffectChainDescriptor(key,fx);

        });

    return retval;
}

function getScenePrintOutText()
{
    var keys = allPedalBoardFxKeysOrderedByScene();
    var retval = "ALL SCENES \n\n";
    $.each(keys, function( index, key ) {

        var k = key;
        var pbx = loadPedalBoardState(k);
        retval+=sceneLettersToDiagram(pbx,k);

    });
    return retval;
}

function listAllPedalBoardStates()
{
    var allKeys =  allPedalBoardFxKeys();
    var allScenes = "123456789ABC";
    var chainsPerScene = [];
    var songsPerScene=[];
    $.each(allScenes.split(""), function( index, key ) {
        chainsPerScene[key]=0;
        songsPerScene[key]="\n";
    });
    var retval = new Array();
    $.each(allKeys, function( index, key ) {

        var pbx = loadPedalBoardState(key);
        var scene = pbx.charAt(1);
        chainsPerScene[scene]++;
        songsPerScene[scene] +=key + "\n";
    });

    var sceneSummary = "CHAINS BY SCENE\n\n";
    $.each(allScenes.split(""), function( index, key ) {
        sceneSummary+="Scene:" + key + "-------------" + chainsPerScene[key] +  songsPerScene[key];

    });
    alert(sceneSummary);
    return retval;
}

function sceneLettersToDiagram(s,k)
{
    var i = 0;
    var folder = parseInt(s.charAt(0));
    var scene = parseInt("0x" + s.charAt(1));
    var retval = "------" + k.toUpperCase() + "-----\n"
    retval += "FOLDER " + folder + "" + "SCENE " +scene + "\n\n";
    var slotsUsed = [];
    for (i=2;i<s.length;i++) slotsUsed.push(s.charAt(i));
    var checkList="";
    var q = "147A258B369C";
    for (var j=0;j<3;j++)
    {
        for(var k=0;k<4;k++)
        {
            var n = q.charAt(j*4+k);
            if (slotsUsed.indexOf(n)==-1) retval+=".";
            else retval+="x";
        }

        retval+="\n";

    }
    retval+="\n";
    return retval;
}


function setListSerialize(setList)
{
localStorage["setList"] = JSON.stringify(setList);
}

function getSetList()
{
    if (localStorage.getItem("setList") === null) return null;
    return JSON.parse(localStorage["setList"]);
}





function savePedalBoardState(pbfxChainName, sixletters)
{
    var pedalBoardFxChains = getPedalBoardFxChains();
    if (!pedalBoardFxChains[pbfxChainName])
    {
        pedalBoardFxChains[pbfxChainName] = new Object();
    }

    pedalBoardFxChains[pbfxChainName].pedalBoard = sixletters;
    savePedalBoardFxChains(pedalBoardFxChains);
}

function saveFxChainState(pbfxChainName, fxChain)
{
    var pedalBoardFxChains = getPedalBoardFxChains();
    if (!pedalBoardFxChains[pbfxChainName]) pedalBoardFxChains[pbfxChainName] = new Object();
    pedalBoardFxChains[pbfxChainName].fxChain = fxChain;
    savePedalBoardFxChains(pedalBoardFxChains);
}

function loadPedalBoardState(pbfxChainName)
{
    var pedalBoardFxChains = getPedalBoardFxChains();
    if (isInstantiated(pbfxChainName))return pedalBoardFxChains[pbfxChainName].pedalBoard;
    return new Object();
}

function loadFxChainState(pbfxChainName)
{
    var pedalBoardFxChains = getPedalBoardFxChains();
    if (isInstantiated(pbfxChainName) && hasNamedChain(pedalBoardFxChains,pbfxChainName))return pedalBoardFxChains[pbfxChainName].fxChain;
    //a chain state is an array of 4 effect bags -
    //the items in the chain can be empty
    return new Array({},{},{},{});
}

function hasNamedChain(pbfxChainz,pbfxChainName)
{
    if (pbfxChainz[pbfxChainName].fxChain) return true;
    return false;
}

function isInstantiated(pbfxChainName)
{
    var pedalBoardFxChains = getPedalBoardFxChains();
    if (pbfxChainName=="") return false;
    if (!pedalBoardFxChains) return false;
    if (!pedalBoardFxChains[pbfxChainName]) return false;
    return true;
}



function renameFxChain(old_key, new_key)
{
    var pedalBoardFxChains = getPedalBoardFxChains();
    var newKeyAlreadyExists = new_key in pedalBoardFxChains;
    if (old_key == new_key) return false;
    if (newKeyAlreadyExists) {alert("You have renamed this to something already in the database"); return false;}

    Object.defineProperty(pedalBoardFxChains, new_key, Object.getOwnPropertyDescriptor(pedalBoardFxChains, old_key));
    deletePbFxChain(pedalBoardFxChains, old_key);
    savePedalBoardFxChains(pedalBoardFxChains);
    return true;
}

function deletePbFxChain(pbfxChainName)
{
    var pedalBoardFxChains = getPedalBoardFxChains();
    delete pedalBoardFxChains[pbfxChainName];
    localStorage["pedalBoardFxChains"] = JSON.stringify(pedalBoardFxChains);
}

function resetPedalBoardFxChains()
{
    localStorage["pedalBoardFxChains"] = "";
    pedalBoardFxChains = new Object();
}