//UI for plan item addition
//The UI provides 4 fields for users to modify the support item:
// 1. a costomised support item name, meaning users are able to name the item whatever they want
// 2. usage frequency, how often they use the item
// 3. the number of items users consume each time
// 4. the customised price, price for users may differ for varied reasons
// each field will be filled with a default value if users never costomised them before
// an annual cost will be calculated based on the fields
// once saved, a new item will be added into plan items list
import React, { useEffect, useState } from "react";
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
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import FormHelperText from "@material-ui/core/FormHelperText";
import CustomDatePicker from "./CustomDatePicker";
import _ from "lodash";
import {
  isSameDay,
  addMonths,
  setDate,
  isSameMonth,
  setDay,
  addWeeks,
  startOfWeek,
  endOfWeek,
  setHours,
  startOfDay,
  getHours,
  setMinutes,
  getMinutes,
  setMonth,
  endOfMonth,
  startOfMonth,
  addYears,
  addDays,
  differenceInMinutes,
  endOfDay,
  addHours,
} from "date-fns";
import CustomCalendar from "../CustomCalendar";
// import { LocalStorageKeys as localStorageKeys } from "../../common/constants";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CustomWeekPicker from "./CustomWeekPicker";
import CustomTimePicker from "./CustomTimePicker";

export const DAY_UNITS = ["H", "D", "EA"];
const DAY_DAILY = "Every day";
const DAY_WEEKLY = "Once or more per week recurringly";
const DAY_MONTHLY = "Once or more per month recurringly";
const DAY_YEARLY = "Specific times in the year";

const WEEK_WEEKLY = "Weekly";
const WEEK_MONTHLY  = "Monthly";
const WEEK_FORTNIGHTLY = "Fortnightly";
const WEEK_YEARLY = "Specific weeks of the year";
const IMMEDIATELY = "Immediately";

export const DAILY = "DAILY";
export const WEEKLY = "WEEKLY";
export const FORTNIGHTLY = "FORTNIGHTLY";
export const MONTHLY = "MONTHLY";
export const YEARLY = "YEARLY";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  main: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  blackButton: {
    backgroundColor: "black",
    color: "white",
  },
}));

