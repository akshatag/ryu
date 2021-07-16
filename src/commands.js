/*global chrome*/
import React from 'react';
import 'chrome-storage-promise';

const getCommands = async () => {
  const commands = []

  /* Save Tabs */
  commands.push({
    name: 'Save Tabs',
    command: () => {
      let name = window.prompt('Name this tab group')  
      chrome.runtime.sendMessage(
        {route: 'saveTabs', params: {name: name}}, 
        (response) => {
          if(response.err) {
            alert(response.err.message)
          }
        }
      )
    }
  })


  /* Clear Storage */
  commands.push({
    name: 'Clear Storage',
    command: () => {
      chrome.runtime.sendMessage({route: 'clearStorage'}, (response) => {
          if(response.err) {
            alert(response.err.message)
          } else {
            alert('Storage cleared!')
          }
      })
    }
  })


  /* Get Storage Used */
  commands.push({
    name: 'Get Storage Used',
    command: () => {
      chrome.runtime.sendMessage({route: 'getStorageUsed'}, (response) => {
        if(response.err) {
          alert(response.err.message)
        } else {
          alert('Storage used: ' + response.bytes + ' bytes')
        }
      })
    }
  })


  /* Open Tabs */
  await chrome.storage.promise.sync.get(['tabGroups']).then((results) => {
    if(results.tabGroups) {
      Object.keys(results.tabGroups).forEach((groupName) => {
        commands.push({
          name: 'Open Tabs: ' + groupName,
          command: () => {
            chrome.runtime.sendMessage(
              {route: 'openTabs', params:{name: groupName}},
              (response) => {
                if(response.err) {
                  alert(response.err.message)
                }
              }
            )
          }
        })
      })
    }
  })

  return commands;

}

export default getCommands;




      

