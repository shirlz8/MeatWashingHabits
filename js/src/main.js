let meatTypeFilter = '';

let svgs = {
  Poultry:
    'M131.89,107.16c-.72-21.62-15-45.92-34.35-55.94a14.23,14.23,0,0,0,2.68-3.31c2.69-5.14,19.71-15.26-4.29-11.75a13.54,13.54,0,0,0-5.38,0C85.66,34.91,84.12,22,78.75,22S74.05,32.9,68,36.16c-31-9.81-11.83,9.18-10.75,11.75a14.29,14.29,0,0,0,2.69,3.31C39.51,61.5,25,86.84,25,108.87c0,2.21.54,6.25.54,6.61.53,4,3.22,9.92,3.76,11.39,5.37,10.28,34.93,19.46,51.33,19.83,13,2.44,41.09-9.92,47-19.47.18-.36.38-.82.61-1.35L150,122.33S147.83,122.67,131.89,107.16Z',
  Pork:
    'M85.71,25h2.86c4.12,1.48,8.57,2.42,12.26,4.57,4.42,2.56,7.77,3,12.65.36,9.51-5.19,20.11-4.84,30.65-3.36,3.45.49,5.78,1.74,5.87,5.57V40a16,16,0,0,0-.46,2c-.84,10.36-3.7,20-9.5,28.79a4.32,4.32,0,0,0-.16,3.18,59.94,59.94,0,0,1-1.29,39.52c-5.65,14.82-14.62,26.7-29.89,32.52-5,1.91-10.54,2.66-15.83,3.94H80.73a24.94,24.94,0,0,1-3.09-.65c-6.08-2-12.65-3.13-18-6.24C38.29,130.74,27.21,103,33.49,78.65c1.31-5.08,1.86-9.45-1.73-13.74a11.12,11.12,0,0,1-2-4.52C28.11,53.14,26.56,45.85,25,38.57v-5c1.11-2.1-.42-5.61,3.29-6.32,12.92-2.46,25.54-2.46,37.32,4.59a3.53,3.53,0,0,0,2.77.32C74.19,29.86,79.94,27.41,85.71,25Z',
  Fish:
    'M144.71,54.17c-4,8.95-9.26,15.89-13.55,25.2C128,72.89,90.45-12.74,40.42,48.71c-5.32,8.8-10.29,18-15.42,27v2c4.16,4.08,8.39,8.16,12.44,12.52,1.61,1.74,2.82,4.26,4.22,6.41-1.79,1.38-3.48,3.29-5.4,4.08-8.47,3.51-8.55,3.46-3.35,13.56,12.44,59.85,102.2,43,98.12-17.46,3.28,11.4,9.56,15.42,13.67,24.06,2.11,4.42,2.67,4.47,5.3.68V53.3C148,50.15,146.36,50.42,144.71,54.17Z',
  Ground_Meat:
    'M83.41,32c-31.17,1.81-57,27.71-58.63,58.93-1.85,34.66,26.58,66,62.41,66,34.15,0,62.51-28.41,62.5-62.5C149.68,58.41,118.16,29.92,83.41,32Z',
  Sheep_Goat:
    'M147.19,66.44c-2.14-10.52-14.25-19.25-22.46-24.07,0-.26,0-.52,0-.78a18.37,18.37,0,0,0-7.82-15.33,19.49,19.49,0,0,0,.33-3.59c0-9.77-7-17.71-15.65-17.71a14.15,14.15,0,0,0-7.23,2,14.5,14.5,0,0,0-24-.21,13.71,13.71,0,0,0-3.61-.48c-8.62,0-15.64,8-15.64,17.72v.33c-6.92,1.83-12.09,8.87-12.09,17.26A19.64,19.64,0,0,0,39.57,46c-7.24,5-15,12.16-16.71,20.4a16.67,16.67,0,0,0,3.59,14c2.59,3.26,5.42,4.92,8.41,4.92,3.6,0,6.79-2.51,9.58-6.35-1.67,29.3,14.9,46.29,38.74,46.45,26.56.19,45.42-16.89,39.05-52.07,3.47,6.82,7.8,12,13,12,3,0,5.82-1.66,8.41-4.92A16.67,16.67,0,0,0,147.19,66.44Z',
  Beef:
    'M144.48,69.78c-.39-.59-7.85-12.66-25.6-12.66a26.3,26.3,0,0,0-5.67.58l-.2-.39-.39-.59a28.49,28.49,0,0,0,6.65-18.31V28.67a6.36,6.36,0,0,0-.79-3.31,6.47,6.47,0,0,0-8.78-2.54h0a6.29,6.29,0,0,0-3.12,3.9l-1,3.69a24.56,24.56,0,0,1-6.26,10.7l-1.95,2a35,35,0,0,0-30.5,0l-2-1.93a24.72,24.72,0,0,1-6.26-10.7l-1-3.71A6.33,6.33,0,0,0,53,22.05a6.79,6.79,0,0,0-5.47,1.16A7.17,7.17,0,0,0,45,28.48v9.93a28.49,28.49,0,0,0,6.65,18.31l-.2.4-.2.38a28.34,28.34,0,0,0-5.67-.58C27.78,56.92,20.34,69,20,69.59a1.72,1.72,0,0,0,0,1.94c.38.59,7.85,12.67,25.6,12.67.78,0,1.76-.2,2.55-.2l1.52,21.37c-7.5,3-18.67,14.45-13.82,30.28,5.25,11.64,20.1,11.07,28.71,11.09h7.86a15.12,15.12,0,0,0,9.78-3.51,16.22,16.22,0,0,0,9.77,3.51h7.86c4.57,0,10.2,1.13,20.06-2.5,13-7.14,15.48-30.21-3.77-38.87l.3-21.17a10.88,10.88,0,0,0,2.55.19c17.78,0,25.21-12.08,25.6-12.66A3.17,3.17,0,0,0,144.48,69.78Z',
};

