import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import SupportsContent from "./SupportsContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const stubProps = {
  category: "Assistive Technology"
};

class SupportsPopup extends React.Component {
  state = {
    open: true,
    width: window.innerWidth
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { fullScreen } = this.props;
    return (
      <Grid>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          aria-labelledby="assist-dialog-title"
          aria-describedby="assist-dialog-description"
          fullWidth={true}
          maxWidth={"sm"}
        >
          <DialogTitle>{stubProps.category}</DialogTitle>
          <SupportsContent />
          <DialogActions>
            <Button onClick={this.handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

SupportsPopup.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

export default withMobileDialog({ breakpoint: "xs" })(SupportsPopup);
