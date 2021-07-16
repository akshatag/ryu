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

  updateCommands = async () => {
    const commands = [
      {
        name: 'saveTabs',
        command: () => {
          let name = window.prompt('Name this tab group')  
          chrome.runtime.sendMessage(
            {route: 'saveTabs', params: {name: name}}, 
            (response) => {
              console.log('repsonse ' + response)
              this.updateCommands()
            })

        }
      }
    ]

    commands.push({
      name: 'Clear Tab Groups',
      command: () => {
        chrome.storage.sync.set({tabGroups: null}, () => {})
      }
    })


    commands.push({
      name: 'Print Tab Groups',
      command: () => {
        chrome.runtime.sendMessage(
          {route: 'printTabGroups'},
          (response) => {
            console.log(response)
            this.setState({
              manageTabGroupsModal: true
            })
          }
        )
      }
    })

    await chrome.storage.sync.get(['tabGroups'], (results) => {
    
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

    })  

    this.setState({
      commands: commands
    })

  }

}

export default App;
