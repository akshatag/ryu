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
  },
  listItemText: {
    fontFamily: 'Roboto Mono',
    fontSize: '12px',
  },
  listItemButton: {
    fontFamily: 'Roboto Mono',
    fontSize: '12px',
    color: '#ff4545'
  }
});

export default styles;