import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
  }

  handleEmailChange(e) { this.setState({ email: e.target.value }); }
  handlePassChange(e) { this.setState({ password: e.target.value }); }

  handleSubmit(e) {
    console.log('sending login/auth stuff');
    e.preventDefault();
    axios.get('http://localhost:3000/')
      .then(res => {
        window.console.log('succeses!');
        window.console.log(res);
        console.log('succeses!');
        console.log(res);
      })
      .catch(err => {
        console.log('error:');
        console.log(err);
      })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="email" value={this.state.email} onChange={this.handleEmailChange} />
          <input type="text" name="password" value={this.state.password} onChange={this.handlePassChange} />
          <button id="ilovecats" onClick={this.handleSubmit} className="submitbutton">Login</button>
      </form>
      </div>
    );
  }
}

export default App;
