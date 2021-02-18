import userReducer from './userReducer';
import { combineReducers } from 'redux';
import alertReducer from './alertReducer';

const rootReducer = combineReducers({
  user: userReducer,
  alert: alertReducer
});
export default rootReducer;
