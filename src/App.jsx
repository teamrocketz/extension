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
      // address: 'https://hault.herokuapp.com/',
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
              <a href={this.state.address} target="_blank" rel="noopener noreferrer">
                <img
                  src="./haultlogoweb.png"
                  alt="Hault"
                  height="65"
                  className="logo-ext img-responsive center-block"
                />
              </a>
            </div>
            <form className="form-group" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input
                  className="form-control email"
                  type="text"
                  name="email"
                  value={this.state.email}
                  placeholder="Email"
                  onChange={this.handleEmailChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control pass"
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handlePassChange}
                  placeholder="Password"
                />
              </div>
              <button
                id="ilovecats"
                onClick={this.handleSubmit}
                className="btn btn-hault submitbutton"
              >
                Login
              </button>
            </form>
          </div>
        :
          <div>
            <p className="browse"><h3>You are now browsing securely.</h3></p>
            <a
              href={this.state.address}
              rel="noopener noreferrer"
              target="_blank"
              className="link"
            >
              Access History Vault </a>
            <div className="navbar-fixed-bottom btn-group">
              <button
                className="btn session"
                id="restore-session"
                onClick={utils.loadSession}
              >Restore
              Session</button>
              <button
                className="btn logout"
                id="logout"
                onClick={this.logout}
              >Logout</button>
            </div>
          </div>}
      </div>
    );
  }
}

export default App;
