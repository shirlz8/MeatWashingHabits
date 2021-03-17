class HouseholdSizeBarChart {
  /**
     * Class constructor with initial configuration
     * @param {Object}
     * @param {Array}
     */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 300,
      containerHeight: 200,
      margin: {
        top: 25, right: 15, bottom: 20, left: 35,
      },
    };
    this.data = _data;
    console.log('con vis');

    this.initVis();
  }

  /**
       * We initialize the arc generator, scales, axes, and append static elements
       */
  initVis() {
    const vis = this;

    console.log('init vis');

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement).append('svg')
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart
    // and position it according to the given margin config
    vis.chartArea = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.chart = vis.chartArea.append('g');

    // Initialize scales
    vis.xScale = d3.scaleBand()
      .range([0, vis.width])
      .paddingInner(0.15);

    vis.yScale = d3.scaleLinear()
      .range([vis.height, 0]);

    // Set axis domains
    vis.xScale.domain(['1', '2', '3', '4', '5', '6']);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickFormat((d) => {
        if (d === '6') return `${d}+`;
        return d;
      })
      .ticks(2);

    vis.yAxis = d3.axisLeft(vis.yScale)
      .ticks(5)
      .tickSize(-vis.width);

    // Append axis groups
    vis.xAxisG = vis.chart.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${vis.height})`);

    vis.yAxisG = vis.chart.append('g')
      .attr('class', 'axis y-axis');

    vis.updateVis();
  }

  /**
       * Prepare the data and scales before we render it.
       */
  updateVis() {
    const vis = this;

    vis.count = d3.rollups(vis.data, (v) => v.length / 6, (d) => d.Houshold_size);
    vis.yValue = (d) => d[1];
    vis.yScale.domain([0, d3.max(vis.count, vis.yValue)]);

    vis.renderVis();
  }

  /**
       * Bind data to visual elements (enter-update-exit) and update axes
       */
  renderVis() {
    const vis = this;

    const bars = vis.chart.selectAll('.bar')
      .data(vis.count, (d) => d)
      .join('rect')
      .attr('class', 'bar')
      .attr('width', vis.xScale.bandwidth())
      .attr('height', (d) => vis.yScale(0) - vis.yScale(d[1]))
      .attr('y', (d) => vis.yScale(d[1]))
      .attr('x', (d) => vis.xScale(d[0]))
      .style('fill', '#92b7e0');

    // render axis
    vis.xAxisG
      .call(vis.xAxis)
      .call((g) => g.select('.domain').remove());

    vis.yAxisG
      .call(vis.yAxis)
      .call((g) => g.select('.domain').remove());
  }
}
