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
import Api from "../api";
import { browserHistory } from "react-router";

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

class SignUp extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    postcode: "",
    birthYear: "",
    accept: false,
    submitted: false,
    submittedSuccess: true
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

    const { email, password, accept, firstName, lastName } = this.state;

    console.log("I was triggered" + email + password + accept + "test");

    const Reginfo = {
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      postcode: this.state.postcode,
      birthYear: this.state.birthYear
    };

    Api.Auth.register(Reginfo)
      .then(responese => {
        //console.log(responese.data);
        const token = responese.data.tokens;
        console.log(
          "the received token is: " +
            token.access +
            ", and refresh component is " +
            token.refresh
        );
        Api.setToken(token);
        this.props.history.push("/");
      })
      .catch(err => {
        console.log("this is the err " + err);
        this.setState({ submittedSuccess: false });
        //console.log("submittedSuccess is " + this.state.submittedSuccess);
        //console.log("error message " + err.response.data.mes);
      });

    // send email and password
  };

  render() {
    const { classes } = this.props;
    const { submitted } = this.state;
    const email = "email";
    const pwd = "password";
    const marginSize = "normal";
    const firstName = "firstName";
    const lastName = "lastName";
    const postCode = "postcode";
    const birthYear = "birthYear";
    const accept = "accept";

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

          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin={marginSize} required fullWidth>
              <InputLabel htmlFor={email}>Email Address</InputLabel>
              <Input
                id={email}
                name={email}
                autoComplete={email}
                autoFocus
                onChange={e => this.handleInput(e)}
              />
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
                onChange={e => this.handleInput(e)}
              />
            </FormControl>
            <FormControl margin={marginSize} required fullWidth>
              <InputLabel htmlFor={firstName}>First Name</InputLabel>
              <Input
                id={firstName}
                name={firstName}
                autoComplete="name"
                onChange={e => this.handleInput(e)}
              />
            </FormControl>
            <FormControl margin={marginSize} required fullWidth>
              <InputLabel htmlFor={lastName}>Last Name</InputLabel>
              <Input
                id={lastName}
                name={lastName}
                autoComplete="family-name"
                onChange={e => this.handleInput(e)}
              />
            </FormControl>
            <FormControl margin={marginSize} required fullWidth>
              <InputLabel htmlFor={postCode}>Postcode</InputLabel>
              <Input
                id={postCode}
                name={postCode}
                autoComplete="postal-code"
                onChange={e => this.handleInput(e)}
              />
            </FormControl>
            <FormControl margin={marginSize} required fullWidth>
              <InputLabel htmlFor={birthYear}>Year of Birth</InputLabel>
              <Input
                id={birthYear}
                name={birthYear}
                autoComplete="bday-year"
                onChange={e => this.handleInput(e)}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  value={this.state.accept}
                  name={accept}
                  color="primary"
                  onChange={e => this.handleInput(e)}
                />
              }
              label="Click to accept our Terms & Conditions"
            />
            {!this.state.submittedSuccess && (
              <Typography
                variant="button"
                display="block"
                gutterBottom
                align="center"
                color="error"
              >
                invalid email address
              </Typography>
            )}

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
}

export default withStyles(styles)(SignUp);
