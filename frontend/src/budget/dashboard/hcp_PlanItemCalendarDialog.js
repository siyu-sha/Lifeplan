import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { format } from "date-fns";

export default function PlanItemCalendarDialog(props) {
  const { hcpPlanItem, onClose, open, onDelete, onEdit } = props;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{hcpPlanItem.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Date: {renderDateString(hcpPlanItem)}
          <br />
          Cost: $
          {hcpPlanItem.priceActual.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={() => onDelete(hcpPlanItem)}>Delete</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function renderDateString(hcpPlanItem) {
  const startDate = new Date(hcpPlanItem.startDate);
  const timeString =
    hcpPlanItem.allDay === true
      ? "All Day"
      : `${format(startDate, "p")}-${format(new Date(hcpPlanItem.endDate), "p")}`;
  const dateString = format(startDate, "PPPP");
  return `${timeString}, ${dateString}`;
}
