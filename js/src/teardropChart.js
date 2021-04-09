class TeardropChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 1000,
      containerHeight: 900,
      margin: {
        top: 400,
        right: 25,
        bottom: 30,
        left: 190,
      },
    };
    this.data = _data;

    this.initVis();
  }

  // Todo: refactor and look into the margin/axis calculation
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
      .attr('id', 'teardropsvg')
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg
      .append('g')
      .attr(
        'transform',
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    vis.meatWashData = vis.data;

    vis.meatWashReasons = Object.keys(vis.data[0]);

    vis.colorScale = d3
      .scaleOrdinal()
      .range([
        '#1b9e77',
        '#d95f02',
        '#7570b3',
        '#e7298a',
        '#66a61e',
        '#e6ab02',
        '#a6761d',
        '#666666',
      ])
      .domain(vis.meatWashReasons);

    vis.meatWashCount = {};

    vis.data.forEach((item) => {
      for (let [key, value] of Object.entries(item)) {
        if (vis.meatWashCount[key]) {
          vis.meatWashCount[key] += value;
        } else {
          vis.meatWashCount[key] = value;
        }
      }
    });

    vis.array = [];

    for (let [key, value] of Object.entries(vis.meatWashCount)) {
      let obj = {};
      obj['removeObject'] = key;
      obj['count'] = value;
      vis.array.push(obj);
    }

    vis.renderVis();
  }

  renderVis() {
    const vis = this;

    vis.width = window.innerWidth / 2.5;
    vis.height = window.innerHeight / 2.5;

    vis.generateChart(vis.array, vis);
  }

  generateChart = (data, vis) => {
    const bubble = (data) =>
      d3.pack().size([vis.width, vis.height]).padding(2)(
        d3.hierarchy({ children: data }).sum((d) => d.count)
      );

    const root = bubble(data);
    const tooltip = d3.select('.tooltip');

    const node = vis.chart
      .selectAll()
      .data(root.children)
      .enter()
      .append('g')
      .attr('transform', `translate(${vis.width / 2}, ${vis.height / 2})`);

    const circle = node
      .append('circle')
      .style('stroke', 'white')
      .style('stroke-width', '5px')
      .style('fill', (d) => {
        console.log(d.data.removeObject);
        return vis.colorScale(d.data.removeObject);
      })
      .on('mouseover', function (e, d) {
        d3.select(this).style('stroke', '#222');
      })
      .on('mousemove', (e) =>
        tooltip.style('top', `${e.pageY}px`).style('left', `${e.pageX + 10}px`)
      )
      .on('mouseout', function () {
        d3.select(this).style('stroke', 'white');
        return tooltip.style('visibility', 'hidden');
      });

    // const label = node
    //   .append('text')
    //   .attr('dy', 2)
    //   .text((d) => d.data.removeObject.substring(0, d.r / 3));

    node
      .transition()
      .ease(d3.easeExpInOut)
      .duration(1000)
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`);

    circle
      .transition()
      .ease(d3.easeExpInOut)
      .duration(1000)
      .attr('r', (d) => d.r);

    // label
    //   .transition()
    //   .delay(700)
    //   .ease(d3.easeExpInOut)
    //   .duration(1000)
    //   .style('opacity', 1);
  };
}
