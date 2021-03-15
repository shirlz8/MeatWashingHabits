// Exploratory view
d3.csv('data/exploratory_data.csv').then((exploratoryData) => {
  // data.forEach((d) => {
  //   d.cost = +d.cost;
  //   d.year = +d.year;
  //   d.date = parseTime(d.mid);
  //   // Optional: other data preprocessing steps
  // });
  // const timeline = new Timeline(
  //   {
  //     parentElement: '#vis',
  //     // Optional: other configurations
  //   },
  //   data
  // );

  console.log(exploratoryData);
});

// What are people trying to remove view
d3.csv('data/wash_to_remove_data.csv').then((removeData) => {
  console.log(removeData);
});

// Reasons view
d3.csv('data/reasons_for_washing_data.csv').then((reasonsWashingData) => {
  d3.csv('data/reasons_for_not_washing_data.csv').then(
    (reasonsNotWashingData) => {
      console.log(reasonsWashingData);
      console.log(reasonsNotWashingData);
    }
  );
});
