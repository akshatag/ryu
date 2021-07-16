/*global chrome*/
function saveTabs(request, sender, sendResponse) {
  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
    chrome.storage.sync.get(['tabGroups'], (result) => {
      let tabGroups = result.tabGroups;
      let newGroupName = request.params.name;
      if(tabGroups == null) { 
        chrome.storage.sync.set({tabGroups: {[newGroupName]: tabs}}, () => sendResponse('success case 1'))
      } else {  
        let newTabGroups = Object.assign(tabGroups, {[newGroupName]: tabs})
        chrome.storage.sync.set({tabGroups: newTabGroups}, () => sendResponse('success case 2'))
      }
    })
  })
}

function openTabs() {
  chrome.storage.sync.get(['tabset'], (result) => {
      console.log(result)
      result.tabset.forEach(function(item, idx, arr){
          chrome.tabs.create({url: item.url}, ()=>{})
      })
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
        openTabs()
      }

      if(request.route == 'printTabGroups'){
        printTabGroups(request, sender, sendResponse)
      }

      return true;
    }
)

