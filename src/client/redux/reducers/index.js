import { combineReducers } from 'redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import { reducer as reduxForm } from 'redux-form';

import showItems from './items';
import registerReducer from './register';
import storeReducers from './store';
import videoReducers from './video';
import browserReducers from './browser';
import offerReducers from './offer';
import imageReducers from './image';
import sortReducer from './sortReducer';
import modal from './modal';
import base from './base';
import wallets from './wallets';
import personal from './personal';

export default combineReducers({
  reduxAsyncConnect,
  items: showItems,
  register: registerReducer,
  categories: storeReducers.categoryReducer,
  currencies: storeReducers.currencyReducer,
  newItem: storeReducers.newItemReducer,
  video: videoReducers,
  browser: browserReducers,
  offer: offerReducers,
  image: imageReducers,
  sorter: sortReducer,
  form: reduxForm,
  modal,
  base,
  wallets,
  personal,
});
