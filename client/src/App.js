import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from './actions';

import LoginPage from './components/Auth/LoginPage';
import { ToastContainer } from 'react-toastify';
const Header = () => <h2>Header</h2>;
const Feed = () => <h2>Feed</h2>;
const Account = () => <h2>Account</h2>;
const Timeline = () => <h2>Timeline</h2>;

function PrivateRoute({ component: Component, auth, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
}
function AuthRoute({ component: Component, auth, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth === true ? (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    document.body.style.backgroundColor = '#f0f2f5';
    this.props.fetchUser();
  }

  render() {
    let isAuth = this.props.user.auth;
    let loginRequest = this.props.user.loginRequest;
    if (isAuth === null && loginRequest !== true) return null;
    return (
      <div className="App">
        {isAuth === true && <Header />}

        <Switch>
          <PrivateRoute exact path="/" component={Feed} auth={isAuth} />
          <PrivateRoute path="/timeline" component={Timeline} auth={isAuth} />
          <PrivateRoute path="/account" component={Account} auth={isAuth} />
          <AuthRoute path="/login" component={LoginPage} auth={isAuth} />
          <Redirect from="*" to="/" />
        </Switch>
        <ToastContainer autoClose={3000} />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    alert: state.alert
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: () => dispatch(userActions.fetchUser())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
