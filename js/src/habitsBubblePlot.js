class HabitsBubblePlot {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 1000,
      containerHeight: 600,
      margin: {
        top: 25, right: 25, bottom: 30, left: 300,
      },
    };
    this.data = _data;

    this.listOfHabits = ['Different_plates', 'Thermometer', 'Not_washing_between_utensils',
      'Not_wash_between_cutting_boards', 'Leave_food_out_two_hours_or_more']

    this.xAxisData = ['Never', 'Seldom', 'Sometimes', 'About Half the time', 'Usually', 'Always'];

    this.yAxisData = ['Use different plate for handling raw meat and cooked meat', 'Use thermometer',
      'Use same utensils without cleaning to handle both raw and cooked food',
      'Use the same cutting board without cleaning to handle both raw and cooked food',
      'Leave perishable out of the fridge for over 2 hours'];

    this.initVis();
  }


  // Return axis names corresponding to the numbers
  yAxisScale(d) {
    const vis = this;

    const yAxisName = d3.scaleOrdinal()
        .domain(vis.listOfHabits)
        .range(vis.yAxisData);

    return yAxisName(d);
  }

  //Todo: refactor and look into the margin/axis calculation
  initVis() {
    const vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.svg = d3.select(vis.config.parentElement).append('svg')
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    vis.chartArea = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.chart = vis.chartArea.append('g');

    // Initialize main scales
    vis.xScale = d3.scalePoint()
        .range([100, vis.width - 50])
        .domain(vis.xAxisData);

    vis.yScale = d3.scalePoint()
        .range([50, vis.height - 100])
        .domain(vis.listOfHabits);

    // Initialize additional scales
    vis.radiusScale = d3.scaleSqrt()
        .range([4, 50]);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .tickSize(-vis.width - 200);

    vis.yAxis = d3.axisLeft(vis.yScale)
        .tickFormat((d) => vis.yAxisScale(d))
        .tickSize(-vis.height - 200);

    // Append axis groups
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis bubble-x-axis')
        .attr('transform', `translate(0,${vis.height})`);

    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis bubble-y-axis');

    vis.updateVis();
  }

  updateVis() {
    const vis = this;
    console.log(vis.data)

    // Count the number of each frequency lvl for each habit
    // ie: {habit: "Different_plates", frequency: "Always", count: 5281}
    vis.aggregatedDataMap = [];
    for (const habit of vis.listOfHabits) {
      const noNAData = vis.data.filter((d) => d[habit] !== 'NA');
      const frequencyData = d3.rollups(noNAData, v => v.length, d => d[habit]);

      for (const frequencyLevel of frequencyData) {
        const newRow = {
          habit: habit,
          frequency: frequencyLevel[0],
          count: frequencyLevel[1]
        }
        vis.aggregatedDataMap.push(newRow);
      }
    }

    console.log(vis.aggregatedDataMap)

    vis.yValue = (d) => d['habit'];
    vis.xValue = (d) => d['frequency'];
    vis.count = (d) => d['count'];

    const minCount = d3.least(vis.aggregatedDataMap,  d => d['count']).count;
    const maxCount = d3.greatest(vis.aggregatedDataMap,  d => d['count']).count;

    const countExtent = [minCount, maxCount];
    vis.radiusScale.domain(countExtent);

    vis.renderVis();
  }

  renderVis() {
    const vis = this;

    //draw the circles
    const circles = vis.chart.selectAll('circle')
        .data(vis.aggregatedDataMap, (d) => d)
        .join('circle')
        .attr('class', 'circle_data')
        .attr('r', d => vis.radiusScale(vis.count(d)))
        .attr('cy', d => vis.yScale(vis.yValue(d)))
        .attr('cx', d => vis.xScale(vis.xValue(d)))
        .attr('opacity', 0.5)
        .attr('fill', '#80808C')


    //draw the axis
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis)
        .selectAll('.tick text')
        .call(vis.wrap, 200);
  }

  //TODO: consider refactoring and move to util
  // Function to wrap Y axis labs
  // Sampled from : bl.ocks.org/mbostock/7555321
  wrap(text, width) {
    text.each(function () {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word;
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      const y = text.attr('y');
      const dy = parseFloat(text.attr('dy'));

      let tspan = text.text(null).append('tspan')
          .attr('x', -30)
          .attr('y', y)
          .attr('dy', `${dy}em`);

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));

        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan')
              .attr('x', -30)
              .attr('y', y)
              .attr('dy', `${++lineNumber * lineHeight + dy}em`)
              .text(word);
        }
      }

    });
  }

}
