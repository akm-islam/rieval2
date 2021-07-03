import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createStore } from 'redux';
import {Provider} from 'react-redux';
import reducer from './store/reducer';
import theme from './Themes'; 
import { ThemeProvider } from '@material-ui/styles';
const store=createStore(reducer);
ReactDOM.render( <ThemeProvider theme={theme}><Provider store={store}><App /></Provider></ThemeProvider>,document.getElementById('root'));


