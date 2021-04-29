import React, { useState } from "react";
import PreviewCalendar from "./hcp_PreviewCalendar";
import {
  Button,
  Checkbox,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Typography,
} from "@material-ui/core";
import styles from "./TwelveMonthCalendar.module.css";
import { getMonth, getYear, setMonth, setYear } from "date-fns";
import { calculatePlanItemCost } from "./hcp_BudgetDashboard";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function TwelveMonthCalendar(props) {
  const { onClick, planDates, hcpPlanCategories, hcpSupportGroups } = props;
  const [year, setYear] = useState(getYear(new Date()));
  const [showPreview, setShowPreview] = useState(false);
  // each array in costs represents a month,
  // where month[0] is Core, month[1] is Capacity, month[2] is Capital

  const costs = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  // populate array
  for (const [key, value] of Object.entries(hcpPlanCategories)) {
    const intKey = parseInt(key);
    let hcpSupportGroupId = -1;
    for (const hcpSupportGroup of hcpSupportGroups) {
      for (const hcpSupportCategory of hcpSupportGroup.hcpSupportCategories) {
        if (parseInt(hcpSupportCategory.id) === intKey) {
          hcpSupportGroupId = hcpSupportGroup.id - 1;
          break;
        }
      }
      if (hcpSupportGroupId !== -1) {
        break;
      }
    }
    // support group found, now find month of events
    value.hcpPlanItemGroups.forEach((hcpPlanItemGroup) => {
      hcpPlanItemGroup.hcpPlanItems &&
        hcpPlanItemGroup.hcpPlanItems.forEach((hcpPlanItem) => {
          const startDate = new Date(hcpPlanItem.startDate);
          const itemMonth = getMonth(startDate);
          const itemYear = getYear(startDate);
          if (itemYear >= year) {
            const currentMonth = getMonth(new Date());
            const currentYear = getYear(new Date());
            if (itemYear > year) {
              if (itemMonth < currentMonth) {
                if (year === currentYear) {
                  costs[itemMonth][hcpSupportGroupId] += calculatePlanItemCost(
                    hcpPlanItem
                  );
                }
              }
            }
            if (itemYear === year) {
              if (itemMonth >= currentMonth) {
                costs[itemMonth][hcpSupportGroupId] += calculatePlanItemCost(
                  hcpPlanItem
                );
              }
            }
          }
        });
    });
  }

  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
        <Typography variant="h5">12-Month View</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container justify="center">
          <Grid container item className={styles.container} alignItems="center">
            <Grid item>
              <Button
                onClick={() => {
                  setYear(year - 1);
                }}
              >
                {"<"}
              </Button>
              {getMonth(new Date()) > 0 ? (
                <Typography display="inline">
                  {year}
                  {"/"}
                  {year + 1}
                </Typography>
              ) : (
                <Typography display="inline">{year}</Typography>
              )}
              <Button
                onClick={() => {
                  setYear(year + 1);
                }}
              >
                {">"}
              </Button>
            </Grid>
            <Grid item>
              <Checkbox
                className={styles.checkbox}
                checked={showPreview}
                onChange={() => setShowPreview(!showPreview)}
              />
              <Typography display="inline">Show Budgets</Typography>
            </Grid>
            <Grid container item justify="center">
              {renderCalendars(costs, year, showPreview, onClick, planDates)}
            </Grid>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

function renderCalendars(costs, year, showPreview, onClick, planDates) {
  const calendars = [];
  const currentMonth = getMonth(new Date());

  let revcounter = 0;
  if (currentMonth !== 0) {
    revcounter = 13 - currentMonth;
  }

  let j = 0;
  for (let i = currentMonth; i < currentMonth + 12; i++) {
    if (currentMonth !== 0) {
      if (i >= 12) {
        j = i - 12;
      } else {
        j = i;
      }
    } else {
      j = i;
    }

    let date = "";
    if (revcounter !== 0 || revcounter > 0) {
      revcounter--;
    }

    if (revcounter === 0) {
      date = setYear(setMonth(new Date(), i), year + 1);
    } else {
      date = setYear(setMonth(new Date(), i), year);
    }

    calendars.push(
      <Grid
        onClick={() => onClick(date)}
        className={styles.calendarGrid}
        key={i}
      >
        <PreviewCalendar
          showPreview={showPreview}
          startDate={date}
          costs={costs[j]}
          planDates={planDates}
        />
      </Grid>
    );
  }
  return calendars;
}
