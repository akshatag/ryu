/*global chrome*/

function saveTabs(request, sender, sendResponse) {
  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
      chrome.storage.sync.set({tabset: tabs}, function() {
        sendResponse({results: tabs})
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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request.route == 'saveTabs'){
        saveTabs(request, sender, sendResponse)
      }

      if(request.route == 'openTabs'){
        openTabs()
      }

      return true;
    }
)

