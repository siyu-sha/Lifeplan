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
const WEEK_FORTNIGHTLY = "Fortnightly";
const WEEK_YEARLY = "Specific weeks of the year";

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

export default function PlanAddEditor(props) {
  const { hcpSupportItems,defaultnames,index } = props;

  const defaultname= defaultnames[index];
  const planStartDate = new Date(localStorage.getItem("startDate"));
  const planEndDate = new Date(localStorage.getItem("endDate"));

  const classes = useStyles();

  let quantityRegex = new RegExp(/^$|^[1-9]\d*$/);
  let moneyRegex = new RegExp(/^$|^[1-9]\d*\.?\d{0,2}$/);

  function onClickBack() {
    props.back();
    console.log("index = "+index)
    sethcpSupportItem(hcpSupportItems[index]);
  }
  const [hcpSupportItem,sethcpSupportItem] = useState(hcpSupportItems[0]);

  function onClickSave(values, hcpSupportItemGroup, events) {
      const hcpPlanItemGroup = createNewPlanItemGroup(
        values,
        hcpSupportItemGroup,
        events
      );
      console.log("On click Save");
      console.log(hcpPlanItemGroup);
    if(index==hcpSupportItems.length-1){
      props.save(hcpPlanItemGroup);
      props.redirectSupports();
    }else{
      sethcpSupportItem(hcpSupportItems[index+1]);
      props.next();
    }
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
    }
  }

  function createNewPlanItemGroup(values, hcpSupportItemGroup, events) {
    const hcpPlanItems = events.map((event) => {
      return {
        startDate: event.start,
        endDate: event.end,
        priceActual: parseFloat(values.priceActual),
        name: values.name,
        allDay: event.allDay,
      };
    });
    let name = (defaultname?defaultname:values.name)
    return {
      hcpSupportItemGroup: hcpSupportItemGroup,
      hcpPlanItems:hcpPlanItems,
      nickname:values.name,
      name:name,
      // name:values.name,
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
  const [itemStartDates, setItemStartDates] = useState([]);
  const [checkedWeekdays, setCheckedWeekdays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [checkedMonths, setCheckedMonths] = useState({
    jan: false,
    feb: false,
    mar: false,
    apr: false,
    may: false,
    jun: false,
    jul: false,
    aug: false,
    sep: false,
    oct: false,
    nov: false,
    dec: false,
  });

  const startOfToday = startOfDay(new Date());

  const [itemTimes, setItemTimes] = useState({
    start: setHours(startOfToday, 9),
    end: setHours(startOfToday, 10),
  });

  useEffect(() => {
    if (itemTimes.start > itemTimes.end) {
      setItemTimes({ ...itemTimes, end: addHours(itemTimes.start, 1) });
    }
  }, [itemTimes]);

  const {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  } = checkedWeekdays;

  const {
    jan,
    feb,
    mar,
    apr,
    may,
    jun,
    jul,
    aug,
    sep,
    oct,
    nov,
    dec,
  } = checkedMonths;

  const newEvents = () => {
    if (["D", "EA", "H"].includes(hcpSupportItem.unit)) {
      const createEvent = ({ title, date }) => {
        return {
          title,
          start:
            hcpSupportItem.unit === "H"
              ? setMinutes(
                  setHours(date, getHours(itemTimes.start)),
                  getMinutes(itemTimes.start)
                )
              : date,
          end:
            hcpSupportItem.unit === "H"
              ? setMinutes(
                  setHours(date, getHours(itemTimes.end)),
                  getMinutes(itemTimes.end)
                )
              : date,
          allDay: hcpSupportItem.unit !== "H",
        };
      };

      if (values.frequencyPerYear === YEARLY) {
        return _.map(itemStartDates, (startDate) => {
          return createEvent({ title: values.name, date: startDate });
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
      } else if (values.frequencyPerYear === WEEKLY) {
        const startDate = new Date(planStartDate);
        const dayArray = [
          sunday,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
        ];

        const selectedDays = [];
        for (let i = 0; i < 7; i++) {
          if (dayArray[i] === true) {
            selectedDays.push(i);
          }
        }

        if (selectedDays.length === 0) {
          return [];
        } else {
          const eventDates = [];
          // add first week's days
          let currentDate = new Date(startDate);

          // add the weeks between first and last week of the plan
          const endDate = new Date(planEndDate);
          while (currentDate <= endDate) {
            let dateClone = new Date(currentDate);
            _.forEach(selectedDays, (day) => {
              dateClone = setDay(dateClone, day);
              eventDates.push(
                createEvent({
                  title: values.name,
                  date: dateClone,
                })
              );
            });
            currentDate = startOfWeek(addWeeks(dateClone, 1));
          }

          // clean up dates outside of plan
          _.remove(eventDates, (eventDate) => {
            return eventDate.date < startDate || eventDate.date > endDate;
          });
          return eventDates;
        }
      } else if (values.frequencyPerYear === DAILY) {
        const eventDates = [];
        let currentDate = new Date(planStartDate);
        while (currentDate <= planEndDate) {
          eventDates.push(
            createEvent({
              title: values.name,
              date: new Date(currentDate),
            })
          );
          currentDate = addDays(currentDate, 1);
        }
        return eventDates;
      }
    } else if (hcpSupportItem.unit === "WK") {
      if (values.frequencyPerYear === YEARLY) {
        return _.map(itemStartDates, (itemStartDate) => {
          return {
            title: values.name,
            start: itemStartDate,
            end: endOfWeek(itemStartDate),
          };
        });
      } else {
        let weeksToAdd = 1;
        if (values.frequencyPerYear === FORTNIGHTLY) {
          weeksToAdd += 1;
        }
        const eventDates = [];
        let currentDate = startOfWeek(planStartDate);
        while (currentDate <= planEndDate) {
          eventDates.push({
            title: values.name,
            start: currentDate,
            end: endOfWeek(currentDate),
          });
          currentDate = addWeeks(currentDate, weeksToAdd);
        }
        return eventDates;
      }
    } else if (hcpSupportItem.unit === "MON") {
      const monthArray = [
        jan,
        feb,
        mar,
        apr,
        may,
        jun,
        jul,
        aug,
        sep,
        oct,
        nov,
        dec,
      ];
      const eventDates = [];

      let currentDate = new Date(planStartDate);

      while (
        currentDate <= planEndDate ||
        isSameMonth(currentDate, planEndDate)
      ) {
        const dateClone = new Date(currentDate);
        for (let i = 0; i < 11; i++) {
          if (monthArray[i] === true) {
            const startDate = startOfMonth(setMonth(dateClone, i));
            if (
              (startDate >= planStartDate && startDate <= planEndDate) ||
              isSameMonth(startDate, planStartDate)
            ) {
              eventDates.push({
                title: values.name,
                start: startDate,
                end: endOfMonth(startDate),
              });
            }
          }
        }
        currentDate = addYears(currentDate, 1);
      }

      return eventDates;
    } else if (hcpSupportItem.unit === "YR") {
      return [
        {
          title: values.name,
          start: new Date(startOfDay(planStartDate)),
          end: new Date(endOfDay(planEndDate)),
        },
      ];
    }
  };

  const calculateCost = () => {
    const numberOfItems = newEvents().length;
    const cost = numberOfItems * values.priceActual;
    const result = (hcpSupportItem.unit === "H"
      ? Math.round(
          ((cost * differenceInMinutes(itemTimes.end, itemTimes.start)) / 60) *
            100
        ) / 100
      : Math.round(cost * 100) / 100
    ).toLocaleString(undefined, { minimumFractionDigits: 2 });
    return result;
  };

  const handleDayYearlyDateChange = (date) => {
    const newItemStartDates = _.xorWith(
      [startOfDay(date)],
      itemStartDates,
      isSameDay
    );

    setItemStartDates(newItemStartDates);
  };

  const handleWeekChange = (date) => {
    const newItemStartDates = _.xorWith(
      [startOfWeek(date)],
      itemStartDates,
      isSameDay
    );
    setItemStartDates(newItemStartDates);
  };

  const enumResult = unitEnumeration(hcpSupportItem.unit);
  const unit = enumResult.unit;

  const renderFrequencySelector = () => {
    const frequencyOptions = () => {
      if (DAY_UNITS.includes(hcpSupportItem.unit)) {
        return [
          <MenuItem value={YEARLY} key={DAY_YEARLY}>
            {DAY_YEARLY}
          </MenuItem>,
          <MenuItem value={MONTHLY} key={DAY_MONTHLY}>
            {DAY_MONTHLY}
          </MenuItem>,
          <MenuItem value={WEEKLY} key={DAY_WEEKLY}>
            {DAY_WEEKLY}
          </MenuItem>,
          <MenuItem value={DAILY} key={DAY_DAILY}>
            {DAY_DAILY}
          </MenuItem>,
        ];
      } else if (hcpSupportItem.unit === "WK") {
        return [
          <MenuItem value={YEARLY} key={WEEK_YEARLY}>
            {WEEK_YEARLY}
          </MenuItem>,
          <MenuItem value={FORTNIGHTLY} key={WEEK_FORTNIGHTLY}>
            {WEEK_FORTNIGHTLY}
          </MenuItem>,
          <MenuItem value={WEEKLY} key={WEEK_WEEKLY}>
            {WEEK_WEEKLY}
          </MenuItem>,
        ];
      }
    };
    if (!["MON", "YR"].includes(hcpSupportItem.unit)) {
      return (
        <>
          <Typography variant={"body1"} align={"left"}>
            How often do you use this support item?
          </Typography>
          <FormControl margin={"normal"} required>
            <InputLabel htmlFor={usageFrequency}>Usage Frequency</InputLabel>
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
              {frequencyOptions()}
            </Select>
            <FormHelperText>
              Please select the frequency from the dropdown box
            </FormHelperText>
          </FormControl>
        </>
      );
    }
  };

  const handleCheckWeekDay = (name) => (event) => {
    setCheckedWeekdays({ ...checkedWeekdays, [name]: event.target.checked });
  };

  const handleCheckMonth = (name) => (event) => {
    setCheckedMonths({ ...checkedMonths, [name]: event.target.checked });
  };

  const handleTimeChange = (name) => (value) => {
    setItemTimes({ ...itemTimes, [name]: value });
  };

  const disableMonthCheckBox = (month) => {
    const monthToNumber = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };
    const startDate = setMonth(planStartDate, monthToNumber[month]);
    return !(
      (startDate >= planStartDate && startDate <= planEndDate) ||
      isSameMonth(startDate, planStartDate) ||
      isSameMonth(startDate, planEndDate)
    );
  };

  const renderDatePicker = () => {
    if (DAY_UNITS.includes(hcpSupportItem.unit)) {
      if ([YEARLY, MONTHLY].includes(values.frequencyPerYear)) {
        return (
          <>
            <Typography variant={"body1"} align={"left"}>
              Please select the dates
            </Typography>
            <CustomDatePicker
              handleChange={handleDayYearlyDateChange}
              itemStartDates={itemStartDates}
              minDate={planStartDate}
              maxDate={planEndDate}
            />
          </>
        );
      } else if (values.frequencyPerYear === WEEKLY) {
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">
              On which days do you use this support item?
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={monday}
                    onChange={handleCheckWeekDay("monday")}
                    value="monday"
                  />
                }
                label="Monday"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tuesday}
                    onChange={handleCheckWeekDay("tuesday")}
                    value="tuesday"
                  />
                }
                label="Tuesday"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={wednesday}
                    onChange={handleCheckWeekDay("wednesday")}
                    value="wednesday"
                  />
                }
                label="Wednesday"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={thursday}
                    onChange={handleCheckWeekDay("thursday")}
                    value="thursday"
                  />
                }
                label="Thursday"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={friday}
                    onChange={handleCheckWeekDay("friday")}
                    value="friday"
                  />
                }
                label="Friday"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={saturday}
                    onChange={handleCheckWeekDay("saturday")}
                    value="saturday"
                  />
                }
                label="Saturday"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sunday}
                    onChange={handleCheckWeekDay("sunday")}
                    value="sunday"
                  />
                }
                label="Sunday"
              />
            </FormGroup>
          </FormControl>
        );
      }
    } else if (hcpSupportItem.unit === "WK") {
      return (
        <CustomWeekPicker
          onChange={handleWeekChange}
          itemStartDates={itemStartDates}
          minDate={planStartDate}
          maxDate={planEndDate}
        />
      );
    } else if (hcpSupportItem.unit === "MON") {
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">
            On which months do you use this support item?
          </FormLabel>

          <Grid container>
            <Grid item xs={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={jan}
                      onChange={handleCheckMonth("jan")}
                      value="jan"
                      disabled={disableMonthCheckBox("jan")}
                    />
                  }
                  label="Jan"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={feb}
                      onChange={handleCheckMonth("feb")}
                      value="feb"
                      disabled={disableMonthCheckBox("feb")}
                    />
                  }
                  label="Feb"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={mar}
                      onChange={handleCheckMonth("mar")}
                      value="mar"
                      disabled={disableMonthCheckBox("mar")}
                    />
                  }
                  label="Mar"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={apr}
                      onChange={handleCheckMonth("apr")}
                      value="apr"
                      disabled={disableMonthCheckBox("apr")}
                    />
                  }
                  label="Apr"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={may}
                      onChange={handleCheckMonth("may")}
                      value="may"
                      disabled={disableMonthCheckBox("may")}
                    />
                  }
                  label="May"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={jun}
                      onChange={handleCheckMonth("jun")}
                      value="jun"
                      disabled={disableMonthCheckBox("jun")}
                    />
                  }
                  label="Jun"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={jul}
                      onChange={handleCheckMonth("jul")}
                      disabled={disableMonthCheckBox("jul")}
                      value="jul"
                    />
                  }
                  label="Jul"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={aug}
                      onChange={handleCheckMonth("aug")}
                      disabled={disableMonthCheckBox("aug")}
                      value="aug"
                    />
                  }
                  label="Aug"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sep}
                      onChange={handleCheckMonth("sep")}
                      disabled={disableMonthCheckBox("sep")}
                      value="sep"
                    />
                  }
                  label="Sep"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={oct}
                      onChange={handleCheckMonth("oct")}
                      disabled={disableMonthCheckBox("oct")}
                      value="oct"
                    />
                  }
                  label="Oct"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={nov}
                      onChange={handleCheckMonth("nov")}
                      disabled={disableMonthCheckBox("nov")}
                      value="nov"
                    />
                  }
                  label="Nov"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={dec}
                      onChange={handleCheckMonth("dec")}
                      disabled={disableMonthCheckBox("dec")}
                      value="dec"
                    />
                  }
                  label="Dec"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </FormControl>
      );
    }
  };

  const renderTimePicker = () => {
    if (hcpSupportItem.unit === "H") {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormLabel component="legend">When do you use it?</FormLabel>
          </Grid>
          <Grid item>
            <InputLabel>From</InputLabel>
            <CustomTimePicker
              value={itemTimes.start}
              onChange={handleTimeChange("start")}
              minHour={0}
              minMinute={0}
            />
          </Grid>
          <Grid item>
            <InputLabel>To</InputLabel>

            <CustomTimePicker
              value={itemTimes.end}
              onChange={handleTimeChange("end")}
              minHour={getHours(itemTimes.start)}
              minMinute={getMinutes(itemTimes.start)}
            />
          </Grid>
        </Grid>
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
                  <Typography cvariant={"body1"} align={"left"}>
                    What would you like to call this support item?
                  </Typography>
                  <FormControl margin={"dense"} required fullWidth>
                    <InputLabel htmlFor={hcpSupportItemName}>
                      Support Item Name
                    </InputLabel>
                    <Input
                      id={hcpSupportItemName}
                      name={hcpSupportItemName}
                      // autoComplete={hcpSupportItemName}
                      autoFocus
                      defaultValue={name}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {renderFrequencySelector()}
                </Grid>
                <Grid item xs={12}>
                  {renderDatePicker()}
                  {renderTimePicker()}
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
                      value={values.priceActual}
                      onChange={(e) => handleChange(e)}
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                    />
                  </FormControl>
                  <Typography cvariant={"body1"} align={"left"}>
                    {
                      hcpSupportItem.unit === "H"
                      ? `Total: $${values.priceActual} x ${
                          newEvents().length
                        } day(s) x 
                    ${
                      differenceInMinutes(itemTimes.end, itemTimes.start) / 60
                    } hour(s) = $${calculateCost()}`
                      : `Total: $${values.priceActual} x ${
                          newEvents().length
                        } ${enumResult.unit}(s)  = $${calculateCost()}`}
                  </Typography>
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
          {
            (index==0)?
                ("Return"):("Back")
          }
        </Button>
        <Button
          variant={"text"}
          onClick={() => onClickSave(values, hcpSupportItem.id, newEvents())}
        >
          {
            (index==hcpSupportItems.length-1)?
                ("Save"):("Next")
          }

        </Button>
      </DialogActions>
    </>
  );
}
