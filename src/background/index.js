/*global chrome*/
import 'chrome-storage-promise';

function saveTabs(request, sender, sendResponse) {
  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
    //TODO: handle if tabs is null
    let tabsData = tabs.map((item) => {return item.url})
    
    chrome.storage.sync.get(['tabGroups'], (result) => {
      let tabGroups = result.tabGroups;
      let newGroupName = request.params.name;
      let updatedTabGroup;

      if(tabGroups) {
        updatedTabGroup = Object.assign(tabGroups, {[newGroupName]: tabsData})
      } else {
        updatedTabGroup = {[newGroupName]: tabsData}
      } 

      chrome.storage.sync.set({tabGroups: updatedTabGroup}, () => {
        if(chrome.runtime.lastError) {
          sendResponse({err: chrome.runtime.lastError})
        } else {
          sendResponse({})
        }
      })      
    })
  })
}

function clearStorage(request, sender, sendResponse) {
  chrome.storage.sync.clear(() => { 
    if(chrome.runtime.lastError) {
      sendResponse({err: chrome.runtime.lastError})
    } else {
      sendResponse({})
    }
  })
}

function getStorageUsed(request, sender, sendResponse) {
  chrome.storage.sync.getBytesInUse((bytes) => {
    if(chrome.runtime.lastError) {
      sendResponse({err: chrome.runtime.lastError})
    } else {
      sendResponse({bytes: bytes})
    }
  })
}

function openTabs(request, sender, sendResponse) {
  chrome.storage.sync.get(['tabGroups'], (result) => {
      let tabGroup = result.tabGroups[request.params.name]

      if(tabGroup){
        tabGroup.forEach((item) => {
          chrome.tabs.create({url: item}, ()=>{})
        })
      }
  })
}

function printTabGroups(request, sender, sendResponse) {
  chrome.storage.sync.get(['tabGroups'], (result) => {
    sendResponse(result.tabGroups)
  })
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request.route === 'saveTabs') {
        saveTabs(request, sender, sendResponse)
      }

      if(request.route === 'openTabs') {
        openTabs(request, sender, sendResponse)
      }

      if(request.route === 'printTabGroups') {
        printTabGroups(request, sender, sendResponse)
      }

      if(request.route === 'clearStorage') {
        clearStorage(request, sender, sendResponse)
      }

      if(request.route === 'getStorageUsed') {
        getStorageUsed(request, sender, sendResponse)
      }

      return true;
    }
)

