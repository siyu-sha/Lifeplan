import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import api from "../../api";
import { DialogContent } from "@material-ui/core";
import Select from "react-select";
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

const useStyles = makeStyles({
  dialogContent: {
    minHeight: 400
  }
});

export default function SupportItemSelector({
  supportCategoryID,
  supportCategoryName,
  birthYear,
  postcode
}) {
  // React Hooks
  const [open, setOpen] = useState(true);
  const [supportItems, setSupportItems] = useState([]);
  const [registrationGroupID, setRegistrationGroupID] = useState(null);
  const [planItems, setPlanItems] = useState([]);
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.up("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();

  useEffect(() => {
    api.SupportItems.get({
      birthYear: 1,
      postcode: 3000,
      supportCategoryID: 12,
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

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSelectSupportItem(supportItem) {
    const planItem = { ...supportItem };
    planItem.planItemID = planItems.length;
    planItem.supportItemID = planItem.id;
    delete planItem.id;

    setPlanItems([planItem, ...planItems]);
  }

  function handleDelete(planItem) {
    setPlanItems(_.difference(planItems, [planItem]));
  }

  function planItemList() {
    return planItems.length === 0 ? (
      <div>Add some first</div>
    ) : (
      <List>
        {planItems.map(planItem => (
          <div key={planItem.planItemID}>
            <ListItem>
              <ListItemText primary={planItem.name} />
            </ListItem>
            <Grid
              container
              spacing={2}
              justify={matchesMd ? "center" : "flex-end"}
            >
              <Grid item xs={4} md={3}>
                <FormControl>
                  <InputLabel htmlFor="unit-price">Unit Price</InputLabel>
                  <Input
                    id="unit-price"
                    value={planItem.price || 0}
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3} md={3}>
                <FormControl>
                  <InputLabel htmlFor="units">Units</InputLabel>
                  <Input
                    id="units"
                    value={0}
                    endAdornment={
                      <InputAdornment position="end">
                        {planItem.unit}
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4} md={3}>
                <FormControl>
                  <InputLabel htmlFor="total">Total</InputLabel>
                  <Input
                    id="total"
                    value={((planItem.price * 100) / 10).toFixed(2)}
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => handleDelete(planItem)}
                  variant="contained"
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </div>
        ))}
      </List>
    );
  }

  return (
    <div>
      {console.log(planItems)}
      <Dialog
        fullScreen={!matchesSm}
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Hi</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Select
            inputId={"support-item-select"}
            placeholder={"Search for support items"}
            options={supportItems}
            value={null}
            onChange={handleSelectSupportItem}
          />
          {planItemList()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Save & Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