// Exploratory view
d3.csv('data/exploratory_data.csv').then((exploratoryData) => {
  // Initialize the charts
  const householdSizeBarChart = new HouseholdSizeBarChart(
    {
      parentElement: '#householdSizeBarChart',
    },
    exploratoryData
  );

  const foodSafetyBarChart = new FoodSafetyBarChart(
    {
      parentElement: '#householdSizeBarChart',
    },
    exploratoryData
  );

  // console.log(exploratoryData);

  var subgroups = exploratoryData.columns.slice(1);
  // console.log(subgroups);

  exploratoryData = exploratoryData.filter((d) => d.Houshold_size === '6');

  console.log(exploratoryData);

  const liquidBeefChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    exploratoryData,
    'Beef',
    svgs['Beef']
  );

  const liquidPorkChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    exploratoryData,
    'Pork',
    svgs['Pork']
  );

  const liquidPoultryChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    exploratoryData,
    'Poultry',
    svgs['Poultry']
  );

  const liquidSheepGoatChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    exploratoryData,
    'Sheep_Goat',
    svgs['Sheep_Goat']
  );

  // const liquidGroundMeatChart = new LiquidFillGauge(
  //   {
  //     parentElement: '#liquidFillGauges',
  //   },
  //   exploratoryData,
  //   'Ground_Meat',
  //   svgs['Ground_Meat']
  // );

  const liquidGroundMeatChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    exploratoryData,
    'Wash_Any',
    svgs['Ground_Meat']
  );

  const liquidFishChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    exploratoryData,
    'Fish',
    svgs['Fish']
  );
});

// What are people trying to remove view
d3.csv('data/wash_to_remove_data.csv').then((removeData) => {
  // console.log(removeData);
});

// Reasons view
d3.csv('data/reasons_for_washing_data.csv').then((reasonsWashingData) => {
  d3.csv('data/reasons_for_not_washing_data.csv').then(
    (reasonsNotWashingData) => {
      // console.log(reasonsWashingData);
      // console.log(reasonsNotWashingData);
    }
  );
});
