import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles, withStyles } from "@material-ui/styles";
import { NAV_BAR_HEIGHT } from "../common/theme";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

const useStyles = makeStyles({
  navBar: {
    height: NAV_BAR_HEIGHT
  },
  grow: {
    flexGrow: 1
  }
});

export default class SupportsContent extends React.Component {
  category = "Core Supports";

  state = {};

  total = 1000;

  user_supports = [
    {
      name: "Gardener",
      cost: 480.5,
      weekday: 5,
      weekend: 3,
      holiday: 0,
      holidayAfter: 2
    },
    { name: "Wheelcair", cost: 160 }
  ];

  handleClose = () => {};

  render() {
    return (
      <Grid>
        <Toolbar className={useStyles.navBar}>
          <Typography variant="h6" color="inherit" className={useStyles.grow}>
            {this.category}
          </Typography>
        </Toolbar>
        <UserSupportsList supports={this.user_supports} total={this.total} />
        <DialogActions>
          <Button onClick={this.handleClose}> Save </Button>
          <Button onClick={this.handleClose}> Cancel </Button>
        </DialogActions>
      </Grid>
    );
  }
}

const StyledListItem = withStyles({
  root: {
    backgroundColor: "#cccccc",
    height: "36px"
  }
})(ListItem);

function UserSupportsList(props) {
  let supportsList = [];

  for (let i = 0; i < props.supports.length; i++) {
    supportsList.push(
      <ListItem button key={i} divider={true} className={useStyles.listItem}>
        <ListItemText primary={props.supports[i]["name"]} />
      </ListItem>
    );
  }

  return (
    <DialogContent id="assist-dialog-description">
      <List className={useStyles.totalBar}>
        <StyledListItem>
          <Typography inline variant="h6" align="right">
            Total:
          </Typography>
          <ListItemSecondaryAction>
            <Typography inline variant="h6" align="right">
              ${props.total}
            </Typography>
          </ListItemSecondaryAction>
        </StyledListItem>
        {supportsList}
      </List>
    </DialogContent>
  );
}
