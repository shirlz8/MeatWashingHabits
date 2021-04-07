class HabitsBubblePlot {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 600,
      containerHeight: 500,
      margin: {
        top: 50,
        right: 25,
        bottom: 30,
        left: 110,
      },
      legendWidth: 170,
      legendHeight: 57,
      yAxisLabelWidth: 80,
      yLabelWidth: 90,
    };
    this.data = _data;

    this.listOfHabits = [
      'Different_plates',
      'Thermometer',
      'Different_utensil',
      'Different_cutting_boards',
      'Not_leaving_food_out',
    ];

    this.frequencyLevel = [
      'never',
      'seldom',
      'sometimes',
      'about half the time',
      'usually',
      'always',
    ];

    this.xAxisData = [
      'Never',
      'Seldom',
      'Sometimes',
      'About Half the time',
      'Usually',
      'Always',
    ];

    this.yAxisData = [
      'Use different plate for handling raw meat and cooked meat',
      'Use thermometer',
      'Use different utensils for handling raw and cooked food',
      'Use different cutting boards for handling raw and cooked food',
      'Do not leave perishable out of the fridge for over 2 hours',
    ];

    this.initVis();
  }

  // Return axis names corresponding to the data
  xAxisScale(d) {
    const vis = this;

    const xAxisName = d3
      .scaleOrdinal()
      .domain(vis.frequencyLevel)
      .range(vis.xAxisData);

    return xAxisName(d);
  }

  // Return axis names corresponding to the data
  yAxisScale(d) {
    const vis = this;

    const yAxisName = d3
      .scaleOrdinal()
      .domain(vis.listOfHabits)
      .range(vis.yAxisData);

    return yAxisName(d);
  }

  //Todo: refactor and look into the margin/axis calculation
  initVis() {
    const vis = this;

    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    vis.svg = d3
      .select(vis.config.parentElement)
      .append('svg')
      // .attr('transform', `translate(0,${vis.config.margin.top + vis.config.margin.bottom})`)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.chartArea = vis.svg.append('g');
    // .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.chart = vis.chartArea
      .append('g')
      .attr(
        'transform',
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    // Initialize clipping mask that covers the whole chart
    vis.chart
      .append('defs')
      .append('clipPath')
      .attr('id', 'chart-mask')
      .append('rect')
      .attr('width', vis.config.containerWidth + vis.config.yAxisLabelWidth)
      .attr('x', -vis.config.yAxisLabelWidth - vis.config.margin.left)
      .attr('y', vis.config.margin.top)
      .attr('height', vis.config.containerHeight);

    // Apply clipping mask to 'vis.chart' to clip semicircles at the very beginning and end of a year
    vis.chartClip = vis.chart.append('g').attr('clip-path', 'url(#chart-mask)');

    // Initialize main scales
    vis.xScale = d3
      .scalePoint()
      .range([30, vis.width - 20])
      .domain(vis.frequencyLevel);

    vis.yScale = d3
      .scalePoint()
      .range([100, vis.height - vis.config.legendHeight])
      .domain(vis.listOfHabits);

    // Initialize additional scales
    vis.radiusScale = d3.scaleSqrt().range([4, 40]);

    // Initialize axes
    vis.xAxis = d3
      .axisBottom(vis.xScale)
      .tickFormat((d) => vis.xAxisScale(d))
      .tickSize(-vis.width - 100);

    vis.yAxis = d3
      .axisLeft(vis.yScale)
      .tickFormat((d) => vis.yAxisScale(d))
      .tickSize(-vis.height - 180);

    // Append axis groups
    vis.xAxisG = vis.chartClip
      .append('g')
      .attr('class', 'axis bubble-x-axis')
      .attr('transform', `translate(0,${vis.height})`);

    vis.yAxisG = vis.chartClip.append('g').attr('class', 'axis bubble-y-axis');

    // Create a group for the legend
    vis.legend = vis.svg
      .append('g')
      .attr('width', vis.config.legendWidth)
      .attr('height', vis.config.legendHeight);

    // Add axis titles
    vis.chartClip
      .append('g')
      .attr(
        'transform',
        `translate(${-vis.config.yLabelWidth}, ${vis.height / 2})`
      )
      .append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Food Safety Habits');

    vis.chartClip
      .append('g')
      .attr(
        'transform',
        `translate(${vis.width / 2}, ${vis.config.containerHeight - 55})`
      )
      .append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle')
      .text('Level of Frequency');

    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    // Count the number of each frequency lvl for each habit
    // ie: {habit: "Different_plates", frequency: "Always", count: 5281},
    //     {habit: "Different_plates", frequency: "Always", count: 5281}
    vis.aggregatedDataMap = [];
    for (const habit of vis.listOfHabits) {
      const noNAData = vis.data.filter((d) => d[habit] !== 'NA');
      const frequencyData = d3.rollups(
        noNAData,
        (v) => v.length,
        (d) => d[habit]
      );

      let washPercentageMap = new Map();
      if (meatTypeFilter !== '') {
        washPercentageMap = d3.rollup(
          noNAData,
          (v) => d3.sum(v, (d) => d[meatTypeFilter]),
          (d) => d[habit]
        );
      }

      for (const frequencyLevel of frequencyData) {
        const newRow = {
          habit: habit,
          frequency: frequencyLevel[0],
          count: frequencyLevel[1],
          washPercentage:
            washPercentageMap.get(frequencyLevel[0]) / frequencyLevel[1],
        };
        vis.aggregatedDataMap.push(newRow);
      }
    }

    console.log(vis.aggregatedDataMap);

    vis.yValue = (d) => d['habit'];
    vis.xValue = (d) => d['frequency'];
    vis.count = (d) => d['count'];

    const minCount = d3.least(vis.aggregatedDataMap, (d) => d['count']).count;
    const maxCount = d3.greatest(vis.aggregatedDataMap, (d) => d['count'])
      .count;

    const countExtent = [minCount, maxCount];
    vis.dataRange = maxCount - minCount;
    vis.radiusScale.domain(countExtent);

    let numOfCircles = (vis.dataRange > 5) ? 4 : 2;
    vis.radiusLegendValues = vis.calculateRadiusLegendValues(countExtent, numOfCircles);

    vis.renderLegend();
    vis.renderVis();
  }

  renderVis() {
    const vis = this;

    //draw the circles
    const circles = vis.chartClip
      .selectAll('circle')
      .data(vis.aggregatedDataMap, (d) => d)
      .join('circle')
      .attr('class', 'circle_data')
      .attr('r', (d) => vis.radiusScale(vis.count(d)))
      .attr('cy', (d) => vis.yScale(vis.yValue(d)))
      .attr('cx', (d) => vis.xScale(vis.xValue(d)))
      .attr('opacity', 0.7)
      .style('stroke', 'black')
      .attr('fill', (d) => vis.colour(d['habit']));

    circles
      .on('mouseover', (event, d) => {
        d3
          .select('#tooltip')
          .style('display', 'block')
          .style('left', event.pageX + 'px')
          .style('top', event.pageY + 'px').html(`
              <div class="tooltip-title">${d['count']} claims</div>
              <div>${d['washPercentage'].toFixed(2)}% Wash Meats</div>
              <div><i>(${
                100 - d['washPercentage'].toFixed(2)
              }% Don't Wash Meats)</i></div>
            `);
      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('display', 'none');
      });

    //draw the axis
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG
      .call(vis.yAxis)
      .selectAll('.tick text')
      .attr('transform', (d) => {
        if (d !== 'Thermometer') {
          return 'translate(0,-20)';
        }
      })
      .call(vis.wrap, vis.config.yAxisLabelWidth);
  }

  // Prepare and display the legend
  renderLegend() {
    const vis = this;
    vis.legend
      .selectAll('.legend-element')
      .data(vis.radiusLegendValues, (d) => d)
      .join('circle')
      .attr('class', `legend legend-element`)
      .attr('r', (d) => vis.radiusScale(d))
      .attr('cy', 55)
      .attr('cx', (d, i) => {
        let r = vis.radiusScale(d);
        return vis.width / 2 + i * (30 + r);
      })
      .attr('transform', (d) => {
        if (vis.dataRange < 5) {
          return 'translate(200,0)'
        } else {
          return 'translate(80,0)'
        }
      })
      .style('stroke', 'black')
      .style('fill', 'none');

    vis.legend
      .selectAll('text')
      .data(vis.radiusLegendValues, (d) => d)
      .join('text')
      .attr('class', `legend legend-label`)
      .attr('y', (d) => 55 - vis.radiusScale(d) - 3)
      .attr('x', (d, i) => {
        let r = vis.radiusScale(d);
        return vis.width / 2 + i * (30 + r);
      })
      .style('text-align', 'center')
      .attr('transform', (d) => {
        if (vis.dataRange < 5) {
          return 'translate(200,0)'
        } else {
          return 'translate(70,0)'
        }
      })
      .text((d) => Math.round(d));

    vis.legend
      .append('text')
      .attr('class', 'legend legend-label')
      .attr('x', vis.width / 2 - 30)
      .attr('y', 75)
      .attr('transform', (d) => {
        if (vis.dataRange < 5) {
          return 'translate(80,0)'
        } else {
          return 'translate(0,0)'
        }
      })
      .text('Area = Total Counts');
  }

  calculateRadiusLegendValues(rangeExtent, numOfCircles) {
    const vis = this;
    let min = rangeExtent[0];
    let max = rangeExtent[1];
    const range = max - min;
    let radiusLegendValues = [];

    min = vis.roundToNearestTens(min);

    radiusLegendValues.push(min);
    for (let i = 1; i < numOfCircles - 1; i++) {
      let  value = (range / numOfCircles) * i;
      value = vis.roundToNearestTens(value);
      radiusLegendValues.push(value);

    }
    max = vis.roundToNearestTens(max);
    radiusLegendValues.push(max);

    return radiusLegendValues;
  }

  // Determine the colour for different Wash/Don't Wash Ratio
  colour(d) {
    const vis = this;

    const colourScale = d3
      .scaleOrdinal()
      .domain(vis.listOfHabits)
      .range(['#3EBA9D', '#FF815D', '#7B97C1', '#F080B8', '#96D05B']);

    return colourScale(d);
  }

  //TODO: consider refactoring and move to util

  roundToNearestTens(number) {
    if (number > 10) {
      return Math.ceil(number / 10) * 10;
    } else {
      return number;
    }
  }

  // TODO: consider refactoring and move to util
  // Function to wrap Y axis labs
  // Sampled from : bl.ocks.org/mbostock/7555321
  wrap(text, width) {
    text.each(function () {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word;
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1; // ems
      const y = text.attr('y');
      const dy = parseFloat(text.attr('dy'));

      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', -10)
        .attr('y', y)
        .attr('dy', `${dy}em`);

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));

        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text
            .append('tspan')
            .attr('x', -10)
            .attr('y', y)
            .attr('dy', `${1 + dy}em`)
            .text(word);
        }
      }
    });
  }
}
