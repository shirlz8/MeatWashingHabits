// Exploratory view
d3.csv('data/exploratory_data.csv').then((exploratoryData) => {
  // Initialize the charts
  const householdSizeBarChart = new HouseholdSizeBarChart({
    parentElement: '#householdSizeBarChart',
  }, exploratoryData);

  const foodSafetyBarChart = new FoodSafetyBarChart({
    parentElement: '#householdSizeBarChart',
  }, exploratoryData);

  console.log(exploratoryData);
});

// What are people trying to remove view
d3.csv('data/wash_to_remove_data.csv').then((removeData) => {
  console.log(removeData);
});

// Reasons view
d3.csv('data/reasons_for_washing_data.csv').then((reasonsWashingData) => {
  d3.csv('data/reasons_for_not_washing_data.csv').then((reasonsNotWashingData) => {
    console.log(reasonsWashingData);
    console.log(reasonsNotWashingData);
  });
});
