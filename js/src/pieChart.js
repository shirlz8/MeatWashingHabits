class PieChart {
  /**
   * Class constructor with initial configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 450,
      containerHeight: 450,
      legendPosition: 110,
      margin: {
        top: 25,
        right: 15,
        bottom: 25,
        left: 15,
      },
    };
    this.data = _data;
    this.initVis();
  }

  /**
   * We initialize the arc generator, scales, axes, and append static elements
   */
  initVis() {
    const vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;

    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3
      .select(vis.config.parentElement)
      .append('svg')
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    // add legend
    vis.legend = vis.svg
      .append('g')
      .attr(
        'transform',
        `translate(${vis.width - vis.config.legendPosition}, 50)`
      );

    vis.legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 20)
      .attr('height', 20)
      .style('fill', '#C1504F');

    vis.legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 50)
      .attr('width', 20)
      .attr('height', 20)
      .style('fill', '#4E81BE');

    vis.legend
      .append('text')
      .attr('x', 30)
      .attr('y', 0)
      .attr('dy', '1em')
      .text('Do Not Wash');

    vis.legend
      .append('text')
      .attr('x', 30)
      .attr('y', 50)
      .attr('dy', '1em')
      .text('Wash');

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    vis.radius = (vis.width - vis.config.legendPosition - 20) / 2;

    vis.chart = vis.svg
      .append('g')
      .attr('transform', `translate(${vis.radius}, ${vis.radius})`);

    // Count up number of respondants who wash and do not wash
    vis.counts = d3.rollup(
      vis.data,
      (v) => v.length,
      (d) => d.Wash_Any
    );

    vis.totalCount = d3.count(vis.data, (d) => d.Wash_Any);

    vis.percentages = new Map();
    vis.counts.forEach((value, key) => {
      vis.percentages.set(key, Math.round((value / vis.totalCount) * 100));
    });
    vis.data = vis.counts;

    console.log(vis.percentages);

    // Compute the position of each group on the pie:
    vis.pieChart = d3.pie().value((d) => d[1]);
    vis.pieData = vis.pieChart(vis.data);

    vis.color = d3
      .scaleOrdinal()
      .domain(vis.data.keys())
      .range(['#C1504F', '#4E81BE']);

    // shape helper to build arcs:
    vis.arcGenerator = d3.arc().innerRadius(0).outerRadius(vis.radius);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    vis.chart
      .selectAll('pieSlice')
      .data(vis.pieData)
      .enter()
      .append('path')
      .attr('d', vis.arcGenerator)
      .attr('fill', function (d) {
        console.log(d.data[0]);
        return vis.color(d.data[0]);
      })
      .attr('stroke', 'white')
      .style('stroke-width', '3px');

    vis.chart
      .selectAll('pieSlice')
      .data(vis.pieData)
      .enter()
      .append('text')
      .text((d) => {
        return vis.percentages.get(d.data[0]) + '%';
      })
      .attr('transform', function (d) {
        return 'translate(' + vis.arcGenerator.centroid(d) + ')';
      })
      .style('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', 20);

    vis.updateVis();
  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    const vis = this;
    vis.renderVis();
  }

  /**
   * Bind data to visual elements (enter-update-exit) and update axes
   */
  renderVis() {
    const vis = this;
  }
}