export default function ManageEditor(props) {
  const { manageItemGroup,categoryId } = props;
  console.log(manageItemGroup);
  // console.log(hcpSupportItems);
  // const hcpSupportItem= hcpSupportItems[index];
  const itemname =
    (categoryId==1)
        ? "Administration, finance management and governance"
        : "Care Assessment, Planning, Coordination"
  const hcpSupportItem =[];

  const defaultname = itemname ;
  const planStartDate = new Date(localStorage.getItem("startDate"));
  const planEndDate = new Date(localStorage.getItem("endDate"));

  const classes = useStyles();

  let quantityRegex = new RegExp(/^$|^[1-9]\d*$/);
  let moneyRegex = new RegExp(/^$|^[1-9]\d*\.?\d{0,2}$/);

  function onClickBack() {
    props.back();
  }

  function onClickSave(values, categoryId, events) {
      const hcpPlanItemGroup = createNewPlanItemGroup(
        values,
        categoryId,
        events
      );
      props.save(hcpPlanItemGroup);
      props.redirectSupports();
  }

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "priceActual" && !moneyRegex.test(value)) {
      /*do nothing*/
    } else if (name === "quantity" && !quantityRegex.test(value)) {
      /*do nothing*/
    } else {
      setValues((values) => ({
        ...values,
        [name]: value,
      }));
      console.log(values);
    }
  }

  function createNewPlanItemGroup(values, categoryId, events) {
    let meancost = calculateMean();
    let id = 34 + 3*categoryId;
    if(values.frequencyPerYear === IMMEDIATELY){
      id = id + 2;
    }else if(values.frequencyPerYear === MONTHLY){
      id = id +1 ;
    }
    const hcpPlanItems = events.map((event) => {
      return {
        startDate: event.start,
        endDate: event.end,
        priceActual: parseFloat(meancost),
        name: values.name,
        allDay: true,
      };
    });
    return {
      hcpSupportItemGroup: id,
      hcpPlanItems,
      nickname:values.name,
      name:defaultname,
    };
  }

  function initialiseValues(hcpSupportItem) {
    let name, frequency, price;
    let quantity = 0;
    if(defaultname){
        name = defaultname
    }else{
        name = hcpSupportItem.name;
    }
    if (hcpSupportItem.price != null) {
      price = hcpSupportItem.price;
    } else {
      price = 0;
    }
    frequency = YEARLY;
    return { name, frequency, quantity, price };
  }

  //enumerate the unit of each support item
  const usageFrequency = "frequencyPerYear";
  const hcpSupportItemName = "name";
  const itemPrice = "priceActual";
  const { name, frequency, quantity, price } = initialiseValues(hcpSupportItem);
  const [values, setValues] = useState({
    name: name,
    priceActual: price,
    quantity: quantity,
    frequencyPerYear: frequency,
  });
  const itemStartDates = [new Date(planStartDate)];

  const startOfToday = startOfDay(new Date());

  const newEvents = () => {
    if (["D", "EA", "H"].includes(hcpSupportItem.unit)||true) {
      const createEvent = ({ title, date }) => {
        return {
          title,
          start: date,
          end: date,
          allDay: true,
        };
      };

      if (values.frequencyPerYear === IMMEDIATELY) {
        return _.map(itemStartDates, (startDate) => {
          return createEvent({ title: values.name, date: planStartDate });
        });
      } else if (values.frequencyPerYear === MONTHLY) {
        let currentDate = new Date(planStartDate);
        const days = _.map(
          _.groupBy(itemStartDates, (itemStartDate) => itemStartDate.getDate()),
          (value, key) => parseInt(key)
        );
        let eventDates = [];

        while (currentDate <= planEndDate) {
          const newDates = [];
          const dateClone = new Date(currentDate);
          _.forEach(days, (day) => {
            const newDate = setDate(dateClone, day);
            if (isSameMonth(dateClone, newDate)) {
              newDates.push(
                createEvent({
                  title: values.name,
                  date: newDate,
                })
              );
            }
          });
          eventDates = eventDates.concat(newDates);
          currentDate = new Date(setDate(addMonths(currentDate, 1), 1));
        }
        return eventDates;
      } else if (values.frequencyPerYear === FORTNIGHTLY) {
        const startDate = new Date(planStartDate);

          const eventDates = [];
          // add first week's days
          let currentDate = new Date(startDate);

          // add the weeks between first and last week of the plan
          const endDate = new Date(planEndDate);
          while (currentDate <= endDate) {
              eventDates.push(
                createEvent({
                  title: values.name,
                  date: new Date(currentDate),
                })
              );
            currentDate = startOfWeek(addWeeks(currentDate, 2));
          }

          // clean up dates outside of plan
          _.remove(eventDates, (eventDate) => {
            return eventDate.date < startDate || eventDate.date > endDate;
          });
          return eventDates;
      }
    }
  };

  const calculateMean = () => {
    const numberOfItems = newEvents().length;
    const cost = values.priceActual/numberOfItems;
    const result = (Math.round(cost * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
    return result;
  };


  const renderFrequencySelector = () => {

    const frequencyOptions =
        [
          <MenuItem value={FORTNIGHTLY} key={WEEK_FORTNIGHTLY}>
            {WEEK_FORTNIGHTLY}
          </MenuItem>,
          <MenuItem value={MONTHLY} key={WEEK_MONTHLY}>
            {WEEK_MONTHLY}
          </MenuItem>,
          <MenuItem value={IMMEDIATELY} key={IMMEDIATELY}>
            {IMMEDIATELY}
          </MenuItem>,
        ];

    if (!["MON", "YR"].includes(hcpSupportItem.unit)) {
      return (
        <>
          <Typography variant={"body1"} align={"left"}>
            How often do you pay the management fee?
          </Typography>
          <FormControl margin={"normal"} required>
            <InputLabel htmlFor={usageFrequency}>Payment Frequency</InputLabel>
            <Select
              value={values.frequencyPerYear}
              autoWidth
              onChange={(e) => {
                handleChange(e);
              }}
              inputProps={{
                name: usageFrequency,
                id: usageFrequency,
              }}
            >
              {frequencyOptions}
            </Select>
            <FormHelperText>
              Please select the frequency from the dropdown box
            </FormHelperText>
          </FormControl>
        </>
      );
    }
  };

  return (
    <>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item md={5}>
            <form className={classes.form}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  {/*<Typography cvariant={"body1"} align={"left"}>*/}
                  {/*  What would you like to call this support item?*/}
                  {/*</Typography>*/}
                  <FormControl margin={"dense"} required fullWidth>
                    {itemname}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {renderFrequencySelector()}
                </Grid>
                <Grid item xs={12}>
                  <Typography cvariant={"body1"} align={"left"}>
                    How much does the fee cost totally?
                  </Typography>
                  <FormControl margin={"normal"} required>
                    <InputLabel htmlFor={itemPrice}>Amount</InputLabel>
                    <Input
                      id={itemPrice}
                      name={itemPrice}
                      autoComplete={itemPrice}
                      autoFocus
                      value={values.priceActual}
                      onChange={(e) => handleChange(e)}
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid container item md={7} alignItems="flex-end">
            <CustomCalendar newEvents={newEvents()} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant={"text"} onClick={onClickBack}>
          Return
        </Button>
        <Button
          variant={"text"}
          onClick={() => onClickSave(values, categoryId, newEvents())}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
}
