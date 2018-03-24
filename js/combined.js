

//resetPedalBoardFxChains();

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
    $.each(theChain, function( index, theEffect ) {
        if (JSON.stringify(theEffect).length<6) return true;
        retval+="---"+theEffect.Effect+"---%0D%0A";
        var effectKeys = removeNonNumericFromArray(Object.keys(theEffect));
        $.each(effectKeys, function (idx,key){
            retval+=key+":"+theEffect[key]+"%0D%0A";
        });
    });
    return retval;
}


function printOutAll()
{
    var em = getUserEmailAddress();
    var separator = "<br/>---------------------------------------------------<br/>";
    var retval = "mailto:" + em + "?subject=" + pbfxChainName + "&body=";
    var allKeys =  allPedalBoardFxKeys();

    $.each(allKeys, function( index, key ) {
        var fx = loadFxChainState(key);
        retval += printOutEffectChainDescriptor(pbfxChainName,theChain) + separator;
        });

    return retval;
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