class FoodSafetyBarChart {
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
        top: 25, right: 25, bottom: 30, left: 25,
      },
    };
    this.data = _data;
    console.log('con vis');

    this.initVis();
  }

  // Return axis names corresponding to the numbers
  xAxisScale(d) {
    const xAxisName = d3.scaleOrdinal()
      .domain(['1', '2', '3', '4', '5'])
      .range(['Not Important', 'Moderately Important', 'Important', 'Very Important', 'Extremely Important']);

    return xAxisName(d);
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
    vis.xScale.domain(['1', '2', '3', '4', '5']);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickFormat((d) => vis.xAxisScale(d))
      .ticks(3);

    vis.yAxis = d3.axisLeft(vis.yScale)
      .ticks(5)
      .tickFormat(d3.format('d'))
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

    vis.washCount = d3.rollup(vis.data, v => d3.sum(v, d => {
      if (meatTypeFilter != "")
        return d[meatTypeFilter];
      else return d.Wash_Any;
    }), d => d.Food_safety_importance);
    vis.totalCount = d3.rollup(vis.data, v => v.length, d => d.Food_safety_importance);

    console.log(this.washCount);

    vis.washCountData = [];
    vis.washCount.forEach((value, key) => {
      var row = {
        foodSafetyImportance: key,
        dontWash: vis.totalCount.get(key) - value,
        wash: value
      };
      vis.washCountData.push(row);
    })

    // console.log(vis.washCountData);

    vis.subgroups = ["dontWash", "wash"];

    vis.stackedWashCountData = d3.stack()
      .keys(vis.subgroups)
      (vis.washCountData);

    // console.log(vis.stackedWashCountData);

    vis.yValue = (d) => d.wash;
    vis.yScale.domain([0, d3.max(vis.totalCount.values()) + 200]);

    vis.renderVis();
  }

  // Return colour of the wash and dont wash categories
  color(d) {
    const vis = this;

    const color = d3.scaleOrdinal()
      .domain(vis.subgroups)
      .range(["#C1504F", "#4E81BE"]);

    return color(d);
  }

  /**
         * Bind data to visual elements (enter-update-exit) and update axes
         */
  renderVis() {
    const vis = this;
    vis.tooltipPadding = 10;

    const bars = vis.chart.selectAll('.bar_g')
      .data(vis.stackedWashCountData, (d) => d)
      .join('g')
      .attr('class', 'bar_g')
      .attr('fill', (d) => vis.color(d.key))
      .selectAll('.bar_rect')
      .data(d => d)
      .join('rect')
      .attr('class', (d) => "foodSafety" + d.data.foodSafetyImportance)
      .attr('width', vis.xScale.bandwidth())
      .attr('height', (d) => vis.yScale(d[0]) - vis.yScale(d[1]))
      .attr('y', (d) => vis.yScale(d[1]))
      .attr('x', (d) => vis.xScale(d.data.foodSafetyImportance));

    bars.on('mouseover', (event, d) => {
      // Add hover shading
      d3.selectAll("rect.foodSafety" + d.data.foodSafetyImportance)
        .style("stroke", 'black')
        .attr('stroke-width', '2');

      // Add Tooltip
      d3.select('#tooltip')
        .style('display', 'block')
        .style('left', (event.pageX + vis.tooltipPadding + 'px'))
        .style('top', (event.pageY + vis.tooltipPadding + 'px'))
        .html(`
                <div>Do not wash : ${d.data.dontWash}</div>
                <div>Wash : ${d.data.wash}</div>
            `);
    }).on('mouseleave', (event, d) => {
      // Remove hover shading
      d3.selectAll("rect.foodSafety" + d.data.foodSafetyImportance)
        .attr('stroke-width', '0');

      // Remove tooltip
      d3.select('#tooltip').style('display', 'none');
    });

    // render axis
    vis.xAxisG
      .call(vis.xAxis)
      .call((g) => g.select('.domain').remove())
      .selectAll('.tick text')
      .call(vis.wrap, vis.xScale.bandwidth());

    vis.yAxisG
      .call(vis.yAxis)
      .call((g) => g.select('.domain').remove());
  }

  // Function to wrap X axis labs
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
      let tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y)
        .attr('dy', `${dy}em`);
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', `${++lineNumber * lineHeight + dy}em`)
            .text(word);
        }
      }
    });
  }
}