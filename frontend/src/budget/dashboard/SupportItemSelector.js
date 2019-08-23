
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

const useStyles = makeStyles({
  dialogContent: {
    minHeight: 400
  }
});

export default function SupportItemSelector(props) {
  const {
    birthYear,
    postcode,
    planCategory,
    supportCategory,
    setPlanItems
  } = props;
  // React Hooks
  const [supportItems, setSupportItems] = useState([]);
  const [highlightAddedPlanItem, setHighlightAddedPlanItem] = useState(false);
  const [registrationGroupId] = useState(null);
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();

  // api call to load support items
  useEffect(() => {
    api.SupportItems.get({
      birthYear: birthYear,
      postcode: postcode,
      supportCategoryID: supportCategory.id,
      registrationGroupId
    }).then(response => {
      setSupportItems(
        response.data.map(supportItem => {
          supportItem.label = supportItem.name;
          return supportItem;
        })
      );
    });
  }, [birthYear, postcode, supportCategory, registrationGroupId]);

  // load plan items from backend (logged in) or local storage
  useEffect(() => {}, [supportCategory]);

  // save plan items (not logged in) into local storage
  useEffect(() => {});

  function handleClose() {
    props.onClose();
  }

  function handleSelectSupportItem(supportItem) {
    const planItem = {
      supportItemId: supportItem.id,
      quantity: 1,
      priceActual: supportItem.price
    };
    const { planItems } = planCategory;
    setPlanItems([planItem, ...planItems]);
    setHighlightAddedPlanItem(true);

    //saveToLocalStorage(planItems);
  }

  function handleDelete(planItem) {
    setPlanItems(_.difference(planCategory.planItems, [planItem]));

    //saveToLocalStorage(planCategory.planItems);
  }

  function handleChangeUnitPrice(event, planItem) {
    setPlanItems(
      planCategory.planItems.map((item, index) => {
        if (planItem === item) {
          return {
            ...item,
            priceActual: event.target.value
          };
        }
        return item;
      })
    );
  }

  function handleChangeUnits(event, planItem) {
    setPlanItems(
      planCategory.planItems.map(item => {
        if (planItem === item) {
          return {
            ...item,
            quantity: event.target.value
          };
        }
        return item;
      })
    );
  }

  function renderPlanItemHeader(planItem, supportItem) {
    return (
      <Grid container alignItems="center">
        <Grid item>
          <ListItemIcon>
            <Tooltip
              disableTouchListener
              title={supportItem.description || "No description"}
            >
              <InfoIcon />
            </Tooltip>
          </ListItemIcon>
        </Grid>
        <Grid item xs>
          <ListItemText primary={supportItem.name} />
        </Grid>
      </Grid>
    );
  }

  function renderPriceLabel(planItem, supportItem) {
    let prefix = "Unit Price ";
    let suffix = "(No Limit)";
    if (supportItem.price != null) {
      suffix = `(Max $${supportItem.price})`;
      if (matchesMd) {
        return prefix + suffix;
      } else if (
        parseFloat(planItem.priceActual) > parseFloat(supportItem.price)
      ) {
        return suffix;
      }
    }
    return prefix + suffix;
  }

  function renderPlanItemBody(planItem, supportItem) {
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
              supportItem.price != null &&
              parseFloat(planItem.priceActual) > parseFloat(supportItem.price)
            }
          >
            <InputLabel htmlFor="unit-price">
              {renderPriceLabel(planItem, supportItem)}
            </InputLabel>
            <Input
              id="unit-price"
              value={planItem.priceActual || ""}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  /{supportItem.unit.toLowerCase()}
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
              value={(planItem.priceActual * planItem.quantity).toFixed(2)}
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

  function renderPlanItem(planItem, index) {
    console.log(supportItems);
    const supportItem = _.find(supportItems, supportItem => {
      return supportItem.id === planItem.supportItemId;
    });

    return (
      supportItem != null && (
        <ListItem
          onClick={() => setHighlightAddedPlanItem(false)}
          selected={highlightAddedPlanItem && index === 0}
        >
          <Grid container>
            <Grid item xs={12}>
              {renderPlanItemHeader(planItem, supportItem)}
            </Grid>
            <Grid item xs={12}>
              {renderPlanItemBody(planItem, supportItem)}
            </Grid>
          </Grid>
        </ListItem>
      )
    );
  }

  function renderPlanItemList() {
    return planCategory.planItems.length === 0 ? (
      <div>Add some first</div>
    ) : (
      <List>
        {planCategory.planItems.map((planItem, index) => (
          <div key={index}>{renderPlanItem(planItem, index)}</div>
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
        <DialogTitle>{supportCategory.name} supports</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <ReactSelect
            inputId={"support-item-select"}
            placeholder={"Search for support items"}
            options={supportItems}
            value={null}
            onChange={handleSelectSupportItem}
          />
          {/* prevent loading until API call has finished */}
          {console.log(supportItems)}
          {renderPlanItemList()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Save & Close</Button>
        </DialogActions>

      </Dialog>
    </div>
  );
}
