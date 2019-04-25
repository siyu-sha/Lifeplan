import { createMuiTheme } from "@material-ui/core/styles";

export const CustomTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#173e6c"
    },
    secondary: {
      main: "#97c7ef",
      contrastText: "#173e6c"
    }
  },
  typography: {
    fontFamily: ["Montserrat", "Sans-serif"].join(",")
  },
  overrides: {
    MuiButton: {
      root: {
        margin: 8,
        borderRadius: 25,
        fontWeight: 550
      }
    }
  }
});
