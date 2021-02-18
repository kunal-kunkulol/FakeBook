import React from 'react';
import {
  Button,
  Input,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
  Label,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import moment from 'moment';
class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
    this.onSubmit = this.onSubmit.bind(this);
  }
  getDefaultState() {
    return {
      email: '',
      password: '',
      birthDate: moment().locale('en').format('YYYY-MM-DD'),
      gender: 'Male',
      firstName: '',
      lastName: ''
    };
  }

  onFieldChange(e, field) {
    let currState = this.state;
    currState[field] = e;
    this.setState(currState);
  }

  onSubmit(e) {
    e.preventDefault();
    let {
      email,
      password,
      birthDate,
      gender,
      firstName,
      lastName
    } = this.state;
    let params = { email, password, birthDate, gender, firstName, lastName };
    this.props.register(params);
  }

  render() {
    let isDisabled = this.props.registerRequest;
    return (
      <Modal
        isOpen={this.props.open}
        onClosed={(e) => this.setState(this.getDefaultState())}
        className="modal-dialog-centered"
      >
        <ModalHeader
          toggle={(e) =>
            this.props.registerRequest
              ? null
              : this.props.onFieldChange(!this.props.open, 'open')
          }
        >
          Sign Up
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={this.onSubmit}>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Input
                    value={this.state.firstName}
                    onChange={(e) =>
                      this.onFieldChange(e.target.value, 'firstName')
                    }
                    type="text"
                    placeholder="First Name"
                    required
                    disabled={isDisabled}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Input
                    value={this.state.lastName}
                    onChange={(e) =>
                      this.onFieldChange(e.target.value, 'lastName')
                    }
                    type="text"
                    placeholder="Last Name"
                    required
                    disabled={isDisabled}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col>
                <FormGroup>
                  <Input
                    value={this.state.email}
                    onChange={(e) =>
                      this.onFieldChange(e.target.value, 'email')
                    }
                    type="email"
                    placeholder="Email"
                    required
                    disabled={isDisabled}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col>
                <FormGroup>
                  <Input
                    value={this.state.password}
                    onChange={(e) =>
                      this.onFieldChange(e.target.value, 'password')
                    }
                    type="password"
                    placeholder="Password"
                    minLength={8}
                    disabled={isDisabled}
                  />
                </FormGroup>
              </Col>
            </Row>
            <div>
              <Label className="">Birth Date</Label>
              <Row form>
                <Col>
                  <FormGroup>
                    <Input
                      type="date"
                      value={this.state.birthDate}
                      onChange={(e) =>
                        this.onFieldChange(e.target.value, 'birthDate')
                      }
                      disabled={isDisabled}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div>
              <Label>Gender</Label>
              <Row form>
                <Col md={6}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <Input
                          addon
                          type="radio"
                          name="gender"
                          onClick={(e) => this.onFieldChange('Male', 'gender')}
                          value={this.state.gender === 'Male'}
                          defaultChecked
                          disabled={isDisabled}
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input value="Male" disabled />
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <Input
                          addon
                          type="radio"
                          name="gender"
                          onClick={(e) =>
                            this.onFieldChange('Female', 'gender')
                          }
                          value={this.state.gender === 'Female'}
                          disabled={isDisabled}
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input disabled value="Female" />
                  </InputGroup>
                </Col>
              </Row>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <hr className="w-100" />
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <Button
                className="w-50 py-2 font-weight-bold"
                color="success"
                type="submit"
                disabled={isDisabled}
              >
                {isDisabled === true ? <Spinner size="sm" /> : 'Sign Up'}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}

export default SignUpForm;
