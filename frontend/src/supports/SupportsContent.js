import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles, withStyles } from "@material-ui/styles";
import { LIGHT_BLUE, NAV_BAR_HEIGHT } from "../common/theme";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
//import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
  navBar: {
    height: NAV_BAR_HEIGHT
  },
  grow: {
    flexGrow: 1
  }
});

var hoursRegex = new RegExp(/^-?\d*\.?\d$/);

export default class SupportsContent extends React.Component {
  state = {
    currentPage: "userSupportsList",
    userSupports: [{ name: "Wheelchair", cost: 160 }],
    allSupports: [
      {
        name: "Occupational Therapist",
        price: 30.2,
        isLabor: true
      },
      {
        name: "Gardener",
        price: 48.5,
        isLabor: true
      },
      {
        name: "Hearing Aid",
        price: 49.95,
        isLabor: false
      },
      {
        name: "Wheelchair",
        price: 160,
        isLabor: false
      }
    ],
    selectedSupport: ""
  };

  category = "Core Supports";

  total = 1000;

  handleClose = () => {};

  // switch content page
  goToPage = page => {
    this.setState({ currentPage: page });
  };

  // add the support of given name to the user's list of supports
  // return to user supports list
  addSupport = nameQuery => {
    let result = this.state.allSupports.filter(obj => {
      return obj.name === nameQuery;
    });
    if (result[0].isLabor) {
      var copy = Object.assign({}, result[0]);
      this.setState({ selectedSupport: copy });
      this.goToPage("editSupport");
    } else {
      this.state.userSupports.push(result[0]);
      var newUserSupports = this.state.userSupports;
      newUserSupports[this.state.userSupports.length - 1]["cost"] =
        result[0].price;
      this.setState({ userSupports: newUserSupports });
      this.goToPage("userSupportsList");
    }
  };

  // update one of the four hours fields for a given support
  updateHours = fieldType => e => {
    if (hoursRegex.test(e.target.value)) {
      this.state.selectedSupport[fieldType] = e.target.value;
      //var newSelectedSupport = this.state.selectedSupport;
      //newSelectedSupport[fieldType] = parseFloat(e.target.value);
      //this.setState({selectedSupport: newSelectedSupport})
    }
  };

  // calculate the total cost of labour for the selected support
  // update the user support array with the edited item after clicking done on edit page
  doneUpdatingHours = () => {
    var cost = 0;
    var next = "";
    next = this.state.selectedSupport["weekday"];
    if (next && next !== "") {
      cost += parseFloat(next);
    }
    next = this.state.selectedSupport["weekend"];
    if (next && next !== "") {
      cost += next * 1.3;
    }
    next = this.state.selectedSupport["holiday"];
    if (next && next !== "") {
      cost += next * 1.5;
    }
    next = this.state.selectedSupport["holidayAfter"];
    if (next && next !== "") {
      cost += next * 2;
    }
    cost = cost * this.state.selectedSupport["price"];
    cost = Math.round(cost * 100) / 100;
    var newSelectedSupport = this.state.selectedSupport;
    newSelectedSupport["cost"] = cost;
    this.setState({ selectedSupport: newSelectedSupport });
    this.state.userSupports.push(this.state.selectedSupport);
    this.goToPage("userSupportsList");
  };

  totalOfUserSupports = () => {
    var total = 0;
    for (var i = 0; i < this.state.userSupports.length; i++) {
      total += parseFloat(this.state.userSupports[i]["cost"]);
    }
    total = Math.round(total * 100) / 100;
    return total;
  };

  render() {
    let content = "";
    if (this.state.currentPage === "userSupportsList") {
      content = (
        <UserSupportsList
          userSupports={this.state.userSupports}
          totalOfUserSupports={this.totalOfUserSupports}
          goToPage={this.goToPage}
        />
      );
    } else if (this.state.currentPage === "chooseNewSupport") {
      content = (
        <ChooseNewSupport
          allSupports={this.state.allSupports}
          goToPage={this.goToPage}
          addSupport={this.addSupport}
        />
      );
    } else if (this.state.currentPage === "editSupport") {
      content = (
        <EditSupport
          updateHours={this.updateHours}
          doneUpdatingHours={this.doneUpdatingHours}
          total={this.total}
          goToPage={this.goToPage}
          selectedSupport={this.state.selectedSupport}
        />
      );
    }
    return (
      <Grid>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <Toolbar className={useStyles.navBar}>
          <Typography variant="h6" color="inherit" className={useStyles.grow}>
            {this.category}
          </Typography>
        </Toolbar>
        {content}
      </Grid>
    );
  }
}

