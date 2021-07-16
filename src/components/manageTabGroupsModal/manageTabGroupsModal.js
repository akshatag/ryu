/*global chrome*/
import React from 'react';
import Modal from '@material-ui/core/Modal';


class ManageTabGroupsModal extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(
      <Modal
        open={true}
        onClose={this.props.onClose}>
        <div>
          hey there
        </div>
      </Modal>
    )
  }

}


export default ManageTabGroupsModal;