//Load data from CSV file asynchronously and render chart
d3.csv('data/exploratory_data.csv').then((data) => {
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

  console.log(data);
});
