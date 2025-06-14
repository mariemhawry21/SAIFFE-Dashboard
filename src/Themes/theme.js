import { createTheme } from "@mui/material/styles";

const colors = {
  primary: "#232F66", // dark blue
  hover: "#eee", //light gray
  secondary: "#DEA94D", // gold
  error: "#d32f2f",
  warning: "#ffa000",
  info: "#0288d1",
  success: "#388e3c",
  background: "#f5f5f5",
  text: {
    primary: "#212121",
    secondary: "#757575",
  },
  custom: {
    teal: "#008080",
    coral: "#FF6B6B",
  },
};

export const theme = createTheme({
  cssVarPrefix: "mycolors",
  palette: {
    primary: {
      main: colors.primary,
      hover: colors.hover,
    },
    secondary: {
      main: colors.secondary,
    },
    error: {
      main: colors.error,
    },
    customColors: colors.custom,
  },
});
