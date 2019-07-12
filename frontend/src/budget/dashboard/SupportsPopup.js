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
  handleClose = () => {
    this.props.closeSupports();
  };

  render() {
    const { fullScreen } = this.props;
    return (
      <Grid>
        <Dialog
          fullScreen={fullScreen}
          open={this.props.open}
          aria-labelledby="assist-dialog-title"
          aria-describedby="assist-dialog-description"
          fullWidth={true}
          maxWidth={"sm"}
        >
          <DialogTitle>{this.props.category}</DialogTitle>
          <SupportsContent
            addAllocated={amount =>
              this.props.addAllocated(
                this.props.mainGroup,
                this.props.category,
                amount
              )
            }
          />
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
