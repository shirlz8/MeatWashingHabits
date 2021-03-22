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

    this.initVis();
  }

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

    // Initialize scales
    const xAxisData = ['Never', 'Seldom', 'Sometimes', 'Half the time', 'Usually', 'Always'];
    const yAxisData = ['Use different plate for handling raw meat and cooked meat', 'Use thermometer',
      'Use same utensils without cleaning to handle both raw and cooked food',
      'Use the same cutting board without cleaning to handle both raw and cooked food',
      'Leave perishable out of the fridge for over 2 hours'];

    vis.xScale = d3.scalePoint()
        .range([100, vis.width - 50])
        .domain(xAxisData);

    vis.yScale = d3.scalePoint()
        .range([50, vis.height - 100])
        .domain(yAxisData);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .tickSize(-vis.width - 200);

    vis.yAxis = d3.axisLeft(vis.yScale)
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

    vis.renderVis();
  }

  renderVis() {
    const vis = this;

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
