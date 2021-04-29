import React, { useCallback, useState, useEffect, useRef } from "react";
import PlanItemCalendarDialog from "./hcp_PlanItemCalendarDialog";
import {
  Button,
  Grid,
  DialogContent,
  DialogActions,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import CustomTimePicker from "./CustomTimePicker";
import { addHours, endOfDay, getHours, getMinutes, startOfDay } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// import { makeStyles } from "@material-ui/core/styles";
import { PLAN_ITEM_GROUP_EDIT_ALL } from "./SupportItemDialog";
import { planItemGroupToEvents } from "./hcp_BudgetDashboard";
import PlanItemDeleteDialog from "./PlanItemDeleteDialog";

// const useStyles = makeStyles((theme) => ({
//   buttonContainer: {
//     bottom: 0,
//   },
//   root: {
//     height: "100%",
//   },
// }));

const DELETE_ALL = true;

export default function PlanItemGroupCalendarView(props) {
  const { hcpPlanItem, onSave } = props;
  const [editedHcpPlanItem, setEditedHcpPlanItem] = useState({
    ...hcpPlanItem,
    startDate: new Date(hcpPlanItem.startDate),
    endDate: new Date(hcpPlanItem.endDate),
  });
  const dateRef = useRef({
    startDate: new Date(editedHcpPlanItem.startDate),
    endDate: new Date(editedHcpPlanItem.endDate),
  });

  const {
    hcpPlanItemGroup,
    onDeletePlanItem,
    onDeletePlanItemGroup,
    onEditPlanItem,
  } = props;
  const events = planItemGroupToEvents(hcpPlanItemGroup);
  const [openPlanItemDialog, setOpenPlanItemDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteMode, setDeleteMode] = useState(-1);
  const [selectedPlanItem, setSelectedPlanItem] = useState(null);
  // const classes = useStyles();

  function handleSelectEvent(info) {
    setSelectedPlanItem(info.event.extendedProps.hcpPlanItem);
    setOpenPlanItemDialog(true);
  }

  const handleDelete = useCallback(() => {
    if (deleteMode !== DELETE_ALL && hcpPlanItemGroup.hcpPlanItems.length > 1) {
      onDeletePlanItem(selectedPlanItem);
    } else {
      onDeletePlanItemGroup(hcpPlanItemGroup);
    }
    handleCloseDialog();
  }, [
    deleteMode,
    hcpPlanItemGroup,
    selectedPlanItem,
    onDeletePlanItem,
    onDeletePlanItemGroup,
  ]);

  // const handleEditAll = useCallback(() => {
  //   onEditPlanItem({
  //     editAll: PLAN_ITEM_GROUP_EDIT_ALL,
  //     hcpPlanItem: hcpPlanItemGroup.hcpPlanItems[0],
  //   });
  // }, [hcpPlanItemGroup, onEditPlanItem]);

  const handleEdit = useCallback(() => {
    onEditPlanItem({
      editAll: !PLAN_ITEM_GROUP_EDIT_ALL,
      hcpPlanItem: selectedPlanItem,
    });
  }, [selectedPlanItem, onEditPlanItem]);

  function handleCloseDialog() {
    setSelectedPlanItem(null);
    setDeleteMode(-1);
    setOpenPlanItemDialog(false);
    setOpenDeleteDialog(false);
  }

  function handleDeletePlanItem(hcpPlanItem) {
    setDeleteMode(!DELETE_ALL);
    setOpenDeleteDialog(true);
  }

  function handleDeletePlanItemGroup() {
    setDeleteMode(DELETE_ALL);
    setOpenDeleteDialog(true);
  }

  function handleChange(event) {
    setEditedHcpPlanItem({
      ...editedHcpPlanItem,
      [event.target.name]: event.target.value,
    });
  }

  function handleSave() {
    onSave({
      ...editedHcpPlanItem,
      priceActual: parseFloat(editedHcpPlanItem.priceActual),
    });
    props.back();
  }

  useEffect(() => {
    if (editedHcpPlanItem.startDate > editedHcpPlanItem.endDate) {
      if (dateRef.current.endDate !== editedHcpPlanItem.endDate) {
        const newStartDate =
          getHours(editedHcpPlanItem.endDate) === 0
            ? startOfDay(editedHcpPlanItem.startDate)
            : addHours(editedHcpPlanItem.endDate, -1);
        dateRef.current = {
          startDate: newStartDate,
          endDate: editedHcpPlanItem.endDate,
        };
        setEditedHcpPlanItem({ ...editedHcpPlanItem, startDate: newStartDate });
      } else {
        const newEndDate =
          getHours(editedHcpPlanItem.startDate) === 23
            ? endOfDay(editedHcpPlanItem.startDate)
            : addHours(editedHcpPlanItem.startDate, 1);
        dateRef.current = {
          startDate: editedHcpPlanItem.startDate,
          endDate: newEndDate,
        };

        setEditedHcpPlanItem({ ...editedHcpPlanItem, endDate: newEndDate });
      }
    } else {
      dateRef.current = {
        startDate: editedHcpPlanItem.startDate,
        endDate: editedHcpPlanItem.endDate,
      };
    }
  }, [editedHcpPlanItem]);

  function handleChangeStart(startDate) {
    setEditedHcpPlanItem({ ...editedHcpPlanItem, startDate });
  }

  function handleChangeEnd(endDate) {
    setEditedHcpPlanItem({ ...editedHcpPlanItem, endDate });
  }

  return (
    <>
      <DialogContent>
        <Grid container justify="flex-start" spacing={1}>
          <Grid item md={5}>
            <Grid item>
              <Typography>
                What would you like to call this support Item?
              </Typography>
              <TextField
                id="plan-item-name"
                label="Support Item Name"
                defaultValue={hcpPlanItemGroup.nickname}
                name={"nickname"}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            {editedHcpPlanItem.allDay !== true && (
              <Grid container item spacing={2}>
                <Grid item xs={12}>
                  <Typography>When do you use it?</Typography>
                </Grid>

                <Grid item>
                  <InputLabel>From</InputLabel>
                  <CustomTimePicker
                    value={editedHcpPlanItem.startDate}
                    onChange={handleChangeStart}
                    minHour={0}
                    minMinute={0}
                  />
                </Grid>
                <Grid item>
                  <InputLabel>To</InputLabel>
                  <CustomTimePicker
                    value={editedHcpPlanItem.endDate}
                    onChange={handleChangeEnd}
                    minHour={getHours(editedHcpPlanItem.startDate)}
                    minMinute={getMinutes(editedHcpPlanItem.startDate)}
                  />
                </Grid>
              </Grid>
            )}
            <Grid item>
              <Typography>How much does each time cost?</Typography>
              <InputLabel>Amount</InputLabel>
              <Input
                id="plan-item-unit-cost"
                value={editedHcpPlanItem.priceActual}
                name={"priceActual"}
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                type="number"
              />
            </Grid>
          </Grid>
          <Grid item md={7}>
            <Grid item>
              <FullCalendar
                defaultView="dayGridMonth"
                plugins={[dayGridPlugin]}
                fixedWeekCount={false}
                events={events}
                eventClick={handleSelectEvent}
                height="parent"
              />
            </Grid>
          </Grid>
        </Grid>
        <DialogActions justify="flex-end">
          <Button onClick={handleDeletePlanItemGroup}>Delete All</Button>
          {/* <Button onClick={handleEditAll}>Edit All</Button> */}
          <Button onClick={props.back}>Back</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </DialogContent>

      {openPlanItemDialog === true && selectedPlanItem != null && (
        <PlanItemCalendarDialog
          open={openPlanItemDialog && selectedPlanItem != null}
          hcpPlanItem={selectedPlanItem}
          onClose={handleCloseDialog}
          onDelete={handleDeletePlanItem}
          onEdit={handleEdit}
        />
      )}
      {openDeleteDialog === true && deleteMode !== -1 && (
        <PlanItemDeleteDialog
          open={openDeleteDialog === true && deleteMode !== -1}
          onClose={handleCloseDialog}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
