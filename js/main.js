// Exploratory view
d3.csv('data/exploratory_data.csv').then((exploratory_data) => {
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

  console.log(exploratory_data);
});

// What are people trying to remove view
d3.csv('data/wash_to_remove_data.csv').then((remove_data) => {
  console.log(remove_data);
});

// Reasons view
d3.csv('data/reasons_for_washing_data.csv').then((reasons_washing_data) => {
  d3.csv('data/reasons_for_not_washing_data.csv').then((reasons_not_washing_data) => {
    console.log(reasons_washing_data);
    console.log(reasons_not_washing_data);
  });
});