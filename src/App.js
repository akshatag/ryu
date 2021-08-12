/*global chrome*/
import 'chrome-storage-promise';
import React from 'react';
import CommandPalette from 'react-command-palette';
import ManageTGModal from './components/manageTGModal/manageTGModal';
import HelpModal from './components/helpModal/helpModal';
import './App.css'

class App extends React.Component {
  
  constructor(props){
    super(props)
    
    this.state = {
      commands: [],
      manageTabGroupsModal: false,
      helpModal: false
    }
  }


  render() {

    const theme = {
      modal: "kyn-modal",
      overlay: "kyn-overlay",
      header: "kyn-header",
      container: "kyn-container",
      content: "kyn-content",
      containerOpen: "kyn-containerOpen",
      input: "kyn-input",
      inputOpen: "kyn-inputOpen",
      inputFocused: "kyn-inputFocused",
      spinner: "kyn-spinner",
      suggestionsContainer: "kyn-suggestionsContainer",
      suggestionsContainerOpen: "kyn-suggestionsContainerOpen",
      suggestionsList: "kyn-suggestionsList",
      suggestion: "kyn-suggestion",
      suggestionFirst: "kyn-suggestionFirst",
      suggestionHighlighted: "kyn-suggestionHighlighted",
      trigger: "kyn-trigger"
    }


    return (
      <div className="App" id='kyn-app'>
        <CommandPalette 
          theme={theme}
          commands={this.state.commands}
          placeholder='Type a command or "Help" for more information'
          // hotKeys='option+command'
          showSpinnerOnSelect={false}
          closeOnSelect={true}
          onRequestClose={this.updateCommands}
          resetInputOnOpen={true}
          trigger={<button id={'kyn-trigger'} style={{display: 'none'}}></button>}
        />
        { 
          this.state.manageTabGroupsModal ? 
          <ManageTGModal
            onClose={() => this.setState({manageTabGroupsModal: false})}
            deleteTabGroup={(group) => console.log('deleting' + group)}/> :
          null
        }
        {
          this.state.helpModal ?
          <HelpModal
            onClose={() => this.setState({helpModal: false})}/> : 
          null
        }
      </div>
    );
  }

  componentDidMount() {    
    chrome.storage.onChanged.addListener((changes, area) => {
      if(area === "sync" && "tabGroups" in changes) {
          this.updateCommands()
      }
    });

    chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
        if(request.route === 'activate-kyn'){
          document.getElementById("kyn-trigger").click()
        }
    }.bind(this));

    document.addEventListener('keydown', (event) => {
      if(event.metaKey && event.shiftKey && event.key == 'ArrowRight') {
        chrome.runtime.sendMessage({route: 'toggleTabs'}, (response) => {
          if(response.err) {
            alert(response.err.message)
          } else {
            console.log(response.message)
          }
        })
      }
    })

    this.updateCommands()

  }

  updateCommands = async () => {
    console.log('updating commands')
    this.getCommands().then((response) => {
      this.setState({
        commands: response
      })
    })
  }

  getCommands = async () => {
    const commands = []
  
    /* Save Tabs */
    commands.push({
      name: 'Save Tab Group',
      command: () => {
        let name = window.prompt('Name this tab group')  
        chrome.runtime.sendMessage(
          {route: 'saveTabGroup', params: {name: name}}, 
          (response) => {
            if(response.err) {
              alert(response.err.message)
            }
          }
        )
      }
    })
  
    /* Open Tabs */
    await chrome.storage.promise.sync.get(['tabGroups']).then((results) => {
      if(results.tabGroups) {
        Object.keys(results.tabGroups).forEach((groupName) => {
          commands.push({
            name: 'Open Tab Group: ' + groupName,
            command: () => {
              chrome.runtime.sendMessage(
                {route: 'openTabGroup', params:{name: groupName}},
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

    /* Bookmarks */
    chrome.runtime.sendMessage({route: 'getBookmarks'}, (response)=> {
      response.bookmarks.forEach((bookmark) => {
        commands.push({
          name: 'Open Bookmark: ' + bookmark.title,
          command: () => {
            chrome.runtime.sendMessage(
              {route: 'openBookmark', params:{bookmark: bookmark}},
              (response) => {
                if(response.err) {
                  alert(response.err.message)
                }
              }
            )
          }
        })
      })
    }) 

    /* Go to */
    chrome.runtime.sendMessage({route: 'getOpenTabs'}, (response) => {      
      if(response.err) {
        alert(response.err.message)
      } else {
        response.results.forEach((tab) => {
          commands.push({
            name: 'Go To: ' + tab.title,
            command: () => {
              chrome.runtime.sendMessage({route: 'goToTab', params: {id: tab.id, window: tab.window}}, (response) => {
                if(response.err) {
                  alert(response.err.message)
                }
              })
            }
          })
        })
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
  
    /* Manage Tab Groups */
    commands.push({
      name: 'Manage Tab Groups',
      command: (() => {
        this.setState({
          manageTabGroupsModal: true
        })
      })
    })

    /* Help */
    commands.push({
      name: 'Help',
      command: (() => {
        this.setState({
          helpModal: true
        })
      })
    })

    /* Toggle Tabs */
    commands.push({
      name: 'Toggle Tabs',
      command: () => {
        chrome.runtime.sendMessage({route: 'toggleTabs'}, (response) => {
          if(response.err) {
            alert(response.err.message)
          } else {
            console.log(response.message)
          }
        })
      }
    })

    /* Print Toggle Tabs Data */
    commands.push({
      name: 'Debug: Print Toggle Tabs Data',
      command: () => {
        chrome.runtime.sendMessage({route: 'getToggleTabsData'}, (response) => {
          if(response.err) {
            alert(response.err.message)
          } else {
            console.log(response)
          }
        })
      }
    })


  
  
    return commands;
  }

}

export default App;
