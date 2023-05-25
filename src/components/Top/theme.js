import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const outerTheme1 = createMuiTheme({
  palette: {
    primary: {
      main: "#0069d9"
    },
    secondary: {
      main: "#0069d9"
    }
  }
})



const outerTheme = createMuiTheme({
  spacing: 2,
  overrides: { // This is the place we override classes applied to a component
    MuiFilledInput: { // This is the name of the component
      root: { // This is the class we want to edit
        backgroundColor: "none",
        padding:0,
      }
    },
    MuiInputLabel: {
      root: {
        backgroundColor: "yellow"
      }
    },
    MuiTextField: {
      root: {}
    },
    MuiButton: {
      root: {
        textTransform: "none",
        padding: "15px"
      },
      fullWidth: {
        maxWidth: "100%"
      }
    },
    MuiFilledInput:{
      root:{
        padding:0,
        backgroundColor:"yellow"
      }
    },
    MuiAutocomplete:{
      Root:{
        padding:0
      }
    }

  },
  props: { // This is the place where we define props
    MuiButton: {
      disableRipple: true,
      variant: "contained",
      color: "primary"
    },
    MuiCheckbox: {
      disableRipple: true
    },
    MuiTextField: {
      variant: "filled",
      InputLabelProps: {
        shrink: true
      }
    },
  }
});

export default outerTheme