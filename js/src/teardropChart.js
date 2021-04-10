class TeardropChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 800,
      containerHeight: 900,
      legendPositionX: 600,
      legendPositionY: 25,
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

    vis.width = window.innerWidth;
    vis.height = window.innerHeight;

    vis.svg = d3
      .select(vis.config.parentElement)
      .append('svg')
      .attr('id', 'teardropsvg')
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.svg
      .append('image')
      .attr('href', '../../waterdroplet.png')
      .attr('width', vis.width / 3.0);

    vis.chart = vis.svg
      .append('g')
      .attr('id', 'tear-group')
      .attr('transform', `translate(-50, ${vis.height / 3})`);

    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    vis.meatWashData = vis.data;

    vis.meatWashReasons = Object.keys(vis.data[0]);

    // add legend
    vis.legend = vis.svg
      .append('g')
      .attr(
        'transform',
        `translate(${vis.config.legendPositionX}, ${vis.config.legendPositionY})`
      );

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

    vis.properNaming = (name) => {
      switch (name) {
        case 'Remove_pathogens':
          return 'Pathogens';
        case 'Remove_artificial_chemicals':
          return 'Artificial Chemicals';
        case 'Remove_debris':
          return 'Debris';
        case 'Remove_undesirable_flavors_or_odors':
          return 'Bad Flavours/Odors';
        case 'Remove_blood':
          return 'Blood';
        case 'Remove_slime':
          return 'Slime';
        case 'Remove_fat':
          return 'Fat';
        case 'Remove_meat_juice':
          return 'Meat Juices';
        default:
          return 'Name was mispelled';
      }
    };

    vis.meatWashCount = {};

    vis.data.forEach((item) => {
      for (const [key, value] of Object.entries(item)) {
        if (vis.meatWashCount[key]) {
          vis.meatWashCount[key] += value;
        } else {
          vis.meatWashCount[key] = value;
        }
      }
    });

    vis.array = [];

    for (const [key, value] of Object.entries(vis.meatWashCount)) {
      const obj = {};
      obj.removeObject = key;
      obj.count = value;
      vis.array.push(obj);
    }

    vis.renderVis();
  }

  renderVis() {
    const vis = this;

    vis.generateChart(vis.array, vis);
  }

  generateChart(data, vis) {
    const bubble = (data2) =>
      d3
        .pack()
        .size([vis.width / 2.5, vis.height / 2.5])
        .padding(2)(d3.hierarchy({ children: data2 }).sum((d) => d.count));

    const root = bubble(data);

    const node = vis.chart.selectAll().data(root.children).enter().append('g');

    const circle = node
      .append('circle')
      .style('stroke', 'white')
      .style('stroke-width', '5px')
      .style('fill', (d) => vis.colorScale(d.data.removeObject))
      .on('mouseover', function (event, d) {
        d3.select(this).style('stroke', '#222');

        d3
          .select('#tooltip')
          .style('display', 'block')
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY}px`).html(`
              <div class="tooltip-title">${vis.properNaming(
                d.data.removeObject
              )}</div>
              <div id='teardrop-tooltip-count'>${d.data.count} Claims</div>
            `);
      })
      .on('mouseout', function () {
        d3.select(this).style('stroke', 'white');
        d3.select('#tooltip').style('display', 'none');
      });

    const label = node
      .append('text')
      .attr('dy', '0.5em')
      .attr('font-size', '18px')
      .style('text-anchor', 'middle')
      .text((d) => d.data.count);

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

    label
      .transition()
      .delay(700)
      .ease(d3.easeExpInOut)
      .duration(1000)
      .style('opacity', 1);

    vis.legend
      .selectAll('.legenditems')
      .data(vis.meatWashReasons)
      .join('circle')
      .attr('r', 20)
      .attr('cy', (d, i) => 50 * i)
      .style('stroke', 'white')
      .style('stroke-width', '2px')
      .style('fill', (d) => vis.colorScale(d));

    vis.legend
      .selectAll('.legenditems')
      .data(vis.meatWashReasons)
      .join('text')
      .text((d) => vis.properNaming(d))
      .attr('dy', '1em')
      .attr('x', '2em')
      .attr('font-size', '20px')
      .attr('y', (d, i) => 50 * i - 12);
  }
}
