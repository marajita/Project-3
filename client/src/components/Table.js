import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  numberField: {
    width: 50
  },
  tableCell: {
    padding: "0 10px"
  }
});

function SimpleTable(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table style={{ width: "auto", tableLayout: "auto" }}>
        <TableBody>
          {props.rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell style={{ padding: 10 }}>
                <TextField
                  id="standard-name"
                  value={props.newValue[index].value}
                  onChange={props.changeHandler}
                  label="Exercise"
                  className={classes.textField}
                  margin="normal"
                />
              </TableCell>
              <TableCell style={{ padding: 10 }} align="right">
                <TextField
                  id="standard-number"
                  label={props.headings[1]}
                  type="number"
                  className={classes.numberField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                />
              </TableCell>
              <TableCell style={{ padding: 10 }} align="right">
                <TextField
                  id="standard-number"
                  label={props.headings[2]}
                  type="number"
                  className={classes.numberField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                />
              </TableCell>
              {props.headings.length > 3 ? (
                <TableCell style={{ padding: 10 }} align="right">
                  <TextField
                    id="standard-number"
                    label="Weight"
                    type="number"
                    className={classes.numberField}
                    InputLabelProps={{
                      shrink: true
                    }}
                    margin="normal"
                  />
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTable);