/*global chrome*/
import 'chrome-storage-promise';


chrome.commands.onCommand.addListener((command) => {
  if(command === 'activate-kyn') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {route: "activate-kyn"}, () => {})
    });
  }
});

chrome.tabs.onActivated.addListener(updateToggleTabsData)


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.route === 'saveTabGroup') {
      saveTabGroup(request, sender, sendResponse)
    }

    if(request.route === 'openTabGroup') {
      openTabGroup(request, sender, sendResponse)
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

    if(request.route === 'getBookmarks') {
      getBookmarks(request, sender, sendResponse)
    }

    if(request.route === 'openBookmark') {
      openBookmark(request, sender, sendResponse)
    }

    if(request.route === 'goToTab') {
      goToTab(request, sender, sendResponse)
    }

    if(request.route === 'toggleTabs') {
      toggleTabs(request, sender, sendResponse)
    }

    if(request.route === 'getToggleTabsData') {
      getToggleTabsData(request, sender, sendResponse)
    }

    return true;
  }
)





function saveTabGroup(request, sender, sendResponse) {
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
          sendResponse({message: 'saveTabGroup: success'})
        }
      })      
    })
  })
}

function openTabGroup(request, sender, sendResponse) {
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
      sendResponse({message: 'clearStorage: success'})
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
        sendResponse({message: 'goToTab: success'})
      }
    })
  }) 
}

function toggleTabs(request, sender, sendResponse) {
  chrome.storage.local.get(['toggleTabs'], (result) => {
    if(result.toggleTabs) {
      chrome.tabs.update(result.toggleTabs[1].id, {selected:true}, () => {
        chrome.windows.update(result.toggleTabs[1].window, {focused: true}, () => {
          if(chrome.runtime.lastError) {
            sendResponse({err: chrome.runtime.lastError})
          } else {
            sendResponse({message: 'toggleTabs: success'})
          }
        })
      }) 
    } else {
      sendResponse({message: 'toggleTabs data not found'})
    }
  })
}

async function getBookmarks(request, sender, sendResponse) {
  let nodes = await chrome.bookmarks.getTree()
  let bookmarks = dumpNodes(nodes[0].children[0], null)
  sendResponse({bookmarks: bookmarks})
}

function dumpNodes(node, prefix) {
  let bookmarks = []
  let nextPrefix;
  
  if(prefix && prefix != 'Bookmarks Bar') {
    nextPrefix = prefix + ' > ';
  } else {
    nextPrefix = '';
  }

  if(node.url) {
    if(prefix && prefix != 'Bookmarks Bar') {
      node.title = nextPrefix + node.title;
    } 
    bookmarks.push(node)
  } else {
    for(let i = 0; i < node.children.length; i++) {
      bookmarks.push(...dumpNodes(node.children[i], nextPrefix + node.title))
    }
  }

  return bookmarks
}

function openBookmark(request, sender, sendResponse) {
  chrome.tabs.create({url: request.params.bookmark.url}, ()=>{
    if(chrome.runtime.lastError) {
      sendResponse({err: chrome.runtime.lastError})
    } else {
      sendResponse({message: 'openBookmark: success'})
    }
  })
}


async function getToggleTabsData(request, sender, sendResponse) {
  let results = await chrome.storage.promise.local.get(['toggleTabs'])
  sendResponse(results.toggleTabs)
}

async function updateToggleTabsData(info) {  
  let results = await chrome.storage.promise.local.get(['toggleTabs'])
  let toggleTabs;

  if(results.toggleTabs) {
    toggleTabs = results.toggleTabs
  } else {
    toggleTabs = []
  }

  toggleTabs.unshift({id: info.tabId, window: info.windowId})
  toggleTabs = toggleTabs.splice(0, 2)

  await chrome.storage.promise.local.set({toggleTabs: toggleTabs})
}


