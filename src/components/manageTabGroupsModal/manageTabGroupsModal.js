/*global chrome*/
import React from 'react';
import Modal from '@material-ui/core/Modal';


class ManageTabGroupsModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tabGroups: []
    }
  }

  componentDidMount() {
    this.updateTabGroups()
  }

  render() {
    return(
      <Modal
        open={true}
        onClose={this.props.onClose}>
        <div>
          <ul>
            {
              this.state.tabGroups.map((item) => {
                return (<li key={item}>{item}</li>)
              })
            }
          </ul>
        </div>
      </Modal>
    )
  }

  updateTabGroups = () => {
    let tabGroups = []
    
    chrome.storage.sync.get(['tabGroups'], (results) => {
      Object.keys(results.tabGroups).forEach((item) => {
        tabGroups.push(item)
      })

      this.setState({
        tabGroups: tabGroups
      })

    })
  }


}


export default ManageTabGroupsModal;