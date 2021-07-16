/*global chrome*/
function saveTabs(request, sender, sendResponse) {
  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
    
    //TODO: handle if tabs is null
    let tabsData = tabs.map((item) => {return item.url})
    
    chrome.storage.sync.get(['tabGroups'], (result) => {
      let tabGroups = result.tabGroups;
      let newGroupName = request.params.name;
      if(tabGroups == null) { 
        chrome.storage.sync.set({tabGroups: {[newGroupName]: tabsData}}, () => sendResponse('success case 1'))
      } else {  
        let newTabGroups = Object.assign(tabGroups, {[newGroupName]: tabsData})
        chrome.storage.sync.set({tabGroups: newTabGroups}, () => {
          if(chrome.runtime.lastError) {
            sendResponse(chrome.runtime.lastError.message)
          }else{
            sendResponse('success')
          }
        })
      }
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


function printTabGroups(request, sender, sendResponse) {
  chrome.storage.sync.get(['tabGroups'], (result) => {
    sendResponse(result.tabGroups)
  })
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request.route == 'saveTabs'){
        saveTabs(request, sender, sendResponse)
      }

      if(request.route == 'openTabs'){
        openTabs(request, sender, sendResponse)
      }

      if(request.route == 'printTabGroups'){
        printTabGroups(request, sender, sendResponse)
      }

      return true;
    }
)

