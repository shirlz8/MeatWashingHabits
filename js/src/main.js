let meatTypeFilter = '';

let svgs = {
  Poultry:
    'M51.2074 174.866C81.8865 176.965 109.076 154.133 111.896 123.903C113.106 110.7 103.806 93.1407 83.7064 71.9492C80.5862 68.5847 78.8348 64.4792 78.7066 60.2289L78.6566 55.0477C78.6032 52.9655 77.6013 50.9781 75.8539 49.4884C74.1066 47.9988 71.7446 47.1185 69.2469 47.0259L69.0469 25.5596C71.8312 24.9788 74.3768 23.7848 76.4167 22.1026C77.8294 20.8791 78.9382 19.4352 79.6794 17.8539C80.4206 16.2725 80.7797 14.5848 80.736 12.8875C80.6924 11.1903 80.2468 9.5169 79.4249 7.96344C78.603 6.40998 77.421 5.007 75.9467 3.835C73.1219 1.63168 69.427 0.365374 65.5588 0.274841C61.6905 0.184308 57.9161 1.2758 54.9473 3.34353C51.8692 1.05314 47.8368 -0.142188 43.7138 0.0135061C39.5907 0.1692 35.7047 1.66354 32.888 4.17653C26.9682 9.39109 27.8081 17.6544 34.0579 22.5941C35.898 23.9369 38.0844 24.9088 40.4477 25.4346L40.6577 47.1509C38.2693 47.3389 36.053 48.2681 34.4488 49.7541C32.8446 51.2401 31.9698 53.1743 31.998 55.1726V60.6038C32 65.0877 30.1697 69.4385 26.8082 72.9405C10.3987 89.7254 1.34893 104.286 0.278961 116.373C-1.19935 130.427 3.22969 144.472 12.8086 156.107C22.6883 167.219 36.2379 174 51.2074 174.866Z',
  Pork:
    'M85 0H89C94.76 2.07 101 3.39 106.16 6.4C112.35 9.98 117.04 10.62 123.87 6.9C137.18 -0.37 152.03 0.12 166.78 2.2C171.61 2.89 174.88 4.64 175 10V21C174.719 21.9404 174.505 22.8994 174.36 23.87C173.18 38.38 169.18 51.92 161.05 64.17C160.34 65.25 160.42 67.26 160.83 68.63C166.39 87.29 165.98 105.71 159.02 123.96C151.11 144.71 138.56 161.34 117.18 169.48C110.12 172.16 102.43 173.21 95.02 175H78.02C76.5598 174.783 75.1139 174.479 73.69 174.09C65.18 171.3 55.98 169.71 48.42 165.35C18.6 148.03 3.09 109.24 11.88 75.11C13.72 68 14.49 61.88 9.46 55.88C8.07257 54.0013 7.12584 51.8344 6.69 49.54C4.35 39.39 2.18 29.19 0 19V12C1.56 9.06 -0.59 4.15 4.6 3.15C22.7 -0.29 40.36 -0.29 56.85 9.58C57.4334 9.91154 58.0776 10.1222 58.7442 10.1996C59.4108 10.2769 60.0862 10.2192 60.73 10.03C68.87 6.81 76.92 3.37 85 0Z',
  Fish:
    'M175 54V121C171.32 124.72 170.53 124.67 167.58 120.33C161.83 111.86 156.11 103.33 150.07 94.44L147 99.21C134.59 118.42 120.37 135.85 100 147.33C98.83 147.98 97.88 150.19 98 151.63C98.24 156.95 99.18 162.23 99.39 167.54C99.49 170.01 98.53 172.54 98.05 175H94C93.6223 174.687 93.1924 174.443 92.73 174.28C78.33 172.13 67.05 164.96 58.54 153.28C58.0558 152.639 57.4008 152.147 56.65 151.86C36.76 144.8 23.15 130.2 11.08 113.86C3.79 103.96 3.9 104.01 15.77 100.56C18.45 99.79 20.82 97.92 23.32 96.56C21.37 94.45 19.67 91.98 17.41 90.28C11.74 86 5.82 82 0 78V76C7.18 67.15 14.14 58.12 21.59 49.5C32.53 36.86 45.21 26.65 62 22.64C63.1365 22.358 64.174 21.77 65 20.94C74.13 11.08 84.88 3.67 98 0H102C102.67 1.94 103.84 3.86 103.9 5.81C104.14 12.81 103.85 19.81 104.1 26.81C104.16 28.5 105.02 30.81 106.3 31.71C118.9 40.21 128.9 51.25 137.77 63.4C141.95 69.11 145.77 75.05 150.17 81.4C156.17 72.27 162 63.63 167.6 54.85C169.91 51.17 172.17 50.91 175 54Z',
  Ground_Meat:
    'M160.911 59.88C162.592 59.1374 164.078 58.0146 165.251 56.6C166.334 55.2628 167.102 53.6999 167.5 52.0263C167.898 50.3528 167.916 48.6112 167.551 46.93L167.251 45.5C163.561 28.12 151.071 17.9 143.951 13.36C130.071 4.5 111.421 0 88.7414 0C64.8814 0 47.0714 4.23 32.7414 13.36C25.6214 17.87 13.2214 28.06 9.44137 45.5L9.14137 46.93C8.77709 48.6112 8.79461 50.3528 9.19267 52.0263C9.59072 53.6999 10.3592 55.2628 11.4414 56.6C11.7948 57.0118 12.1721 57.4025 12.5714 57.77L12.4214 57.94L0.621372 74.45C0.309786 74.8767 0.107646 75.3734 0.0326773 75.8964C-0.0422917 76.4195 0.0121992 76.9529 0.191372 77.45C0.343009 77.9626 0.619859 78.4293 0.996951 78.8082C1.37404 79.187 1.83951 79.466 2.35137 79.62L8.86137 81.53V84.53C8.8608 85.118 9.01978 85.6952 9.32137 86.2C10.8847 93.1482 15.1435 99.1911 21.1614 103C13.8314 106.23 8.86137 112.38 8.86137 119.41C8.93512 122.017 9.60423 124.573 10.8175 126.881C12.0308 129.19 13.7561 131.191 15.8614 132.73C13.3908 133.763 11.3606 135.63 10.1237 138.005C8.88679 140.38 8.52151 143.113 9.09137 145.73L9.39137 147.16C11.1168 155.028 15.4714 162.072 21.7375 167.133C28.0035 172.194 35.8069 174.969 43.8614 175H132.781C140.847 174.96 148.657 172.168 154.92 167.085C161.182 162.003 165.522 154.935 167.221 147.05L167.531 145.62C168.101 143.003 167.736 140.27 166.499 137.895C165.262 135.52 163.232 133.653 160.761 132.62C162.867 131.081 164.592 129.08 165.805 126.771C167.019 124.463 167.688 121.907 167.761 119.3C167.761 112.3 162.761 106.12 155.461 102.88C158.459 100.992 161.052 98.5284 163.09 95.6307C165.127 92.733 166.569 89.4594 167.331 86C167.637 85.497 167.797 84.9186 167.791 84.33V81.72C167.811 81.5038 167.811 81.2862 167.791 81.07L172.731 79.44C173.541 79.1861 174.218 78.6249 174.618 77.877C175.018 77.1291 175.109 76.2542 174.871 75.44C174.721 74.9621 174.465 74.5244 174.121 74.16L160.911 59.88Z',
  Sheep_Goat:
    'M169.11 88.6404C166.37 74.5004 150.88 62.7904 140.37 56.3204V55.2604C140.32 46.7004 136.51 38.8204 130.37 34.6104C130.651 33.009 130.791 31.3862 130.79 29.7604C130.65 16.4904 121.71 5.86041 110.79 5.97041C107.511 5.98872 104.302 6.92771 101.53 8.68041C94.2802 -1.67959 81.5302 -2.94959 72.9402 5.86041C72.1759 6.6573 71.4676 7.50598 70.8202 8.40041C69.3196 7.97931 67.7687 7.76401 66.2102 7.76041C55.2602 7.65041 46.3102 18.3304 46.2102 31.6304V32.1404C37.2102 34.5304 30.8402 44.1404 30.7502 55.2604C30.752 57.2784 30.9733 59.2903 31.4102 61.2604C22.1502 68.0004 12.1902 77.5804 10.0002 88.6404C9.15019 93.2704 -4.12981 114.64 1.30019 121.85C4.61019 126.23 21.5602 114.1 25.3902 114.1C30.0002 114.1 34.0902 110.72 37.6502 105.6C40.8002 140.7 66.6102 175 92.0002 175C119.19 175 136.57 136.73 137.17 98.0004C141.61 107.16 147.17 114.08 153.76 114.08C157.59 114.08 169.91 131.62 173.22 127.23C178.65 120.06 170 93.2704 169.11 88.6404Z',
  Beef:
    'M174.793 67.1276C174.243 66.3076 163.793 49.3776 138.933 49.3776C136.265 49.3638 133.603 49.6388 130.993 50.1976L130.723 49.6476L130.173 48.8276C136.192 41.6279 139.487 32.5415 139.483 23.1576V9.49763C139.541 7.8802 139.161 6.27726 138.383 4.85764C137.809 3.81406 137.035 2.89412 136.104 2.15057C135.173 1.40702 134.105 0.854501 132.961 0.524688C131.816 0.194876 130.617 0.0942623 129.434 0.228618C128.25 0.362974 127.105 0.729653 126.063 1.30763C124.999 1.87271 124.062 2.64944 123.308 3.59009C122.555 4.53075 122.002 5.61548 121.683 6.77763L120.313 11.9576C118.716 17.6212 115.701 22.7839 111.553 26.9576L108.823 29.6876C102.169 26.4547 94.8669 24.7749 87.4684 24.7749C80.07 24.7749 72.7681 26.4547 66.1134 29.6876L63.3734 26.9776C59.2289 22.8012 56.2145 17.6395 54.6134 11.9776L53.2434 6.77763C52.8602 5.18447 52.0436 3.72841 50.8841 2.57061C49.7245 1.41282 48.2672 0.598446 46.6734 0.217632C45.3541 -0.0694269 43.9887 -0.0725454 42.6681 0.208484C41.3474 0.489513 40.1016 1.04826 39.0134 1.84763C37.9355 2.75912 37.0614 3.88728 36.448 5.15876C35.8347 6.43025 35.4958 7.81658 35.4534 9.22763V23.1576C35.4497 32.5415 38.7452 41.6279 44.7634 48.8276L44.4834 49.3776L44.2134 49.9176C41.6011 49.3778 38.941 49.1031 36.2734 49.0976C11.3634 49.0976 0.953448 66.0376 0.413448 66.8576C0.143864 67.2618 0 67.7368 0 68.2226C0 68.7085 0.143864 69.1834 0.413448 69.5876C0.953448 70.4076 11.4134 87.3376 36.2734 87.3376C37.3634 87.3376 38.7334 87.0676 39.8334 87.0676L48.8334 136.228C46.386 138.324 44.4144 140.919 43.0503 143.838C41.6862 146.758 40.9611 149.935 40.9234 153.158C40.9472 158.954 43.2637 164.505 47.3671 168.599C51.4704 172.693 57.0271 174.997 62.8234 175.008H73.8234C78.8246 175.046 83.6766 173.306 87.5134 170.098C91.4144 173.192 96.225 174.917 101.203 175.008H112.203C115.37 174.99 118.498 174.299 121.377 172.98C124.256 171.661 126.822 169.745 128.903 167.358C130.79 165.18 132.224 162.648 133.122 159.911C134.02 157.173 134.365 154.284 134.136 151.412C133.907 148.54 133.109 145.743 131.788 143.182C130.468 140.621 128.651 138.349 126.443 136.498L135.443 87.3376C136.615 87.5721 137.81 87.6628 139.003 87.6076C163.913 87.6076 174.313 70.6776 174.863 69.8576C175.121 68.962 175.096 68.0089 174.793 67.1276Z',
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

  // const liquidBeefChart = new LiquidFillGauge(
  //   {
  //     parentElement: '#liquidFillGauges',
  //   },
  //   exploratoryData,
  //   'Wash_Any',
  //   svgs['Beef']
  // );

  // const liquidPorkChart = new LiquidFillGauge(
  //   {
  //     parentElement: '#liquidFillGauges',
  //   },
  //   exploratoryData,
  //   'Pork',
  //   svgs['Pork']
  // );

  const liquidPoultryChart = new LiquidFillGauge(
    {
      parentElement: '#liquidFillGauges',
    },
    exploratoryData,
    'Poultry',
    svgs['Poultry']
  );

  // const liquidSheepGoatChart = new LiquidFillGauge(
  //   {
  //     parentElement: '#liquidFillGauges',
  //   },
  //   exploratoryData,
  //   'Sheep_Goat',
  //   svgs['Sheep_Goat']
  // );

  // const liquidGroundMeatChart = new LiquidFillGauge(
  //   {
  //     parentElement: '#liquidFillGauges',
  //   },
  //   exploratoryData,
  //   'Ground_Meat',
  //   svgs['Ground_Meat']
  // );

  // const liquidFishChart = new LiquidFillGauge(
  //   {
  //     parentElement: '#liquidFillGauges',
  //   },
  //   exploratoryData,
  //   'Fish',
  //   svgs['Fish']
  // );

  // liquidchart.updateVis(50);
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
