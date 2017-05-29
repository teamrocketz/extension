import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      loggedIn: false
    }
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(e) { this.setState({ email: e.target.value }); }
  handlePassChange(e) { this.setState({ password: e.target.value }); }

  handleSubmit(e) {
    e.preventDefault();
    console.log('attempting to authenticate');
    axios.post('http://localhost:3000/extension/login', {email: this.state.email, password: this.state.password})
      .then((res) => {
        console.log('User logged in!');
        console.log(res);
        this.setState({
          loggedIn: true
        });
      })
      .catch((err) => {
        console.log('error:');
        console.log(err);
      });
  }

  render() {
    return (
      <div className="App">
        {this.state.loggedIn === false ? 
        <div>
          <div className="App-header">
            <h2>Welcome to React</h2>
          </div>
          <form onSubmit={this.handleSubmit}>
            <input type="text" 
                   name="email" 
                   value={this.state.email} 
                   onChange={this.handleEmailChange} />
            <input type="password" 
                   name="password" 
                   value={this.state.password} 
                   onChange={this.handlePassChange} />
            <button id="ilovecats" onClick={this.handleSubmit} className="submitbutton">Login</button>
          </form>
        </div>
        : <div>
            <h2>SUCCESSFUL LOGIN!</h2>
            <p>Cool pitures of locks and stuff</p>
            <p>We love security</p>
            <p>And hate history</p>
          </div>}
      </div>
      
    );
  }
}

export default App;
