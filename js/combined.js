var currentlyEditedPbFxChainName="";
var currentlyBeingDeleted="";

var pedalBoardFxChains;




function loadPedalBoardFxChains()
{
    if (localStorage["pedalBoardFxChains"])     pedalBoardFxChains = JSON.parse(localStorage["pedalBoardFxChains"]);
    else pedalBoardFxChains = new Object();
}

function savePedalBoardFxChains()
{
    localStorage["pedalBoardFxChains"] = JSON.stringify(pedalBoardFxChains);
}

function allPedalBoardFxKeys()
{
    return Object.keys(pedalBoardFxChains);
}


function savePedalBoardState(pbfxChainName, sixletters)
{
    if (!pedalBoardFxChains[pbfxChainName]) pedalBoardFxChains[pbfxChainName] = new Object();
    pedalBoardFxChains[pbfxChainName].pedalBoard = sixletters;
    savePedalBoardFxChains();
}

function saveFxChainState(pbfxChainName, fxChain)
{
    if (!pedalBoardFxChains[pbfxChainName]) pedalBoardFxChains[pbfxChainName] = new Object();
    pedalBoardFxChains[pbfxChainName].fxChain = fxChain;
    savePedalBoardFxChains();
}

function loadPedalBoardState(pbfxChainName)
{
    return pedalBoardFxChains[pbfxChainName].pedalBoard;
}

function loadFxChainState(pbfxChainName)
{
    return pedalBoardFxChains[pbfxChainName].fxChain;
}

function renameFxChain(old_key, new_key)
{
    if (old_key !== new_key) {
        Object.defineProperty(pedalBoardFxChains, new_key,
            Object.getOwnPropertyDescriptor(pedalBoardFxChains, old_key));
        deletePbFxChain(old_key);
    }

}

function deletePbFxChain(pbfxChainName)
{
    delete pedalBoardFxChains[pbfxChainName];
    localStorage["pedalBoardFxChains"] = JSON.stringify(pedalBoardFxChains);
}

function resetPedalBoardFxChains()
{
    localStorage["pedalBoardFxChains"] = "";
    pedalBoardFxChains = new Object();
}