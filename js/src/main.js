// Variables to store selected filters
let meatTypeFilter = 'Wash_Any';
let householdSizeFilter = 0;
let foodSafetyImportanceFilter = 0;
let habitsBubbleRadioFilter = 'all';
let currentPage = '#intro';

// Initialize Dispatchers
const dispatcherHouseholdSize = d3.dispatch('filterHouseholdSize');
const dispatcherFoodSafetyImportance = d3.dispatch(
  'filterFoodSafetyImportance'
);
const dispatcherMeatType = d3.dispatch('filterMeatType');

let habitsBubblePlot;
let foodSafetyBarChart;
let householdSizeBarChart;
let liquidBeefChart;
let liquidPorkChart;
let liquidPoultryChart;
let liquidSheepGoatChart;
let liquidFishChart;
let liquidWashAnyChart;
let pieChart;
let teardropChart;
let reasonsNoWashBubblePlot;
let reasonsWashBubblePlot;
let mainData;

const svgs = {
  Poultry:
    'M133.15,107.61c-.72-21.62-15-45.92-34.35-55.94a14,14,0,0,0,2.68-3.31c2.69-5.14,15-15.83-9.67-11.75C86.92,35.36,85.38,22.45,80,22.45s-4.7,10.9-10.75,14.16c-31-9.81-11.83,9.18-10.75,11.75a14.56,14.56,0,0,0,2.69,3.31C40.77,62,26.26,87.29,26.26,109.32c0,2.21.54,6.25.54,6.61.53,4,3.22,9.92,3.76,11.39,5.37,10.28,34.93,19.46,51.33,19.83,13,2.44,41.09-9.92,47-19.47.18-.36.38-.82.61-1.35l21.76-3.55C159.49,120.75,152.77,119.07,133.15,107.61Z',
  Pork:
    'M85.71,25h2.86c4.12,1.48,8.57,2.42,12.26,4.57,4.42,2.56,7.77,3,12.65.36,9.51-5.19,20.11-4.84,30.65-3.36,3.45.49,5.78,1.74,5.87,5.57V40a16,16,0,0,0-.46,2c-.84,10.36-3.7,20-9.5,28.79a4.32,4.32,0,0,0-.16,3.18,59.94,59.94,0,0,1-1.29,39.52c-5.65,14.82-14.62,26.7-29.89,32.52-5,1.91-10.54,2.66-15.83,3.94H80.73a24.94,24.94,0,0,1-3.09-.65c-6.08-2-12.65-3.13-18-6.24C38.29,130.74,27.21,103,33.49,78.65c1.31-5.08,1.86-9.45-1.73-13.74a11.12,11.12,0,0,1-2-4.52C28.11,53.14,26.56,45.85,25,38.57v-5c1.11-2.1-.42-5.61,3.29-6.32,12.92-2.46,25.54-2.46,37.32,4.59a3.53,3.53,0,0,0,2.77.32C74.19,29.86,79.94,27.41,85.71,25Z',
  Fish:
    'M144.15,44.05c-4,9.61-8.74,12.11-13,22.11-3.16-7-42.63-97.62-106.68,3.17,4.16,4.38,8.39,8.76,12.44,13.45,1.61,1.86,2.82,4.57,4.22,6.88-1.79,1.48-3.48,3.53-5.4,4.38-8.47,3.77-8.55,3.72-3.35,14.57,14.09,48.91,87.58,56.81,101.48-9.59,5.29,11.14,6.62,8.69,10.31,16.67,2.11,4.75,2.67,4.8,5.3.73V43.11C147.44,39.73,145.8,40,144.15,44.05Z',
  Wash_Any:
    'M83.41,32c-31.17,1.81-57,27.71-58.63,58.93-1.85,34.66,26.58,66,62.41,66,34.15,0,62.51-28.41,62.5-62.5C149.68,58.41,118.16,29.92,83.41,32Z',
  Sheep_Goat:
    'M149.08,93.37c-2.14-10.69-14.25-19.58-22.46-24.48v-.8a18.83,18.83,0,0,0-7.82-15.6,20.23,20.23,0,0,0,.33-3.65c0-9.94-7-18-15.66-18a14,14,0,0,0-7.23,2,14.35,14.35,0,0,0-20.1-4.11,14.76,14.76,0,0,0-3.9,3.9,13.37,13.37,0,0,0-3.61-.49C60,32.16,53,40.29,53,50.19v.33c-6.92,1.86-12.09,9-12.09,17.56a20.17,20.17,0,0,0,.56,4.51c-7.25,5.08-15,12.36-16.73,20.74a17.19,17.19,0,0,0,3.59,14.24c2.59,3.31,5.43,5,8.42,5,3.4,0,8.85-5.83,11.53-9.37.15-.2.42-.07.44.18,2.93,29,14.58,47.74,38.2,47.9,26.57.19,37.72-8.94,40-47.28-1-2.07,5,8.6,10.25,8.6,3,0,5.82-1.68,8.41-5A17.16,17.16,0,0,0,149.08,93.37Z',
  Beef:
    'M144.48,69.78c-.39-.59-7.85-12.66-25.6-12.66a26.3,26.3,0,0,0-5.67.58l-.2-.39-.39-.59a28.49,28.49,0,0,0,6.65-18.31V28.67a6.36,6.36,0,0,0-.79-3.31,6.47,6.47,0,0,0-8.78-2.54h0a6.29,6.29,0,0,0-3.12,3.9l-1,3.69a24.56,24.56,0,0,1-6.26,10.7l-1.95,2a35,35,0,0,0-30.5,0l-2-1.93a24.72,24.72,0,0,1-6.26-10.7l-1-3.71A6.33,6.33,0,0,0,53,22.05a6.79,6.79,0,0,0-5.47,1.16A7.17,7.17,0,0,0,45,28.48v9.93a28.49,28.49,0,0,0,6.65,18.31l-.2.4-.2.38a28.34,28.34,0,0,0-5.67-.58C27.78,56.92,20.34,69,20,69.59a1.72,1.72,0,0,0,0,1.94c.38.59,7.85,12.67,25.6,12.67.78,0,1.76-.2,2.55-.2l1.52,21.37c-7.5,3-18.67,14.45-13.82,30.28,5.25,11.64,20.1,11.07,28.71,11.09h7.86a15.12,15.12,0,0,0,9.78-3.51,16.22,16.22,0,0,0,9.77,3.51h7.86c4.57,0,10.2,1.13,20.06-2.5,13-7.14,15.48-30.21-3.77-38.87l.3-21.17a10.88,10.88,0,0,0,2.55.19c17.78,0,25.21-12.08,25.6-12.66A3.17,3.17,0,0,0,144.48,69.78Z',
};

