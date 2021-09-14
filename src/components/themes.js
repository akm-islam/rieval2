import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const outerTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#0069d9"
    },
    secondary: {
      main: "#0069d9"
    }
  }
})



export var year1_drop_down = createMuiTheme({
  overrides: { // This is the place we override classes applied to a component
    MuiAutocomplete:{
        root:{
            
        }
    },
    MuiFilledInput: { // This is the name of the component
      root: { // This is the class we want to edit
        backgroundColor: "none",
        
      }
    },
    MuiInputLabel: {
      root: {

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
    MuiPaper: {
      elevation: 12
    },
    MuiCard: {
      elevation: 2
    },
  }
});

export default outerTheme




/*
const theme = createMuiTheme({
  overrides: {
    MuiOutlinedInput: {
      root: {
        "& $notchedOutline": {
          borderColor: "green"
        },
        "&:hover $notchedOutline": {
          borderColor: "red"
        },
        "&$focused $notchedOutline": {
          borderColor: "purple"
        },
        "&&& $input": {
          padding: "1px"
        }
      }
    }
  }
});
*/