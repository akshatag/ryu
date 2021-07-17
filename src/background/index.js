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

async function getOpenTabs(request, sender, sendResponse) {
  chrome.tabs.query({}, (results) => {
    let tabsData = results.map((item) => {return {id: item.id, window: item.windowId, title: item.title}})
    sendResponse({results: tabsData})
  })
}

function goToTab(request, sender, sendResponse) {
  chrome.tabs.update(request.params.id, {selected:true}, () => {
    chrome.windows.update(request.params.window, {focused: true}, () => {
      if(chrome.runtime.lastError) {
        sendResponse({err: chrome.runtime.lastError})
      } else {
        sendResponse('Went to tab')
      }
    })
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

      if(request.route === 'clearStorage') {
        clearStorage(request, sender, sendResponse)
      }

      if(request.route === 'getStorageUsed') {
        getStorageUsed(request, sender, sendResponse)
      }

      if(request.route === 'getOpenTabs') {
        getOpenTabs(request, sender, sendResponse)
      }

      if(request.route === 'goToTab') {
        goToTab(request, sender, sendResponse)
      }

      return true;
    }
)
