/*global chrome*/
import './App.css';
import React from 'react';
import CommandPalette from 'react-command-palette';
import ManageTabGroupsModal from './components/manageTabGroupsModal/manageTabGroupsModal';
import getCommands from './commands'

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
          <ManageTabGroupsModal
            onClose={() => this.setState({manageTabGroupsModal: false})}/> :
          null
        }
      </div>
    );
  }

  componentDidMount() {    
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area == "sync" && "tabGroups" in changes) {
          this.updateCommands()
      }
    });

    this.updateCommands()
  }

  updateCommands = () => {
    getCommands().then((response) => {
      this.setState({
        commands: response
      })
    })
  }

}

export default App;
