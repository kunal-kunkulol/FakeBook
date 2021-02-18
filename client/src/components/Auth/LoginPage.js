import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../actions';
import {
  Button,
  Input,
  Container,
  Form,
  FormGroup,
  Spinner,
  Label,
  FormFeedback,
  FormText
} from 'reactstrap';
import {
  StyledContainer,
  DescriptionContainer,
  DescriptionPTag,
  FbLogo,
  LoginFormContainer
} from './LoginPageStyle';
import SignUpForm from './SignUpForm';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      open: false
    };
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
  }
  onSubmitHandler(e) {
    e.preventDefault();
    this.props.login(this.state.email, this.state.password);
  }

  onFieldChange(e, field) {
    let currState = this.state;
    currState[field] = e;
    this.setState(currState);
  }

  checkValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  render() {
    let loginRequest = this.props.loginRequest;
    let registerRequest = this.props.registerRequest;

    return (
      <>
        <StyledContainer>
          <DescriptionContainer>
            <FbLogo src="/fb.svg" />
            <DescriptionPTag>
              Connect with friends and the world around you on Facebook
            </DescriptionPTag>
          </DescriptionContainer>
          <LoginFormContainer>
            <Form onSubmit={this.onSubmitHandler}>
              <FormGroup>
                <Input
                  placeholder="Email"
                  type="email"
                  value={this.state.email}
                  onChange={(e) => this.onFieldChange(e.target.value, 'email')}
                  required
                  disabled={loginRequest}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  placeholder="Password"
                  type="password"
                  value={this.state.password}
                  onChange={(e) =>
                    this.onFieldChange(e.target.value, 'password')
                  }
                  required
                  disabled={loginRequest}
                />
              </FormGroup>
              <FormGroup>
                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    color="primary"
                    className="font-weight-bold py-2 w-100"
                    disabled={loginRequest}
                  >
                    {loginRequest === true ? <Spinner size="sm" /> : 'Log In'}
                  </Button>
                </div>
              </FormGroup>
            </Form>

            <div className="d-flex align-items-center justify-content-between">
              <hr className="w-100" />
              <p className="mb-1 mx-2">or</p>
              <hr className="w-100" />
            </div>
            <Container className="w-75">
              <Button
                className="w-100 py-2 font-weight-bold"
                color="success"
                disabled={loginRequest || registerRequest}
                onClick={(e) => this.onFieldChange(!this.state.open, 'open')}
              >
                Create New Account
              </Button>
            </Container>
          </LoginFormContainer>
        </StyledContainer>
        <SignUpForm
          open={this.state.open}
          register={this.props.register}
          onFieldChange={this.onFieldChange}
          registerRequest={registerRequest}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    loginRequest: state.user.loginRequest,
    registerRequest: state.user.registerRequest
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    login: (email, password) => dispatch(userActions.login(email, password)),
    register: (userInfo) => dispatch(userActions.register(userInfo))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
