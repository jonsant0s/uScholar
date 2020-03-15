import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Firebase, { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const INITIAL_STATE = {
  loading: false,
  user: null,
  isAdmin: false,
  isResearcher: false,
  isEditor: false,
  isReviewer: false,
  error: null,
};

class ChangeRole extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.location.state,INITIAL_STATE,
    };
  }
  onSubmit = event => {
    const { isAdmin, isEditor, isReviewer, isResearcher } = this.state;
    const roles = {};

    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }
    if (isEditor) {
      roles[ROLES.EDITOR] = ROLES.EDITOR;
    }
    if (isReviewer) {
      roles[ROLES.REVIEWER] = ROLES.REVIEWER;
    }
    if (isResearcher) {
      roles[ROLES.RESEARCHER] = ROLES.RESEARCHER;
    }

    this.props.firebase.user(this.props.match.params.id).update({'roles': roles,})
    .then(() => {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push(ROUTES.ADMIN_ROLE_CHANGE);
    });


  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  componentDidMount() {
    if (this.state.user) {
      return;
    }

    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          user: snapshot.val(),
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  render() {
    const {
      user,
      loading,
      error,
      isAdmin,
      isEditor,
      isReviewer,
      isResearcher } = this.state;

    return (
      <div>
        <h2>User ({this.props.match.params.id}) </h2>
        {loading && <div>Loading ...</div>}

        {user && (
          <div>
            <span>
              <strong>Role:</strong>
              {user.roles[ROLES.ADMIN]}
              {user.roles[ROLES.EDITOR]}
              {user.roles[ROLES.RESEARCHER]}
              {user.roles[ROLES.REVIEWER]}
            </span>
          </div>
        )}
        <h2> Assign Role: </h2>
        <form onSubmit={this.onSubmit}>
        <label>
          Admin:
          <input
            name="isAdmin"
            type="checkbox"
            checked={isAdmin}
            onChange={this.onChangeCheckbox}
          />
        </label>
        <label>
          Editor:
          <input
            name="isEditor"
            type="checkbox"
            checked={isEditor}
            onChange={this.onChangeCheckbox}
          />
        </label>
        <label>
          Reviewer:
          <input
            name="isReviewer"
            type="checkbox"
            checked={isReviewer}
            onChange={this.onChangeCheckbox}
          />
        </label>
        <label>
          Researcher:
          <input
            name="isResearcher"
            type="checkbox"
            checked={isResearcher}
            onChange={this.onChangeCheckbox}
          />
        </label>
          <button type="submit">
            Update
          </button>

          {error && <p>{error.message}</p>}
        </form>
      </div>

    );
  }
}
export default withFirebase(ChangeRole);