// Page which lists all user's supports for selected category
function UserSupportsList(props) {
  let supportsList = [];

  // create list of user supports
  for (let i = 0; i < props.userSupports.length; i++) {
    supportsList.push(
      <ListItem button key={i} divider={true}>
        <ListItemText primary={props.userSupports[i]["name"]} />
        <ListItemSecondaryAction>
          <Typography inline variant="body1" align="right">
            ${props.userSupports[i]["cost"]}
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
              ${props.totalOfUserSupports()}
            </Typography>
          </ListItemSecondaryAction>
        </TotalListItem>
        {supportsList}
        <AddListItem
          button
          onClick={function() {
            props.goToPage("chooseNewSupport");
          }}
        >
          <Typography className="material-icons">add</Typography>
          <Typography inline variant="body1">
            Add new support
          </Typography>
        </AddListItem>
      </List>
    </DialogContent>
  );
}

// Page where user chooses new supports to add to their budget
function ChooseNewSupport(props) {
  let supportsList = [];

  // create list of all supports
  for (let i = 0; i < props.allSupports.length; i++) {
    supportsList.push(
      <ListItem button key={i} divider={true}>
        <ListItemText primary={props.allSupports[i]["name"]} />
        <ListItemSecondaryAction>
          <Typography variant="body1" p={16} inline>
            ${props.allSupports[i]["price"]}
          </Typography>
          <Typography variant="body1" inline>
            {props.allSupports[i]["isLabor"] ? "/hour" : "/each"}
          </Typography>
          <Button
            variant="contained"
            align="right"
            onClick={function() {
              props.addSupport(props.allSupports[i]["name"]);
            }}
          >
            <Typography className="material-icons">add</Typography>
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  return (
    <DialogContent>
      <Grid container justify="space-between" alignItems="center">
        <Typography inline variant="body1" align="left">
          Choose New Support:
        </Typography>
        <Button
          variant="contained"
          align="right"
          onClick={function() {
            props.goToPage("userSupportsList");
          }}
        >
          Cancel
        </Button>
      </Grid>
      <List>{supportsList}</List>
    </DialogContent>
  );
}

// Page where user changes the hours of their labour support
function EditSupport(props) {
  const classes = useStyles();
  return (
    <DialogContent>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            {props.selectedSupport.name}:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            Enter hours per week:
          </Typography>
        </Grid>
        <Grid item xs={6} m={2}>
          <Typography variant="caption">weekday</Typography>
          <Typography variant="caption">7am-7pm</Typography>
          <TextField
            className={classes.number}
            onChange={props.updateHours("weekday")}
            value={props.selectedSupport["weekday"]}
          />
        </Grid>
        <Grid item xs={6} m={2}>
          <Typography variant="caption">after hours</Typography>
          <Typography variant="caption">weekend</Typography>
          <TextField
            className={classes.number}
            onChange={props.updateHours("weekend")}
            value={props.selectedSupport["weekend"]}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption">public holiday</Typography>
          <Typography variant="caption">7am-7pm</Typography>
          <TextField
            className={classes.number}
            onChange={props.updateHours("holiday")}
            value={props.selectedSupport["holiday"]}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption">public holiday</Typography>
          <Typography variant="caption">after hours</Typography>
          <TextField
            className={classes.number}
            onChange={props.updateHours("holidayAfter")}
            value={props.selectedSupport["holidayAfter"]}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            align="center"
            onClick={function() {
              props.doneUpdatingHours();
            }}
          >
            <Typography className="material-icons">thumb_up</Typography>
            <Typography variant="body1">{"Done"}</Typography>
          </Button>
        </Grid>
      </Grid>
    </DialogContent>
  );
}

const TotalListItem = withStyles({
  root: {
    backgroundColor: "#cccccc",
    height: "36px"
  }
})(ListItem);

const AddListItem = withStyles({
  root: {
    backgroundColor: LIGHT_BLUE,
    height: "36px"
  }
})(ListItem);
