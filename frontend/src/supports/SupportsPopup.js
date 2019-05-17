import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import SupportsContent from "./SupportsContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";

class SupportsPopup extends React.Component {
  state = {
    open: true,
    width: window.innerWidth
  };

  handleClose = () => {};

  render() {
    const { fullScreen } = this.props;

    return (
      <Grid>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="assist-dialog-title"
          aria-describedby="assist-dialog-description"
          fullWidth={true}
          maxWidth={"sm"}
        >
          <SupportsContent />
        </Dialog>
      </Grid>
    );
  }
}

SupportsPopup.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

export default withMobileDialog({ breakpoint: "xs" })(SupportsPopup);
