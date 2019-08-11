import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import api from "../../api";

export default function SupportItemSelector({
  supportCategoryID,
  supportCategoryName,
  birthYear,
  postcode
}) {
  // React Hooks
  const [open, setOpen] = React.useState(true);
  const [supportItems, setSupportItems] = React.useState(
    api.SupportItems.get({
      birthYear: 1,
      postcode: 3000,
      supportCategoryID: 13
    }).then(response => response.data)
  );

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      {console.log(supportItems)}
      <Dialog fullScreen open={open} onClose={handleClose}>
        {/*<AppBar >*/}
        {/*  <Toolbar>*/}
        {/*    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">*/}
        {/*      <CloseIcon />*/}
        {/*    </IconButton>*/}
        {/*    <Typography variant="h6">*/}
        {/*      Sound*/}
        {/*    </Typography>*/}
        {/*    <Button color="inherit" onClick={handleClose}>*/}
        {/*      save*/}
        {/*    </Button>*/}
        {/*  </Toolbar>*/}
        {/*</AppBar>*/}
        <DialogTitle>Hi</DialogTitle>
        <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
