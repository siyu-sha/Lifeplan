import React, { Component } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";

export default class ValidatedTextField extends Component {
  state = {
    clickedAway: false
  };

  handleClickAway = () => {
    this.setState({ clickedAway: true });
  };

  render() {
    const showError = this.state.clickedAway && this.props.error;
    return (
      <ClickAwayListener onClickAway={this.handleClickAway}>
        <TextField
          {...this.props}
          helperText={this.props.helperText || (showError && this.props.error)}
          error={showError}
        />
      </ClickAwayListener>
    );
  }
}
