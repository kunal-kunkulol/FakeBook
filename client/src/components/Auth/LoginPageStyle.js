import styled from 'styled-components';
import { Container, Button, Input, Modal } from 'reactstrap';

export const StyledContainer = styled(Container)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 120px;
  width: min(980, 100%);
`;

export const DescriptionContainer = styled.div`
  width: 580px;
  padding-right: 2rem;
`;

export const DescriptionPTag = styled.p`
  font-size: 26px;
  margin-top: 10px;
  line-height: 1.2;
`;

export const FbLogo = styled.img`
  margin: -28px;
  height: 106px;
`;

export const LoginFormContainer = styled.div`
  width: 380px;
  padding: 1rem;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
`;

export const SignUpContainer = styled(Modal)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2000;
  height: 300px;
  width: 400px;
  background-color: white;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;
`;
