/*global chrome*/
import React, { useRef } from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles'
import { ListItem } from '@material-ui/core'
import searchOptions from './searchOptions'


class SearchBar extends React.Component {
    
  constructor(props) {
    console.log(props)
    super(props)
    this.state = {
      show: false,
      options: searchOptions
    }
  }

  render(){

    const classes = this.props.classes;

    return(
      <Modal
        open={this.state.show}
        onClose={()=> this.setState({show: false})}>
        <Autocomplete
          className='searchBar'
          autoComplete={true}
          autoHighlight={true}
          autoSelect={true}
          clearOnEscape={true}
          freeSolo={true}
          options={this.state.options}
          groupBy={(option) => option.firstLetter}
          getOptionLabel={(option) => option.label}
          renderInput={this.renderInput.bind(this)}
          renderOption={this.renderOption}
          onChange={this.handleSelect} //TODO
        />
      </Modal>
    )
  }

  renderInput(params) {
    
    const classes = this.props.classes;
    
    return(
      <TextField 
        className={classes.searchBar}
        {...params} 
        inputRef={input => input && input.focus()}
        variant='filled'
      />
    )
  }

  handleSelect = (event, option) => { 
    
    console.log(option)
    
    chrome.runtime.sendMessage({route: option.key}, (response) => console.log(response.results))

    this.setState({
      show: false
    })
  }




  componentDidMount() {
    window.addEventListener('keydown', (event) => {
      if(event.ctrlKey && event.key == ' '){
        this.setState({
          show: !this.state.show
        });
      }
    });
  }


  

}

export default withStyles(styles)(SearchBar);