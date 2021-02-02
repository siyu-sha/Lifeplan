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

class ForgotPassword extends React.Component {
  state = {
    email: "",
    submitted: false,
    resetSuccess: false,
    resetFailure: false,
    alertVariant: "",
    displayMessage: "",
  };

  handleInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    this.setState({
      submitted: true,
      forgotFailure: false,
      forgotSuccess: false,
    });

    event.preventDefault();

    const { email } = this.state;

    const resetInfo = {
      email,
    };

    Api.Auth.forgotPassword(resetInfo)
      .then((response) => {
        // console.log(response);
        this.setState({
          forgotSuccess: true,
          displayMessage: "Success, Please check your Inbox!",
          alertVariant: "success",
        });
      })
      .catch((err) => {
        this.setState({
          forgotFailure: true,
          displayMessage: "Incorrect email, Please provide valid one!",
          alertVariant: "error",
        });
      });
  };

  render() {
    const { classes } = this.props;
    const email = "email";
    const margin_size = "normal";

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component={"h1"} variant={"h5"}>
            Forgot Password
          </Typography>
          {this.state.forgotSuccess && (
            <AlertMessage
              messages={this.state.displayMessage}
              variant={this.state.alertVariant}
            />
          )}
          {this.state.forgotFailure && (
            <AlertMessage
              messages={this.state.displayMessage}
              variant={this.state.alertVariant}
            />
          )}
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin={margin_size} required fullWidth>
              <InputLabel htmlFor={email}>Email</InputLabel>
              <Input
                id={email}
                name={email}
                autoComplete={email}
                autoFocus
                onChange={(e) => this.handleInput(e)}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submitBtn}
            >
              Request Password Reset
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
)(withStyles(styles)(ForgotPassword));
