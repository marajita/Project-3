import React, { Component } from "react";
import NutritionTracker from "./NutritionTracker";
import NutritionReports from "./NutritionReports";
import moment from "moment";
import API from "../../utils/API";
import auth from "../../firebase.js";
import Meal from "../../pages/Meal";

// Material UI imports
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";


const styles = theme => ({
  demo: {
    [theme.breakpoints.up("lg")]: {
      width: 1170
    }
  },
  margin: {
    margin: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: `${theme.spacing.unit * 3}px`
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: theme.spacing.unit,
    height: 400,
    display: "flex",
    flexDirection: "column"

  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`
  },
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  table: {
    minWidth: 200,
    marginTop: 8
  },
  cell: {
    padding: 10
  }
});

class NutritionPanel extends Component {
  state = {
    data: {
      labels: [],
      datasets: [
        {
          label: "Nutrition",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: []
        }
      ]
    },
    value: 0,
    mealName: "",
    mealsToAdd: [
      {
        name: "lunch",
        food: [
          {
            name: "Cheeseburger",
            calories: 200,
            fat: 50,
            carbs: 40,
            protein: 30
          },
          {
            name: "Fries",
            calories: 320,
            fat: 50,
            carbs: 60,
            protein: 10
          }
        ]
      },
      {
        name: "second lunch",
        food: [
          {
            name: "Bacon cheeseburger",
            calories: 400,
            fat: 65,
            carbs: 51,
            protein: 38
          }
        ]
      }
    ],
    nutritionDate: moment().format("YYYY-MM-DD")
  };

  componentDidMount = () => {
    this.selectMealsByDate(this.state.nutritionDate);
  };

  dayTotalsSum = (yAxis, mealData) => {
    let newSum = 0;
    switch (yAxis) {
      case "fat":
        yAxis = "fats";
        break;
      case "carbs":
        yAxis = "carbohydrates";
        break;
    }

    for (let j = 0; j < mealData.meal.length; j++) {
      for (let k = 0; k < mealData.meal[j].foodItem.length; k++) {
        newSum += mealData.meal[j].foodItem[k][yAxis];
      }
    }

    return newSum;
  };

  getNutritionByTimeframe = () => {
    API.getMealsByDate(moment().week(), localStorage.userId).then(res => {
      console.log(res);
      let newChartData = Object.assign({}, this.state.data);
      if (this.state.xAxis === "thisWeek") {
        const dateArray = [
          moment()
            .day("Sunday")
            .format("MM-DD-YYYY"),
          moment()
            .day("Monday")
            .format("MM-DD-YYYY"),
          moment()
            .day("Tuesday")
            .format("MM-DD-YYYY"),
          moment()
            .day("Wednesday")
            .format("MM-DD-YYYY"),
          moment()
            .day("Thursday")
            .format("MM-DD-YYYY"),
          moment()
            .day("Friday")
            .format("MM-DD-YYYY"),
          moment()
            .day("Saturday")
            .format("MM-DD-YYYY")
        ];

        newChartData.labels = [
          ["Sunday", dateArray[0]],
          ["Monday", dateArray[1]],
          ["Tuesday", dateArray[2]],
          ["Wednesday", dateArray[3]],
          ["Thursday", dateArray[4]],
          ["Friday", dateArray[5]],
          ["Saturday", dateArray[6]]
        ];

        let newData = [null, null, null, null, null, null, null];
        for (let i = 0; i < res.data.length; i++) {
          let newSum = this.dayTotalsSum(this.state.yAxis, res.data[i]);
          const dateToFind = moment(res.data[i].date).format("MM-DD-YYYY");
          const id = dateArray.indexOf(dateToFind);
          newData[id] = newSum;
        }

        newChartData.datasets = [
          {
            label: this.state.yAxis,
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: newData
          }
        ];

        this.setState({ data: newChartData });
      } else if (this.state.xAxis === "today") {
        API.getMealsByDate(
          moment().format("YYYY-MM-DD"),
          localStorage.userId
        ).then(res => {
          let dailyData = [0, 0, 0, 0];
          res.data[0].meal.forEach(meal => {
            meal.foodItem.forEach(foodItem => {
              dailyData[0] += foodItem.calories;
              dailyData[1] += foodItem.fats;
              dailyData[2] += foodItem.carbohydrates;
              dailyData[3] += foodItem.protein;
            });
          });

          newChartData.labels = ["Daily Tracking"];

          newChartData.datasets = [
            {
              label: "Calories",
              backgroundColor: "yellow",
              borderColor: "rgba(255,99,132,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(255,99,132,0.4)",
              hoverBorderColor: "rgba(255,99,132,1)",
              data: [dailyData[0]]
            },
            {
              label: "Calories",
              backgroundColor: "red",
              borderColor: "rgba(255,99,132,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(255,99,132,0.4)",
              hoverBorderColor: "rgba(255,99,132,1)",
              data: [dailyData[1]]
            },
            {
              label: "Calories",
              backgroundColor: "green",
              borderColor: "rgba(255,99,132,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(255,99,132,0.4)",
              hoverBorderColor: "rgba(255,99,132,1)",
              data: [dailyData[2]]
            },
            {
              label: "Calories",
              backgroundColor: "blue",
              borderColor: "rgba(255,99,132,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(255,99,132,0.4)",
              hoverBorderColor: "rgba(255,99,132,1)",
              data: [dailyData[3]]
            }
          ];

          this.setState({ data: newChartData });
        });
      }
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleInputChange = name => event => {
    this.setState({ [name]: event.target.value }, () => {
      if (this.state.xAxis) {
        this.getNutritionByTimeframe();
      }
    });
  };

  addMeal = () => {
    let mealArray = [...this.state.mealsToAdd];
    mealArray.push({ name: this.state.mealName, foodItem: [] });
    this.setState({ mealsToAdd: mealArray, mealName: "" });
  };

  selectMealsByDate = date => {
    this.setState({ nutritionDate: date, value: 0 }, () => {
      API.getMealsByDate(this.state.nutritionDate, localStorage.userId).then(
        res => {
          console.log(res);
          if (res.data.length) {
            const newMealsArr = [...res.data[0].meal];
            console.log(newMealsArr);

            this.setState({
              mealsToAdd: newMealsArr
            });
          } else {
            this.setState({
              mealsToAdd: [],
              mealName: ""
            });
          }
        }
      );
    });
  };

  selectDate = event => {
    const newDate = event.target.value;
    this.selectMealsByDate(newDate);
  };

  addFoodItem = food => {
    console.log(food.foodItem);
    const foodArr = [...this.state.mealsToAdd];
    foodArr[this.state.value].foodItem.push({
      name: food.foodItem[0].name,
      fats: food.foodItem[0].fats,
      carbohydrates: food.foodItem[0].carbohydrates,
      protein: food.foodItem[0].protein,
      calories: food.foodItem[0].calories
    });
    // console.log(this.state.value)
    // debugger;
    this.setState({ mealsToAdd: foodArr });
  };

  saveNutritionDay = () => {
    let data = {
      Nutrition: {
        date: this.state.nutritionDate,
        week: moment(this.state.nutritionDate, "YYYY-MM-DD").week(),
        user: localStorage.userId,
        meal: this.state.mealsToAdd
      }
    };
    API.saveMeal(data.Nutrition).then(res => {
      console.log(res);
      this.getNutritionByTimeframe();
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={8} className={classes.demo}>
        <Typography
          style={{ width: "100%", marginTop: 20 }}
          variant="h5"
          gutterBottom
        >
          Nutrition
        </Typography>
        <Grid item sm={12} md={6}>
          <NutritionTracker
            classes={classes}
            value={this.state.value}
            handleChange={this.handleChange}
            mealsToAdd={this.state.mealsToAdd}
            handleInputChange={this.handleInputChange}
            mealName={this.state.mealName}
            addMeal={this.addMeal}
            selectDate={this.selectDate}
            nutritionDate={this.state.nutritionDate}
            addFoodItem={this.addFoodItem}
            saveNutritionDay={this.saveNutritionDay}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <NutritionReports
            paper={classes.paper}
            handleInputChange={this.handleInputChange}
            chartType={this.state.chartType}
            data={this.state.data}
            changeChartData={this.changeChartData}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(NutritionPanel);
