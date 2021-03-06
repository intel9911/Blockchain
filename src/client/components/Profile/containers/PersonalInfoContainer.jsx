import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Personal from '../components/Personal';

import * as modalActions from '../../../redux/reducers/modal';
import * as personalsActions from '../../../redux/reducers/personal';


class PersonalInfoContainer extends Component {
  constructor(props) {
    super(props);
    this.handleOpenModify = this.handleOpenModify.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
  }
  handleOpenModify() {
    const { personal, ModalActions } = this.props;
    ModalActions.show({
      mode: 'modify',
      personal: personal.toJS(),
    });
  }

  handleChangeValue(event, index, value) {
    console.log('value');
    console.log(value);

    const { PersonalsActions } = this.props;
    PersonalsActions.setValue(value);
  }

  render() {
    const { personal } = this.props;
    const {
            handleOpenModify,
            handleChangeValue,
        } = this;

    return (
      <Personal
        personal={personal}
        onOpenModify={handleOpenModify}
        handleChangeValue={handleChangeValue}
      />
    );
  }

}

export default connect(
    state => ({
      personal: state.personal,
    }),
    dispatch => ({
      ModalActions: bindActionCreators(modalActions, dispatch),
      PersonalsActions: bindActionCreators(personalsActions, dispatch),
    }),
)(PersonalInfoContainer);
