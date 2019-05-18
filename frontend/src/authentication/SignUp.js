import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { Grid } from "@material-ui/core";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  submitBtn: {
    marginLeft: "7%",
    marginRight: "7%",
    width: "36%",
    marginTop: theme.spacing.unit * 3
  }
});

function SignUp(props) {
  const { classes } = props;
  const email = "email";
  const pwd = "password";
  const marginSize = "normal";
  const firstName = "firstName";
  const lastName = "lastName";

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component={"h1"} variant={"h5"}>
          Sign Up
        </Typography>
        <form className={classes.form}>
          <FormControl margin={marginSize} required fullWidth>
            <InputLabel htmlFor={firstName}>First Name</InputLabel>
            <Input id={firstName} name={firstName} autoFocus />
          </FormControl>
          <FormControl margin={marginSize} required fullWidth>
            <InputLabel htmlFor={lastName}>Last Name</InputLabel>
            <Input id={lastName} name={lastName} />
          </FormControl>
          <FormControl margin={marginSize} required fullWidth>
            <InputLabel htmlFor={email}>Email Address</InputLabel>
            <Input id={email} name={email} autoComplete={email} />
          </FormControl>
          <FormControl margin={marginSize} required fullWidth>
            <InputLabel htmlFor={pwd} required fullWidth>
              Password
            </InputLabel>
            <Input
              name={pwd}
              type={pwd}
              id={pwd}
              autoComplete="current-password"
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="accept" color="primary" />}
            label="Click to accept our Terms & Conditions"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submitBtn}
          >
            Sign Up
          </Button>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            className={classes.submitBtn}
            onClick={() => (window.location.href = "/authentication/signin")}
          >
            Cancel
          </Button>
        </form>
      </Paper>
    </main>
  );
}

export default withStyles(styles)(SignUp);
