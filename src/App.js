import logo from './logo.svg';
import './App.css';
import SearchBar from './components/searchBar/searchBar'
import React from 'react';




class App extends React.Component {
  
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div className="App">
        <SearchBar />
      </div>
    );
  }
}

export default App;
