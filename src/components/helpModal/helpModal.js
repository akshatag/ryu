/*global chrome*/
import React from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from "@material-ui/core/styles";
import styles from './styles';


class HelpModal extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { classes } = this.props

    return(
      <Modal
        open={true}
        onClose={this.props.onClose}>
        <Paper elevation={20} className={classes.paper}>
          <div className={classes.list}>
            <p>Kyn currently supports the following features:</p>
            <p><strong>Tab Groups</strong>: Use 'Save Tab Groups' to save all the tabs in the current window to a new group. Use 'Open Tab Groups' to instantly open those tabs later.</p>
            <p><strong>Go To</strong>: Use 'Go To' to jump to any tab in any of your windows using the name of the tab.</p>
            <p><strong>Bookmark</strong>: Type 'Bookmark' or the name of any bookmark to open it in a new tab.</p>
            <p><strong>Toggle</strong>: Press Option+RightArrow to toggle between your current tab and your last tab.</p>
            <p style={{fontSize: '11px'}}><i>Click anywhere or press ESC to exit</i></p>
          </div>
        </Paper>
      </Modal>
    )
  }

}

export default withStyles(styles)(HelpModal);


{/* <List className={classes.list}>
<ListItem
  className={classes.listItem}
  divider={true}>
  <ListItemText 
    classes={{primary: classes.listItemText}}
    primary={item}/>
  <ListItemSecondaryAction>
    <Button 
      className={classes.listItemButton}
      onClick={() => this.deleteTabGroup(item)}>
      Delete
    </Button>
  </ListItemSecondaryAction>
</ListItem>  
</List> */}