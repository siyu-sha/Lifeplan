import React from "react";
import {
  getDay,
  getDaysInMonth,
  getMonth,
  startOfMonth,
  getYear,
} from "date-fns";
import styles from "./PreviewCalendar.module.css";
import { Card, CardContent } from "@material-ui/core";

export default function PreviewCalendar(props) {
  const { costs, showPreview, startDate, planDates } = props;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className={styles.calendarContainer}>
      {showPreview === true && (
        <Card className={styles.card}>
          <CardContent>
            {/* {`Core: $${costs[0]}`} */}
            <br />
            {/* {`Capacity: $${costs[1]}`} */}
            <br />
            {/* {`Capital: $${costs[2]}`} */}
          </CardContent>
        </Card>
      )}

      <div className={styles.month}>{months[getMonth(startDate)]}</div>
      <table className={styles.calendar}>
        <thead>
          <tr className="calendar-header"></tr>
        </thead>
        <tbody>
          <tr>{renderWeekdays()}</tr>
          {renderDays(startDate, planDates)}
        </tbody>
      </table>
    </div>
  );
}

const dateToString = (date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const renderWeekdays = () => {
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return weekdays.map((weekday) => {
    return (
      <td key={weekday} className={styles.weekday}>
        {weekday}
      </td>
    );
  });
};

const isInArray = (array, value) => {
  return (
    (
      array.find((item) => {
        return item == value;
      }) || []
    ).length > 0
  );
};

const renderDays = (date, planDates) => {
  const startDay = getDay(startOfMonth(date));
  const days = [];
  const daysInMonth = getDaysInMonth(date);
  for (let i = 0; i < startDay; i++) {
    days.push(<td key={i - startDay} className="empty-day" />);
  }

  let arrayPlanDates = [];
  for (const key in planDates) {
    if (planDates.hasOwnProperty(key)) {
      const element = planDates[key];
      arrayPlanDates.push(dateToString(new Date(element.startDate)));
    }
  }

  const currentMonth = getMonth(date);
  const currentYear = getYear(date);
  for (let i = 1; i <= daysInMonth; i++) {
    const DMY = currentYear + "-" + (currentMonth + 1) + "-" + i;
    if (isInArray(arrayPlanDates, DMY)) {
      days.push(
        <td key={i - 1} className={styles.shading}>
          {i}
        </td>
      );
    }
    if (isInArray(arrayPlanDates, DMY) == false) {
      days.push(
        <td key={i - 1} className={styles.day}>
          {i}
        </td>
      );
    }
  }
  const rows = [];

  for (let i = 0; i < days.length / 7; i++) {
    rows.push(<tr key={i}>{days.slice(i * 7, (i + 1) * 7)}</tr>);
  }
  return rows;
};
