/*global chrome*/
import React from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
  paper: {
    backgroundColor: '#303438',
    border: 'none',
    width: '480px',
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    '&:focus': {
      outline: 'none',
    }           
  },
  list: {
    color: 'white',
    margin: '10px',
  },
  listItem: {
    color: '#9da5b4',
    border: '1px solid #181a1f',
    borderTop: '0px none',
    backgroundColor: '#2c313a',
    padding: '14px 12px',
    '&:hover': {
        color: '#ffffff',
        backgroundColor: '#3a3f4b'
    }
    // cursor: pointer;
  },
  listItemText: {
    fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    fontSize: '16px',
  },
  listItemButton: {
    fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    fontSize: '16px',
    color: '#ff454573'
  }
});


class ManageTGModal extends React.Component {

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
    const { classes } = this.props

    return(
      <Modal
        open={true}
        onClose={this.props.onClose}>
        <Paper elevation={20} className={classes.paper}>
          <div>
            <List className={classes.list}>
              {
                this.state.tabGroups.map((item) => {
                  return (
                    <ListItem
                      className={classes.listItem}
                      divider={true}>
                      <ListItemText 
                        classes={{primary: classes.listItemText}}
                        primary={item}/>
                      <ListItemSecondaryAction>
                        <Button className={classes.listItemButton}>
                          Delete
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>  
                  )
                })
              }
            </List>
          </div>
        </Paper>
      </Modal>
    )
  }

  updateTabGroups = () => {    
    chrome.storage.sync.get(['tabGroups'], (results) => {
      let tabGroups = [];
      
      Object.keys(results.tabGroups).forEach((item) => {
        tabGroups.push(item)
      })

      this.setState({
        tabGroups: tabGroups
      })
    })
  }


}

export default withStyles(styles)(ManageTGModal);