// Apply all active bar chart filters to data
function filterByBarchartsData() {
  let currentData = mainData;
  if (householdSizeFilter !== 0) {
    currentData = currentData.filter(
      (d) => d.Houshold_size === householdSizeFilter
    );
  }

  if (foodSafetyImportanceFilter !== 0) {
    currentData = currentData.filter(
      (d) => d.Food_safety_importance === foodSafetyImportanceFilter
    );
  }

  return currentData;
}

// filter by meat types and radio buttons
function filterBubbleData(originalData) {
  let filteredData = [];

  if (habitsBubbleRadioFilter === 'wash') {
    filteredData = originalData.filter((d) => d[meatTypeFilter] === '1');
  } else if (habitsBubbleRadioFilter === 'noWash') {
    filteredData = originalData.filter((d) => d[meatTypeFilter] === '0');
  } else if (habitsBubbleRadioFilter === 'all') {
    filteredData = originalData;
  }

  return filteredData;
}

d3.csv('data/wash_to_remove_data.csv').then((data) => {
  data.forEach((d) => {
    d.Remove_artificial_chemicals = +d.Remove_artificial_chemicals;
    d.Remove_blood = +d.Remove_blood;
    d.Remove_debris = +d.Remove_debris;
    d.Remove_fat = +d.Remove_fat;
    d.Remove_meat_juice = +d.Remove_meat_juice;
    d.Remove_pathogens = +d.Remove_pathogens;
    d.Remove_slime = +d.Remove_slime;
    d.Remove_undesirable_flavors_or_odors = +d.Remove_undesirable_flavors_or_odors;
  });

  teardropChart = new TeardropChart(
    {
      parentElement: '#teardrop-chart',
    },
    data
  );
});

