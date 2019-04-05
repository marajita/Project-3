import React from "react";
import PropTypes from "prop-types";
import deburr from "lodash/deburr";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

var userInput = "";
var suggestions = [];

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        <span style={{ fontWeight: 100, fontStyle: "bold" }}>
          <img height="35" width="40" src={suggestion.img} />
          {suggestion.label}
        </span>
      </div>
    </MenuItem>
  );
}

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 20
  },
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  }
});

class IntegrationAutosuggest extends React.Component {
  state = {
    single: "",
    popper: "",
    suggestions: []
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = name => (event, { newValue }) => {
    userInput = newValue;
    if (userInput !== undefined) {
      this.getSuggestionsFromAPI();
    }
    this.setState({
      [name]: newValue
    });
  };

  getSuggestionsFromAPI = async event => {
    const APP_ID = "eb95abc3";
    const APP_KEY = "368d7805ed86900874f9dc4fb92aba0f";

    let foodSearchQuery = userInput;
    console.log(foodSearchQuery);
    const response = await fetch(
      "https://trackapi.nutritionix.com/v2/search/instant/test",
      {
        method: "post",
        headers: {
          "x-app-key": APP_KEY,
          "x-app-id": APP_ID,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: foodSearchQuery
        })
      }
    );
    if (response.status !== 200) {
      console.log("Error: " + response);
    }
    const data = await response.json();
    console.log(data.branded);
    const results = data.branded;
    let foodItemArr = [];
    if (results !== undefined) {
      results.forEach(element => {
        let food = {};
        food["label"] = element.food_name;
        food["img"] = element.photo.thumb;
        foodItemArr.push(food);
      });
    }
    this.setState({
      suggestions: foodItemArr
    });
    //console.log("new state" + JSON.stringify(suggestions));
  };

  render() {
    const { classes } = this.props;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion
    };

    return (
      <div style={{ width: "20vw" }} className={classes.root}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            id: "foodSearchInput",
            placeholder: "Enter your meal here",

            value: this.state.single,
            onChange: this.handleChange("single")
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />
        <div className={classes.divider} />
      </div>
    );
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(IntegrationAutosuggest);
