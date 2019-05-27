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
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";

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
  },
  leftIcon: {
    marginRight: 24
  },
  rightIcon: {
    marginLeft: 24
  }
});

var hoursRegex = new RegExp(/^-?\d*\.?\d*$/);

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
    selectedSupport: 0
  };

  category = "Core Supports";

  total = 1000;

  handleClose = () => {};

  // switch content page
  goToPage = page => {
    this.setState({ currentPage: page });
  };

  // click on an item from the list of user's items and load SingleSupport component
  clickOnItem = index => {
    this.setState({ selectedSupport: index });
    this.goToPage("singleSupport");
  };

  // add the support of given name to the user's list of supports
  // return to user supports list
  addSupport = nameQuery => {
    let result = this.state.allSupports.filter(obj => {
      return obj.name === nameQuery;
    });
    var copy = Object.assign({}, result[0]);
    this.state.selectedSupport = this.state.userSupports.length;
    this.state.userSupports.push(copy);
    if (result[0].isLabor) {
      this.goToPage("editSupport");
    } else {
      this.state.userSupports[this.state.selectedSupport].cost =
        result[0].price;
      this.goToPage("userSupportsList");
    }
  };

  // update one of the four hours fields for a given support
  updateHours = fieldType => e => {
    console.log("updateHours");
    if (hoursRegex.test(e.target.value)) {
      console.log("passTest");
      console.log(e.target.value);
      this.state.userSupports[this.state.selectedSupport][fieldType] =
        e.target.value;
      console.log(this.state.userSupports[this.state.selectedSupport]);
    }
  };

  getSelectedSupport = () => {
    return this.state.userSupports[this.state.selectedSupport];
  };

  // calculate the total cost of labour for the selected support
  // update the user support array with the edited item after clicking done on edit page
  doneUpdatingHours = () => {
    var cost = 0;
    var next = "";
    next = this.state.userSupports[this.state.selectedSupport].weekday;
    if (next && next !== "") {
      cost += parseFloat(next);
    }
    next = this.state.userSupports[this.state.selectedSupport].weekend;
    if (next && next !== "") {
      cost += next * 1.3;
    }
    next = this.state.userSupports[this.state.selectedSupport].holiday;
    if (next && next !== "") {
      cost += next * 1.5;
    }
    next = this.state.userSupports[this.state.selectedSupport].holidayAfter;
    if (next && next !== "") {
      cost += next * 2;
    }
    cost = cost * this.state.userSupports[this.state.selectedSupport].price;
    cost = Math.round(cost * 100) / 100;
    this.state.userSupports[this.state.selectedSupport]["cost"] = cost;
    this.goToPage("userSupportsList");
  };

  totalOfUserSupports = () => {
    var total = 0;
    let keys = Object.keys(this.state.userSupports);
    for (var key of keys) {
      total += parseFloat(this.state.userSupports[key]["cost"]);
    }
    total = Math.round(total * 100) / 100;
    return total;
  };

  deleteSelectedSupport = () => {
    delete this.state.userSupports[this.state.selectedSupport];
    this.goToPage("userSupportsList");
  };

  render() {
    let content = "";
    if (this.state.currentPage === "userSupportsList") {
      content = (
        <UserSupportsList
          userSupports={this.state.userSupports}
          totalOfUserSupports={this.totalOfUserSupports}
          goToPage={this.goToPage}
          clickOnItem={this.clickOnItem}
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
          userSupports={this.state.userSupports}
          selectedSupport={this.state.selectedSupport}
          getSelectedSupport={this.getSelectedSupport}
        />
      );
    } else if (this.state.currentPage === "singleSupport") {
      content = (
        <SingleSupport
          goToPage={this.goToPage}
          userSupports={this.state.userSupports}
          selectedSupport={this.state.selectedSupport}
          deleteSelectedSupport={this.deleteSelectedSupport}
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
  let keys = Object.keys(props.userSupports);
  for (var key of keys) {
    supportsList.push(
      <ListItem
        button
        key={key}
        divider={true}
        onClick={function() {
          props.clickOnItem(key);
        }}
      >
        <ListItemText primary={props.userSupports[key]["name"]} />
        <ListItemSecondaryAction>
          <Typography inline variant="body1" align="right">
            ${props.userSupports[key]["cost"]}
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
      <ListItem
        button
        key={i}
        divider={true}
        onClick={function() {
          props.addSupport(props.allSupports[i]["name"]);
        }}
      >
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
            {props.userSupports[props.selectedSupport].name}:
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
            value={props.userSupports[props.selectedSupport].weekday}
          />
        </Grid>
        <Grid item xs={6} m={2}>
          <Typography variant="caption">after hours</Typography>
          <Typography variant="caption">weekend</Typography>
          <TextField
            className={classes.number}
            onChange={props.updateHours("weekend")}
            value={props.userSupports[props.selectedSupport].weekend}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption">public holiday</Typography>
          <Typography variant="caption">7am-7pm</Typography>
          <TextField
            className={classes.number}
            onChange={props.updateHours("holiday")}
            value={props.userSupports[props.selectedSupport].holiday}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption">public holiday</Typography>
          <Typography variant="caption">after hours</Typography>
          <TextField
            className={classes.number}
            onChange={props.updateHours("holidayAfter")}
            value={props.userSupports[props.selectedSupport].holidayAfter}
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

function SingleSupport(props) {
  const classes = useStyles();

  return (
    <DialogContent id="assist-dialog-description">
      <List>
        <ListItem divider={true}>
          <Typography inline variant="body1" align="center">
            Support Name
          </Typography>
          <ListItemSecondaryAction>
            <Typography inline variant="body1" align="left">
              Cost
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <Typography inline variant="body1" align="center">
            {props.userSupports[props.selectedSupport].name}
          </Typography>
          <ListItemSecondaryAction>
            <Typography inline variant="body1" align="left">
              {props.userSupports[props.selectedSupport].cost}
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={props.deleteSelectedSupport}
          >
            Delete
            <DeleteIcon className={classes.rightIcon} />
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={function() {
              props.goToPage("userSupportsList");
            }}
          >
            Save
            <SaveIcon className={classes.rightIcon} />
          </Button>
          {props.userSupports[props.selectedSupport].isLabor ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={function() {
                props.goToPage("editSupport");
              }}
            >
              Edit
              <EditIcon className={classes.rightIcon} />
            </Button>
          ) : (
            ""
          )}
        </ListItem>
      </List>
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
