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
  registerStl: {
    marginTop: theme.spacing.unit * 3,
    display: "flex",
    flexDirection: "row-reverse"
  },
  registerBtn: {
    marginTop: 0
  },
  registerLabel: {
    marginTop: theme.spacing.unit
  },
  submitBtn: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing.unit * 3
  }
});

class SignIn extends React.Component {
  state = {
    emailAddress: "",
    password: "",
    rememberMe: false
  };

  render() {
    const { classes } = this.props;
    const email = "email";
    const pwd = "password";
    const margin_size = "normal";

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component={"h1"} variant={"h5"}>
            Sign in
          </Typography>
          <form className={classes.form}>
            <FormControl margin={margin_size} required fullWidth>
              <InputLabel htmlFor={email}>Email Address</InputLabel>
              <Input id={email} name={email} autoComplete={email} autoFocus />
            </FormControl>
            <FormControl margin={margin_size} required fullWidth>
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
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submitBtn}
            >
              Sign in
            </Button>
          </form>
        </Paper>
        <Grid className={classes.registerStl}>
          <Button
            type="button"
            color="secondary"
            className={classes.registerBtn}
            onClick={() => (window.location.href = "/authentication/signup")}
          >
            SignUp
          </Button>
          <Typography component={"subtitle1"} className={classes.registerLabel}>
            Don't have an account?
          </Typography>
        </Grid>
      </main>
    );
  }
}

export default withStyles(styles)(SignIn);
