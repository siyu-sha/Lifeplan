import React from "react";
import { DialogContent } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  main: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  blackButton: {
    backgroundColor: "black",
    color: "white"
  }
}));

export default function SupportItemEditor(props) {
  const { editValues, editedItem } = props;

  //const theme = useTheme();
  const classes = useStyles();

  function handleChange(e) {
    props.onChange(e);
  }

  //enumerate the unit of each support item
  function unitEnumeration(unitString) {
    let units = 0;
    let unitTime = "";
    let unit = "";
    switch (unitString) {
      case "H":
        unitTime = "hours";
        units = 5;
        unit = "hour";
        break;
      case "D":
        units = 4;
        unitTime = "days";
        unit = "day";
        break;
      case "WK":
        units = 3;
        unitTime = "weeks";
        unit = "week";
        break;
      case "MON":
        units = 2;
        unitTime = "months";
        unit = "month";
        break;
      case "YR":
        units = 1;
        unitTime = "times";
        unit = "year";
        break;
      case "EA":
        units = 5;
        unitTime = "times";
        unit = "time";
        break;
      default:
        break;
    }
    return { units, unitTime, unit };
  }

  function timeEnumeration(frequency) {
    let timeEnum = "";
    switch (frequency) {
      case 365:
        timeEnum = "day";
        break;
      case 52:
        timeEnum = "week";
        break;
      case 12:
        timeEnum = "month";
        break;
      case 1:
        timeEnum = "year";
        break;
      default:
        break;
    }
    return timeEnum;
  }

  function displayTotalCost(totalPrice, frequencyUnit, quantityUnit) {
    return totalPrice > 0 ? (
      <Typography>
        Total: ${editValues.price_actual} X {editValues.quantity} {quantityUnit}
        (s) X {editValues.frequency_per_year} {frequencyUnit}(s) = ${totalPrice}
      </Typography>
    ) : (
      <Typography>Total: $0</Typography>
    );
  }

  const usageFrequency = "frequency_per_year";
  const supportItemName = "name";
  const itemPrice = "price_actual";
  const itemQuantity = "quantity";
  //const quantity = "quantity";
  //console.log(editedItem);
  const enumResult = unitEnumeration(editedItem.unit);
  const unitEnum = enumResult.units;
  const unitTime = enumResult.unitTime;
  const unit = enumResult.unit;
  const frequencyUsage = timeEnumeration(editValues.frequency_per_year);
  const totalPrice = (
    editValues.price_actual *
    editValues.frequency_per_year *
    editValues.quantity
  ).toFixed(2);
  //console.log(editedItem);
  //console.log(frequency);
  //console.log("the enum is " + unitEnum);

  return (
    <DialogContent>
      <main>
        <form className={classes.form}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography cvariant={"body1"} align={"left"}>
                What would you like to call this support item?
              </Typography>
              <FormControl margin={"dense"} required fullWidth>
                <InputLabel htmlFor={supportItemName}>
                  Support Item Name
                </InputLabel>
                <Input
                  id={supportItemName}
                  name={supportItemName}
                  autoComplete={supportItemName}
                  autoFocus
                  value={editValues.name}
                  onChange={e => handleChange(e)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant={"body1"} align={"left"}>
                How often do you use this support item?
              </Typography>
              <FormControl margin={"normal"} required>
                <InputLabel htmlFor={usageFrequency}>
                  Usage Frequency
                </InputLabel>
                <Select
                  value={editValues.frequency_per_year}
                  onChange={e => handleChange(e)}
                  inputProps={{
                    name: usageFrequency,
                    id: usageFrequency
                  }}
                >
                  {unitEnum >= 5 && <MenuItem value={365}>daily</MenuItem>}
                  {unitEnum >= 4 && <MenuItem value={52}>weekly</MenuItem>}
                  {unitEnum >= 3 && <MenuItem value={12}>monthly</MenuItem>}
                  {unitEnum >= 1 && <MenuItem value={1}>yearly</MenuItem>}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography cvariant={"body1"} align={"left"}>
                How many {unitTime} do you this use per {frequencyUsage}?
              </Typography>
              <FormControl margin={"normal"} required>
                <InputLabel htmlFor={itemQuantity}>{unitTime}</InputLabel>
                <Input
                  id={itemQuantity}
                  name={itemQuantity}
                  autoComplete={itemQuantity}
                  autoFocus
                  value={editValues.quantity}
                  onChange={e => handleChange(e)}
                  //endAdornment={<InputAdornment position="end">per {frequencyUsage}</InputAdornment>}
                ></Input>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography cvariant={"body1"} align={"left"}>
                How much does each {unit} cost?
              </Typography>
              <FormControl margin={"normal"} required>
                <InputLabel htmlFor={itemPrice}>Amount</InputLabel>
                <Input
                  id={itemPrice}
                  name={itemPrice}
                  autoComplete={itemPrice}
                  autoFocus
                  value={editValues.price_actual}
                  onChange={e => handleChange(e)}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                ></Input>
              </FormControl>
            </Grid>
          </Grid>
          {displayTotalCost(totalPrice, frequencyUsage, unit)}
        </form>
      </main>
    </DialogContent>
  );
}