// Exploratory view & pie chart
d3.csv('data/exploratory_data.csv').then((exploratoryData) => {
  mainData = exploratoryData;
  // Initialize the views
  // Pie chart
  pieChart = new PieChart(
    {
      parentElement: '#pie-chart',
    },
    exploratoryData
  );

  // Bar charts
  householdSizeBarChart = new HouseholdSizeBarChart(
    {
      parentElement: '#householdSizeBarChart',
    },
    dispatcherHouseholdSize,
    exploratoryData
  );

  foodSafetyBarChart = new FoodSafetyBarChart(
    {
      parentElement: '#foodSafetyBarChart',
    },
    dispatcherFoodSafetyImportance,
    exploratoryData
  );

  // Habits bubble plot
  habitsBubblePlot = new HabitsBubblePlot(
    {
      parentElement: '#habitsBubblePlot',
    },
    exploratoryData
  );

  // Liquid gauges
  liquidBeefChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    dispatcherMeatType,
    exploratoryData,
    'Beef',
    svgs.Beef
  );

  liquidPorkChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    dispatcherMeatType,
    exploratoryData,
    'Pork',
    svgs.Pork
  );

  liquidPoultryChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    dispatcherMeatType,
    exploratoryData,
    'Poultry',
    svgs.Poultry
  );

  liquidSheepGoatChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    dispatcherMeatType,
    exploratoryData,
    'Sheep_Goat',
    svgs.Sheep_Goat
  );

  liquidFishChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    dispatcherMeatType,
    exploratoryData,
    'Fish',
    svgs.Fish
  );

  liquidWashAnyChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    dispatcherMeatType,
    exploratoryData,
    'Wash_Any',
    svgs.Wash_Any
  );

  // Dispatchers for linkage
  function dispatchBarChart() {
    const filteredByBarchartsData = filterByBarchartsData();
    const filteredData = filterBubbleData(filteredByBarchartsData);

    habitsBubblePlot.data = filteredData;
    liquidBeefChart.data = filteredByBarchartsData;
    liquidPorkChart.data = filteredByBarchartsData;
    liquidPoultryChart.data = filteredByBarchartsData;
    liquidSheepGoatChart.data = filteredByBarchartsData;
    liquidFishChart.data = filteredByBarchartsData;
    liquidWashAnyChart.data = filteredByBarchartsData;

    habitsBubblePlot.updateVis();
    liquidBeefChart.updateVis();
    liquidPorkChart.updateVis();
    liquidPoultryChart.updateVis();
    liquidSheepGoatChart.updateVis();
    liquidFishChart.updateVis();
    liquidWashAnyChart.updateVis();
  }

  dispatcherHouseholdSize.on('filterHouseholdSize', () => {
    dispatchBarChart();
  });

  dispatcherFoodSafetyImportance.on('filterFoodSafetyImportance', () => {
    dispatchBarChart();
  });

  dispatcherMeatType.on('filterMeatType', (selectedChart) => {
    liquidBeefChart.active = false;
    liquidPorkChart.active = false;
    liquidPoultryChart.active = false;
    liquidSheepGoatChart.active = false;
    liquidFishChart.active = false;
    liquidWashAnyChart.active = false;

    selectedChart.active = true;

    const filteredByBarchartsData = filterByBarchartsData();
    const filteredData = filterBubbleData(filteredByBarchartsData);

    habitsBubblePlot.data = filteredData;
    habitsBubblePlot.updateVis();

    // Data is filtered in the bar chart classes
    householdSizeBarChart.updateVis();
    foodSafetyBarChart.updateVis();
  });
});

// Event listener for radio buttons
d3.selectAll("input[name='washHabit']").on('change', () => {
  habitsBubbleRadioFilter = d3
    .selectAll("input[name='washHabit']:checked")
    .property('value');

  const filteredByBarchartsData = filterByBarchartsData();
  const filteredData = filterBubbleData(filteredByBarchartsData);

  habitsBubblePlot.data = filteredData;
  habitsBubblePlot.updateVis();
});

// Reasons view
d3.csv('data/reasons_for_washing_data.csv').then((reasonsWashingData) => {
  const washListOfReasons = [
    'Health and Safety Concerns',
    'Religious Practice',
    'Non-Religious Practice',
    'Improve Taste or Smell',
    'Improve Texture',
    'Improve Appearance',
    'Others',
  ];

  const washDataLabels = [
    'Health_and_safety_of_meat',
    'Religious_practice',
    'Non_religious_practice',
    'Improve_taste/smell',
    'Improve_texture',
    'Improve_appearance',
    'Other',
  ];

  // Reasons wash bubble plot
  reasonsWashBubblePlot = new ReasonsBubblePlot(
    {
      parentElement: '#reasons-wash-bubble-plot',
    },
    reasonsWashingData,
    'wash',
    washDataLabels,
    washListOfReasons
  );
});

d3.csv('data/reasons_for_not_washing_data.csv').then(
  (reasonsNotWashingData) => {
    const noWashListOfReasons = [
      "Feel like I should, but I don't",
      'Meat is clean enough',
      "Follow expert's advice",
      'Preserve texture, smell, taste, etc',
      'Not cultural or religious custom',
      'Others',
    ];

    const noWashDataLabels = [
      'Feel_I_should_but_dont',
      'Meat_is_clean_enough',
      'Exprts_advise_against',
      'Preserve_texture_etc',
      'Not_cultural_or_religious_custom',
      'Other',
    ];

    // Reasons no wash bubble plot
    reasonsNoWashBubblePlot = new ReasonsBubblePlot(
      {
        parentElement: '#reasons-no-wash-bubble-plot',
      },
      reasonsNotWashingData,
      'noWash',
      noWashDataLabels,
      noWashListOfReasons
    );
  }
);

