/*global chrome*/
import './App.css';
import 'chrome-storage-promise';
import React from 'react';
import CommandPalette from 'react-command-palette';
import ManageTGModal from './components/manageTGModal/manageTGModal';

class App extends React.Component {
  
  constructor(props){
    super(props)
    
    this.state = {
      commands: [],
      manageTabGroupsModal: false
    }
  }

  render() {
    return (
      <div className="App" id='ryu'>
        <CommandPalette 
          commands={this.state.commands}
          hotKeys='ctrl+space'
          showSpinnerOnSelect={false}
          closeOnSelect={true}
          resetInputOnOpen={true}
        />
        { 
          this.state.manageTabGroupsModal ? 
          <ManageTGModal
            onClose={() => this.setState({manageTabGroupsModal: false})}/> :
          null
        }
      </div>
    );
  }

  componentDidMount() {    
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "sync" && "tabGroups" in changes) {
          this.updateCommands()
      }
    });

    this.updateCommands()
  }

  updateCommands = () => {
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
  
  
    return commands;
  }

}

export default App;
