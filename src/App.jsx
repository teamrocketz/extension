import React, { Component } from 'react';
import axios from 'axios';
import utils from './utils';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      session: null,
      address: 'http://localhost:3000/',
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    axios.get(`${this.state.address}extension/log`)
    .then((response) => {
      if (response.status === 200) {
        this.setState({
          loggedIn: true,
        });
      }
    })
    .catch((err) => {
      console.error(err, 'Not logged in');
    });
  }


  logout() {
    axios.get(`${this.state.address}extension/logout`)
    .then((response) => {
      if (response.status !== 404) {
        this.setState({
          loggedIn: false,
        });
      }
    });
  }

  handleEmailChange(e) { this.setState({ email: e.target.value }); }
  handlePassChange(e) { this.setState({ password: e.target.value }); }

  handleSubmit(e) {
    e.preventDefault();
    axios.post(`${this.state.address}extension/login`, { email: this.state.email, password: this.state.password })
      .then((response) => {
        if (response.status !== 404) {
          this.setState({
            loggedIn: true,
            password: '',
          });
          utils.loadSession();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return (
      <div className="App">
        {!this.state.loggedIn ?
          <div>
            <div className="App-header">
              <a
                href={this.state.address}
                rel="noopener noreferrer"
                target="_blank"
              >Welcome to Hault </a>
            </div>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="email"
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handlePassChange}
              />
              <button id="ilovecats" onClick={this.handleSubmit} className="submitbutton">
                Login
              </button>
            </form>
          </div>
        :
          <div>
            <a
              href={this.state.address}
              rel="noopener noreferrer"
              target="_blank"
            >
              My Vault </a>
            <p>Cool pitures of locks and stuff</p>
            <p>We love security</p>
            <p>And hate history</p>
            <button id="restore-session" onClick={utils.loadSession}>Restore Last Session</button>
            <button id="logout" onClick={this.logout}>Logout</button>
          </div>}
      </div>
    );
  }
}

export default App;
