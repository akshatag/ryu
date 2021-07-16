/*global chrome*/
import './App.css';
import React from 'react';
import CommandPalette from 'react-command-palette';
import ManageTabGroupsModal from './components/manageTabGroupsModal/manageTabGroupsModal';

class App extends React.Component {
  
  constructor(props){
    super(props)
    
    this.state = {
      commands: [],
      manageTabGroupsModal: false
    }
  }

  componentDidMount() {
    this.updateCommands()
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
          // onChange={(input, userQ)=>{console.log(input + ' ' + userQ)}}
          // onSelect={(command)=>{console.log('select' + command)}}
        />
        { 
          this.state.manageTabGroupsModal ? 
          <ManageTabGroupsModal
            onClose={() => this.setState({manageTabGroupsModal: false})}/> :
          null
        }
      </div>
    );
  }

  updateCommands = () => {
    const commands = []

    //TODO: how do you handle when tabGroups > max quota per item?
    commands.push({
      name: 'saveTabs',
      command: () => {
        let name = window.prompt('Name this tab group')  
        chrome.runtime.sendMessage(
          {route: 'saveTabs', params: {name: name}}, 
          (response) => {
            console.log('repsonse ' + response)
            console.log(chrome.runtime.lastError)
            this.updateCommands()
          }
        )
      }
    })

    commands.push({
      name: 'Clear Storage',
      command: () => {
        chrome.storage.sync.clear(() => {console.log('sync storage cleared')})
        this.updateCommands()
      }
    })


    commands.push({
      name: 'Get Storage',
      command: () => {
        chrome.storage.sync.getBytesInUse((bytes) => console.log('bytes' + bytes))  
      }
    })

    commands.push({
      name: 'Print Tab Groups',
      command: () => {
        chrome.runtime.sendMessage(
          {route: 'printTabGroups'},
          (response) => {
            this.setState({
              manageTabGroupsModal: true
            })
          }
        )
      }
    })

    chrome.storage.sync.get(['tabGroups'], (results) => {
    
      if(results.tabGroups) {
        Object.keys(results.tabGroups).forEach((group) => {
          commands.push({
            name: 'Open Tabs: ' + group,
            command: () => {
              chrome.runtime.sendMessage(
                {route: 'openTabs', params: {name: group}},
                (response) => console.log('response ' + response)
              )
            }
          })
        })
      }

      this.setState({
        commands: commands
      })

    })  

  }

}

export default App;