// Event listener for toggle switch
d3.selectAll('.switch').on('change', () => {
  if (document.getElementById('reasonToggle').checked) {
    // true = WASH
    d3.selectAll('#reasonsWashBubblePlot').style('display', 'flex');

    d3.selectAll('#reasonsNoWashBubblePlot').style('display', 'none');
  } else {
    d3.selectAll('#reasonsNoWashBubblePlot').style('display', 'flex');

    d3.selectAll('#reasonsWashBubblePlot').style('display', 'none');
  }
});

function showWashContent() {
  setTextWash();
  d3.selectAll('.switch').style('display', 'inline-flex');
  document.getElementById('reasonToggle').checked = true;

  d3.selectAll('#reasonsNoWashBubblePlot').style('display', 'none');
  d3.selectAll('#reasonsWashBubblePlot').style('display', 'flex');
}

function showNoWashContent() {
  setTextNoWash();
  // show reasons bubble plot according to user input
  d3.selectAll('.switch').style('display', 'inline-flex');
  document.getElementById('reasonToggle').checked = false;

  d3.selectAll('#reasonsNoWashBubblePlot').style('display', 'flex');
  d3.selectAll('#reasonsWashBubblePlot').style('display', 'none');
}

// Dynamically set text on button click
function setTextWash() {
  d3.selectAll('#user-text').text(
    'You are one of the 7 in 10 people who wash meat before cooking! Scroll down to view more details.'
  );
  d3.selectAll('#user-text').style('visibility', 'visible');
}

function setTextNoWash() {
  d3.selectAll('#user-text').text(
    "You are one of the 3 in 10 people who don't wash meat before cooking! Scroll down to view more details."
  );
  d3.selectAll('#user-text').style('visibility', 'visible');
}

// Functions for navigation
function navigateDown() {
  switch (currentPage) {
    case '#intro':
      d3.selectAll('#arrow-up').style('visibility', 'visible');
      currentPage = '#proportion';
      window.location.hash = '#proportion';
      break;
    case '#proportion':
      currentPage = '#reasons';
      window.location.hash = '#reasons';
      break;
    case '#reasons':
      currentPage = '#remove';
      window.location.hash = '#remove';
      break;
    case '#remove':
      d3.selectAll('#arrow-down').style('visibility', 'hidden');
      currentPage = '#explore';
      window.location.hash = '#explore';
      break;
    default:
      break;
  }
}

// Functions for navigation
function navigateUp() {
  switch (currentPage) {
    case '#proportion':
      d3.selectAll('#arrow-up').style('visibility', 'hidden');
      currentPage = '#intro';
      window.location.hash = '#intro';
      break;
    case '#reasons':
      currentPage = '#proportion';
      window.location.hash = '#proportion';
      break;
    case '#remove':
      currentPage = '#reasons';
      window.location.hash = '#reasons';
      break;
    case '#explore':
      d3.selectAll('#arrow-down').style('visibility', 'visible');
      currentPage = '#remove';
      window.location.hash = '#remove';
      break;
    default:
      break;
  }
}

// Clear all filters button
function clearFilters() {
  meatTypeFilter = 'Wash_Any';
  householdSizeFilter = 0;
  foodSafetyImportanceFilter = 0;
  habitsBubbleRadioFilter = 'all';

  // Change UI for radio button
  d3.selectAll("input[name='washHabit'][value='all']").property(
    'checked',
    'true'
  );

  // Data is filtered in the bar chart classes
  householdSizeBarChart.updateVis();
  foodSafetyBarChart.updateVis();

  habitsBubblePlot.data = mainData;
  liquidBeefChart.data = mainData;
  liquidPorkChart.data = mainData;
  liquidPoultryChart.data = mainData;
  liquidSheepGoatChart.data = mainData;
  liquidFishChart.data = mainData;
  liquidWashAnyChart.data = mainData;

  habitsBubblePlot.updateVis();
  liquidBeefChart.updateVis();
  liquidPorkChart.updateVis();
  liquidPoultryChart.updateVis();
  liquidSheepGoatChart.updateVis();
  liquidFishChart.updateVis();
  liquidWashAnyChart.updateVis();
}
