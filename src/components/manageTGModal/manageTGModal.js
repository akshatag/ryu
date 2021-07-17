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
import styles from './styles'

class ManageTGModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tabGroups: []
    }
  }

  componentDidMount() {
    this.updateTabGroups()
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "sync" && "tabGroups" in changes) {
          this.updateTabGroups()
      }
    });
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
                this.state.tabGroups.length === 0 ?
                <ListItem
                  className={classes.listItem}>
                  <ListItemText
                    classes={{primary: classes.listItemText}}
                    primary={'No tab groups yet!'}/>
                </ListItem>:
                this.state.tabGroups.map((item) => {
                  return (
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


  deleteTabGroup = (group) => { 
    chrome.storage.sync.get(['tabGroups'], (results) => {      
      if(results.tabGroups){
        if(results.tabGroups[group]){
          let updatedTabGroups = results.tabGroups
          delete updatedTabGroups[group]
          chrome.storage.sync.set({tabGroups: updatedTabGroups}, ()=>{})
        }
      }
    })
  }

}

export default withStyles(styles)(ManageTGModal);
