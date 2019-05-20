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
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles({
  navBar: {
    height: NAV_BAR_HEIGHT
  },
  grow: {
    flexGrow: 1
  },
  addButton: {
    position: "fixed"
  },
  fab: {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed !important"
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
    { name: "Wheelchair", cost: 160 },
    { name: "Wheelchair", cost: 160 },
    { name: "Wheelchair", cost: 160 },
    { name: "Wheelchair", cost: 160 },
    { name: "Wheelchair", cost: 160 },
    { name: "Wheelchair", cost: 160 },
    { name: "Wheelchair", cost: 160 },
    { name: "Wheelchair", cost: 160 },
    { name: "Wheelchair", cost: 160 },
    { name: "Wheelchair", cost: 160 },
    { name: "Wheelchair", cost: 160 },
    { name: "Wheelchair", cost: 160 },
    { name: "Wheelchair", cost: 160 }
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
      </Grid>
    );
  }
}

const TotalListItem = withStyles({
  root: {
    backgroundColor: "#cccccc",
    height: "36px"
  }
})(ListItem);

const AddListItem = withStyles({
  root: {
    backgroundColor: "#cccccc",
    height: "36px"
  }
})(ListItem);

function UserSupportsList(props) {
  const classes = useStyles();
  let supportsList = [];

  for (let i = 0; i < props.supports.length; i++) {
    supportsList.push(
      <ListItem button key={i} divider={true}>
        <ListItemText primary={props.supports[i]["name"]} />
        <ListItemSecondaryAction>
          <Typography inline variant="body1" align="right">
            ${props.supports[i]["cost"]}
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  return (
    <DialogContent id="assist-dialog-description">
      <List>
        <TotalListItem>
          <Typography inline variant="body1">
            Total:
          </Typography>
          <ListItemSecondaryAction>
            <Typography inline variant="body1">
              ${props.total}
            </Typography>
          </ListItemSecondaryAction>
        </TotalListItem>
        {supportsList}
        <AddListItem>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <Typography inline>Add new support</Typography>
        </AddListItem>
      </List>
    </DialogContent>
  );
}
