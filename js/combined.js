



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
    if (localStorage["pedalBoardFxChains"])     return JSON.parse(localStorage["pedalBoardFxChains"]);
    return new Object();
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


function savePedalBoardState(pbfxChainName, sixletters)
{
    var pedalBoardFxChains = getPedalBoardFxChains();
    if (!pedalBoardFxChains[pbfxChainName])pedalBoardFxChains[pbfxChainName] = new Object();
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
    alert("*****" + JSON.stringify(pedalBoardFxChains));
    alert("*****" + isInstantiated(pbfxChainName));
    alert("****" + hasNamedChain(pedalBoardFxChains,pbfxChainName));
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
    if (old_key !== new_key) {
        Object.defineProperty(pedalBoardFxChains, new_key,
            Object.getOwnPropertyDescriptor(pedalBoardFxChains, old_key));
        deletePbFxChain(pedalBoardFxChains, old_key);
    }
    savePedalBoardFxChains(pedalBoardFxChains);
}

function deletePbFxChain(pedalBoardFxChains, pbfxChainName)
{
    delete pedalBoardFxChains[pbfxChainName];
    localStorage["pedalBoardFxChains"] = JSON.stringify(pedalBoardFxChains);
}

function resetPedalBoardFxChains()
{
    localStorage["pedalBoardFxChains"] = "";
    pedalBoardFxChains = new Object();
}