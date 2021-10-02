import { makeStyles } from "@material-ui/core";
import { colors, EFontWeight } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: 24,
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
  },
  rightSection: {
    display: "flex",
    marginLeft: "auto",
  },
  label: {
    fontWeight: EFontWeight.BOLD,
  },
  description: {
    marginTop: 16,
  },
  navigationWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
    cursor: "pointer",
  },
  navigationIcon: {
    color: colors.GRAY400,
    marginRight: 8,
  },
  navigationLabel: {
    fontWeight: EFontWeight.MEDIUM,
  },
  buttonWrapper: {
    marginLeft: 16,
  },
}));
