import React, { Component } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { TextField } from "@material-ui/core";

export default class ValidatedTextField extends Component {
  state = {
    clickedAway: false,
    clicked: false
  };

  handleClickAway = () => {
    if (this.state.clicked) {
      this.setState({ clickedAway: true });
    }
  };

  handleClick = () => {
    this.setState({ clicked: true });
  };

  render() {
    const showError = this.state.clickedAway && this.props.error;
    return (
      <ClickAwayListener onClickAway={this.handleClickAway}>
        <TextField
          onClick={this.handleClick}
          {...this.props}
          helperText={this.props.helperText || (showError && this.props.error)}
          error={showError}
        />
      </ClickAwayListener>
    );
  }
}
