import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Api from "../api";
import AlertMessage from "../common/AlertMessage";
import { loadUser } from "../redux/reducers/auth";
import connect from "react-redux/es/connect/connect";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  loadUser: (user) => {
    dispatch(loadUser(user));
  },
});

const styles = (theme) => ({
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
  paper: {
    marginTop: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  registerStl: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "row-reverse",
  },
  registerBtn: {
    marginTop: 0,
  },
  registerLabel: {
    marginTop: theme.spacing(1),
  },
  submitBtn: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(1),
  },
});

class ResetPassword extends React.Component {
  state = {
    email: "",
    submitted: false,
    resetSuccess: false,
    resetFailure: false,
    alertVariant: "",
    displayMessage: "",
    token: "",
    password: "",
  };

  handleInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  validate() {
    let password = this.state.password;
    let confirm_password = this.state.confirm_password;
    let perrors = null;
    let cperrors = null;
    let isValid = true;

    this.setState({
      cerrors: perrors,
      cperrors: cperrors,
    });

    if (!password) {
      isValid = false;
      perrors = "Please enter your password.";
    } else if (password.length < 6) {
      isValid = false;
      perrors = "Your Password must be at-least 6 characters.";
    } else if (!confirm_password) {
      isValid = false;
      cperrors = "Please enter your confirm password.";
    } else if (
      typeof password !== undefined &&
      typeof confirm_password !== undefined
    ) {
      if (password !== confirm_password) {
        isValid = false;
        cperrors = "Passwords don't match.";
      }
    }

    this.setState({
      cerrors: perrors,
      cperrors: cperrors,
    });

    return isValid;
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.validate()) {
      this.setState({
        submitted: true,
        resetFailure: false,
        resetSuccess: false,
      });

      const { password } = this.state;

      const pathname = window.location.pathname;
      let split = pathname.split("/");

      console.log(split[2]);

      const token = split[2];

      const resetInfo = {
        token,
        password,
      };

      Api.Auth.resetPassword(resetInfo)
        .then((response) => {
          console.log(response);
          this.setState({
            resetSuccess: true,
            displayMessage: "Reset successful!",
            alertVariant: "success",
          });
          setTimeout(() => {
            this.props.history.replace("/signin");
          }, 1000);
        })
        .catch((err) => {
          this.setState({
            resetFailure: true,
            displayMessage: "Reset Failed. Try again!",
            alertVariant: "error",
          });
        });
    }
  };

  render() {
    const { classes } = this.props;
    const pwd = "password";
    const cpwd = "confirm_password";
    const marginSize = "normal";

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component={"h1"} variant={"h5"}>
            Reset Password
          </Typography>
          {this.state.resetSuccess && (
            <AlertMessage
              messages={this.state.displayMessage}
              variant={this.state.alertVariant}
            />
          )}
          {this.state.resetFailure && (
            <AlertMessage
              messages={this.state.displayMessage}
              variant={this.state.alertVariant}
            />
          )}
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin={marginSize} fullWidth>
              <InputLabel htmlFor={pwd} fullWidth>
                New Password
              </InputLabel>
              <Input
                name={pwd}
                type={pwd}
                id={pwd}
                autoComplete="new-password"
                onChange={(e) => this.handleInput(e)}
              />
              <div style={{ color: "#f44336" }}>{this.state.cerrors}</div>
            </FormControl>

            <FormControl margin={marginSize} fullWidth>
              <InputLabel htmlFor={cpwd} fullWidth>
                Confirm Password
              </InputLabel>
              <Input
                name={cpwd}
                type={pwd}
                id={cpwd}
                autoComplete="confirm_password"
                onChange={(e) => this.handleInput(e)}
              />
              <div style={{ color: "#f44336" }}>{this.state.cperrors}</div>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submitBtn}
            >
              Reset Passsword
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ResetPassword));
