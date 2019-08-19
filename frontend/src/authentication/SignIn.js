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
import Api from "../api";

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
    email: "",
    password: "",
    remember: false,
    submitted: false,
    loggedIn: false,
    loggedInFailure: false
  };

  handleInput = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {
    this.setState({ submitted: true });

    event.preventDefault();

    const { email, password, remember } = this.state;

    console.log(
      "I was triggered" + email + password + remember + "handleSubmit"
    );

    const logInfo = {
      username: this.state.email,
      password: this.state.password
    };

    Api.Auth.login(logInfo)
      .then(responese => {
        console.log("the received responese is : ");
        console.log(responese.data.refresh);
        this.setState({
          loggedIn: true
        });
        const token = "token";
        localStorage.setItem(token, responese.data.refresh);
      })
      .catch(err => {
        console.log("this is the err " + err);
        this.setState({
          loggedInFailure: true
        });
      });

    // send email and password
  };

  render() {
    const { classes } = this.props;
    const email = "email";
    const pwd = "password";
    const margin_size = "normal";
    const remember = "remember";

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
          {this.state.loggedIn && (
            <Typography
              variant="button"
              display="block"
              gutterBottom
              align="center"
              color="error"
            >
              logged in successfully
            </Typography>
          )}
          {this.state.loggedInFailure && (
            <Typography
              variant="button"
              display="block"
              gutterBottom
              align="center"
              color="error"
            >
              Incorrect password or username
            </Typography>
          )}
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin={margin_size} required fullWidth>
              <InputLabel htmlFor={email}>Email Address</InputLabel>
              <Input
                id={email}
                name={email}
                autoComplete={email}
                autoFocus
                onChange={e => this.handleInput(e)}
              />
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
                onChange={e => this.handleInput(e)}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  value={this.state.remember}
                  color="primary"
                  name={remember}
                  onChange={e => this.handleInput(e)}
                />
              }
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
