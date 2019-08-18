import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import api from "../../api";
import { DialogContent } from "@material-ui/core";
import ReactSelect from "react-select";
import { useTheme } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DialogActions from "@material-ui/core/DialogActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import _ from "lodash";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";
import ListItemIcon from "@material-ui/core/ListItemIcon";

const LOCAL_STORAGE_KEY = "supportCategory";
// Temporary
const loggedIn = false;

const useStyles = makeStyles({
  dialogContent: {
    minHeight: 400
  }
});

export default function SupportItemSelector(props) {
  const { birthYear, postcode, supportCategoryID, supportCategoryName } = props;
  // React Hooks
  const [supportItems, setSupportItems] = useState([]);
  const [selectedPlanItemID, setSelectedPlanItemID] = useState(null);
  const [registrationGroupID, setRegistrationGroupID] = useState(null);
  const [planItems, setPlanItems] = useState([]);
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();

  // api call to load support items
  useEffect(() => {
    api.SupportItems.get({
      birthYear: 1,
      postcode: 3000,
      supportCategoryID: 9,
      registrationGroupID
    }).then(response => {
      setSupportItems(
        response.data.map(supportItem => {
          supportItem.label = supportItem.name;
          return supportItem;
        })
      );
    });
  }, [birthYear, postcode, supportCategoryID, registrationGroupID]);

  // load plan items from backend (logged in) or local storage
  useEffect(() => {
    if (loggedIn) {
    } else {
      const supportCategory = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY)
      );
      if (
        supportCategory != null &&
        supportCategory[supportCategoryID] != null
      ) {
        setPlanItems(supportCategory[supportCategoryID]);
      }
    }
  }, [supportCategoryID]);

  // save plan items (not logged in) into local storage
  useEffect(() => {
    if (!loggedIn) {
      const supportCategory = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY)
      )
        ? JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY))
        : {};

      supportCategory[supportCategoryID] = planItems;

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(supportCategory));
    }
  });

  function handleClose() {
    props.onClose();
  }

  function handleSelectSupportItem(supportItem) {
    const planItem = { ...supportItem };
    planItem.planItemID = planItems.length;
    planItem.supportItemID = planItem.id;
    planItem.quantity = 1;
    planItem.maxPrice = supportItem.price;
    setSelectedPlanItemID(planItem.planItemID);
    delete planItem.id;
    setPlanItems([planItem, ...planItems]);

    //saveToLocalStorage(planItems);
  }

  function handleDelete(planItem) {
    setPlanItems(_.difference(planItems, [planItem]));

    //saveToLocalStorage(planItems);
  }

  function handleChangeUnitPrice(event, planItem) {
    setPlanItems(
      planItems.map(item => {
        if (planItem.planItemID === item.planItemID) {
          return {
            ...item,
            price: event.target.value
          };
        }
        return item;
      })
    );
  }

  function handleChangeUnits(event, planItem) {
    setPlanItems(
      planItems.map(item => {
        if (planItem.planItemID === item.planItemID) {
          return {
            ...item,
            quantity: event.target.value
          };
        }
        return item;
      })
    );
  }

  function renderPlanItemHeader(planItem) {
    return (
      <Grid container alignItems="center">
        <Grid item>
          <ListItemIcon>
            <Tooltip
              disableTouchListener
              title={planItem.description || "No description"}
            >
              <InfoIcon />
            </Tooltip>
          </ListItemIcon>
        </Grid>
        <Grid item xs>
          <ListItemText primary={planItem.name} />
        </Grid>
      </Grid>
    );
  }

  function renderPriceLabel(planItem) {
    let prefix = "Unit Price ";
    let suffix = "(No Limit)";
    if (planItem.maxPrice != null) {
      suffix = `(Max $${planItem.maxPrice})`;
      if (matchesMd) {
        return prefix + suffix;
      } else if (parseFloat(planItem.price) > parseFloat(planItem.maxPrice)) {
        return suffix;
      }
    }
    return prefix + suffix;
  }

  function renderPlanItemBody(planItem) {
    return (
      <Grid
        container
        spacing={matchesMd ? 2 : 1}
        justify={"flex-end"}
        alignItems="flex-end"
      >
        <Grid item xs={6} md>
          <FormControl
            fullWidth
            error={
              planItem.maxPrice != null &&
              parseFloat(planItem.price) > parseFloat(planItem.maxPrice)
            }
          >
            <InputLabel htmlFor="unit-price">
              {renderPriceLabel(planItem)}
            </InputLabel>
            <Input
              id="unit-price"
              value={planItem.price || ""}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  /{planItem.unit.toLowerCase()}
                </InputAdornment>
              }
              placeholder="Type here"
              onChange={event => handleChangeUnitPrice(event, planItem)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel shrink htmlFor="units">
              {matchesMd ? "Units (yearly)" : "Units"}
            </InputLabel>
            <Input
              id="units"
              value={planItem.quantity}
              placeholder="Type here"
              onChange={event => handleChangeUnits(event, planItem)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} md>
          <FormControl fullWidth>
            <InputLabel htmlFor="total">Total</InputLabel>
            <Input
              id="total"
              value={(planItem.price * planItem.quantity).toFixed(2)}
              readOnly
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            onClick={() => handleDelete(planItem)}
            variant="outlined"
            color="primary"
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    );
  }

  function renderPlanItem(planItem) {
    return (
      <ListItem
        onClick={() => setSelectedPlanItemID(null)}
        selected={planItem.planItemID === selectedPlanItemID}
      >
        <Grid container>
          <Grid item xs={12}>
            {renderPlanItemHeader(planItem)}
          </Grid>
          <Grid item xs={12}>
            {renderPlanItemBody(planItem)}
          </Grid>
        </Grid>
      </ListItem>
    );
  }

  function renderPlanItemList() {
    return planItems.length === 0 ? (
      <div>Add some first</div>
    ) : (
      <List>
        {planItems.map((planItem, index) => (
          <div key={index}>{renderPlanItem(planItem)}</div>
        ))}
      </List>
    );
  }

  return (
    <div>
      <Dialog
        fullScreen={!matchesMd}
        fullWidth
        maxWidth="md"
        open={props.open}
        onClose={handleClose}
      >
        <DialogTitle>{supportCategoryName} supports</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <ReactSelect
            inputId={"support-item-select"}
            placeholder={"Search for support items"}
            options={supportItems}
            value={null}
            onChange={handleSelectSupportItem}
          />

          {renderPlanItemList()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Save & Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
