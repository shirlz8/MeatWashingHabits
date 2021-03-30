class LiquidFillGauge {
  /**
   * Class constructor with initial configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _dispatcher, _data, meatType, svgString) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 250,
      containerHeight: 250,
      margin: {
        x: 35,
        y: 35,
      },
    };

    this.meatType = meatType;
    this.svgString = svgString;
    this.data = _data;
    this.dispatcher = _dispatcher;
    this.initVis();
  }

  waveColor(meatType) {
    const vis = this;

    const color = d3
      .scaleOrdinal()
      .domain(['Beef', 'Pork', 'Poultry', 'Sheep_Goat', 'Ground_Meat', 'Fish'])
      .range([
        '#C1504F',
        '#FF9797',
        '#FDD02F',
        '#2A7A23',
        '#FF61EF',
        '#4E81BE',
      ]);
    return color(meatType);
  }

  liquidFillGaugeDefaultSettings() {
    const vis = this;

    return {
      minValue: 0, // The gauge minimum value.
      maxValue: 100, // The gauge maximum value.
      circleThickness: 0, // The outer circle thickness as a percentage of it's radius.
      circleFillGap: 0, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
      waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
      waveCount: 3, // The number of full waves per width of the wave circle.
      waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
      waveAnimateTime: 1000, // The amount of time in milliseconds for a full wave to enter the wave circle.
      waveColor: this.waveColor(vis.meatType), // The color of the fill wave.
      waveOffset: 0.25, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
      inactiveWaveColor: 'lightgrey',
      active: false,
    };
  }

  calculatePercentage() {
    // Using vis.meatType do roll up and return percentage as number
    const vis = this;
    let sum = d3.sum(vis.data, (d) => d[vis.meatType]);

    let count = d3.count(vis.data, (d) => d[vis.meatType]);

    vis.percent = Math.round((sum / count) * 100);
    console.log(vis.percent);

    vis.fillPercent =
      Math.max(
        vis.settings.minValue,
        Math.min(vis.settings.maxValue, vis.percent)
      ) / vis.settings.maxValue;
  }

  /**
   * We initialize the arc generator, scales, axes, and append static elements
   */
  initVis() {
    const vis = this;
    vis.settings = this.liquidFillGaugeDefaultSettings();

    vis.meatName;
    switch (vis.meatType) {
      case 'Sheep_Goat':
        vis.meatName = 'Sheep';
        break;
      case 'Wash_Any':
        vis.meatName = 'Any Meat Type';
        break;
      default:
        vis.meatName = vis.meatType;
    }

    vis.gauge = d3
      .select(vis.config.parentElement)
      .append('svg')
      .attr('class', 'liquid-container')
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight)
      .on('click', function (event, d) {
        if (meatTypeFilter === vis.meatType) {
          meatTypeFilter = '';
        } else {
          meatTypeFilter = vis.meatType;
        }
        vis.dispatcher.call('filterMeatType', event, meatTypeFilter);
      });

    vis.gauge
      .append('path')
      .attr(
        'transform',
        'translate(' + vis.config.margin.x + ',' + vis.config.margin.y + ')'
      )
      .attr('id', 'outline')
      .attr('d', vis.svgString)
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '5px');

    vis.gauge
      .append('text')
      .attr('class', "title")
      .attr('dy', '1.2em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-size', '16px')
      .text(vis.meatName)
      .attr('transform', 'translate(120,0)');

    // Get bounding box
    vis.BBox = d3.select('#outline').node().getBBox();

    // Get radius = half of the width
    vis.radius =
      Math.max(parseInt(vis.BBox.width), parseInt(vis.BBox.height)) / 2;

    // This is basically vis.BBox.x, top left x of bound box
    vis.locationX = parseInt(vis.BBox.width) / 2 - vis.radius + vis.BBox.x;
    // This is top left y of bounding box, plus height/2 - width/2
    vis.locationY = parseInt(vis.BBox.height) / 2 - vis.radius + vis.BBox.y;

    vis.calculatePercentage();

    vis.gauge
      .append('text')
      .attr('class', `percent${vis.meatType}`)
      .attr('dy', '1.2em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-size', '16px')
      .text(vis.percent + '%')
      .attr('transform', 'translate(120,225)');

    vis.waveHeightScale = d3
      .scaleLinear()
      .range([0, vis.settings.waveHeight, 0])
      .domain([0, 50, 100]);

    vis.circleThickness = vis.settings.circleThickness * vis.radius;
    vis.circleFillGap = vis.settings.circleFillGap * vis.radius;
    vis.fillCircleMargin = vis.circleThickness + vis.circleFillGap;
    vis.fillCircleRadius = vis.radius - vis.fillCircleMargin;
    vis.waveHeight =
      vis.fillCircleRadius * vis.waveHeightScale(vis.fillPercent * 100);

    vis.waveLength = (vis.fillCircleRadius * 2) / vis.settings.waveCount;
    vis.waveClipCount = 1 + vis.settings.waveCount;
    vis.waveClipWidth = vis.waveLength * vis.waveClipCount;

    // Data for building the clip wave area.
    vis.data = [];
    for (let i = 0; i <= 40 * vis.waveClipCount; i++) {
      vis.data.push({ x: i / (40 * vis.waveClipCount), y: i / 40 });
    }

    // Scales for controlling the size of the clipping path.
    vis.waveScaleX = d3
      .scaleLinear()
      .range([0, vis.waveClipWidth])
      .domain([0, 1]);
    vis.waveScaleY = d3.scaleLinear().range([0, vis.waveHeight]).domain([0, 1]);

    // Scales for controlling the position of the clipping path.
    vis.waveRiseScale = d3
      .scaleLinear()
      // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
      // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
      // circle at 100%.
      .range([
        vis.fillCircleMargin + vis.fillCircleRadius * 2 + vis.waveHeight,
        vis.fillCircleMargin - vis.waveHeight,
      ])
      .domain([0, 1]);

    vis.waveAnimateScale = d3
      .scaleLinear()
      .range([0, vis.waveClipWidth - vis.fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
      .domain([0, 1]);

    // Center the gauge within the parent SVG.
    vis.gaugeGroup = vis.gauge
      .append('g')
      .attr(
        'transform',
        'translate(' + vis.locationX + ',' + vis.locationY + ')'
      );

    // The clipping wave area.
    vis.clipArea = d3
      .area()
      .x(function (d) {
        return vis.waveScaleX(d.x);
      })
      .y0(function (d) {
        return vis.waveScaleY(
          Math.sin(
            Math.PI * 2 * vis.settings.waveOffset * -1 +
              Math.PI * 2 * (1 - vis.settings.waveCount) +
              d.y * 2 * Math.PI
          )
        );
      })
      .y1(function (d) {
        return vis.fillCircleRadius * 2 + vis.waveHeight;
      });
    vis.waveGroup = vis.gaugeGroup
      .append('defs')
      .append('clipPath')
      .attr('id', 'clipWave' + vis.meatType);
    vis.wave = vis.waveGroup
      .append('path')
      .datum(vis.data)
      .attr('d', vis.clipArea)
      .attr('T', 0);

    // The inner circle with the clipping wave attached.
    vis.fillCircleGroup = vis.gaugeGroup
      .append('g')
      .attr(
        'transform',
        'translate(' + vis.config.margin.x + ',' + vis.config.margin.y + ')'
      ) // applying adjustment again
      .attr('clip-path', 'url(#clipWave' + vis.meatType + ')');

    vis.fillCircleGroup
      .append('path')
      .attr(
        'transform',
        'translate(' + -vis.locationX + ',' + -vis.locationY + ')'
      )
      .attr('id', 'outline')
      .attr('d', vis.svgString)
      .style('fill', vis.settings.waveColor)
      .style('stroke', 'black')
      .style('stroke-width', '5px');

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    vis.waveGroupXPosition =
      vis.fillCircleMargin + vis.fillCircleRadius * 2 - vis.waveClipWidth;

    vis.waveGroup
      .attr(
        'transform',
        'translate(' + vis.waveGroupXPosition + ',' + vis.waveRiseScale(0) + ')'
      )
      .transition()
      .duration(vis.settings.waveRiseTime)
      .attr(
        'transform',
        'translate(' +
          vis.waveGroupXPosition +
          ',' +
          vis.waveRiseScale(vis.fillPercent) +
          ')'
      )
      .on('start', function () {
        vis.wave.attr('transform', 'translate(1,0)');
      }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.

    vis.animateWave = () => {
      console.log('animating');
      if (vis.waveActive) {
        vis.wave.attr(
          'transform',
          'translate(' + vis.waveAnimateScale(vis.wave.attr('T')) + ',0)'
        );
        vis.wave
          .transition()
          .duration(vis.settings.waveAnimateTime * (1 - vis.wave.attr('T')))
          .ease(d3.easeLinear)
          .attr('transform', 'translate(' + vis.waveAnimateScale(1) + ',0)')
          .attr('T', 1)
          .on('end', function () {
            vis.wave.attr('T', 0);
            vis.animateWave(vis.settings.waveAnimateTime);
          });
      }
    };

    vis.animateWave();

    vis.gauge
      .on('mouseover', (event, d) => {
        console.log('hover');
        vis.waveActive = true;
        vis.animateWave();
        // vis.fillCircleGroup.style('fill', vis.settings.inactiveWaveColor);
        let x = d3.select(event.currentTarget);
        console.log(x);
        x.style('fill', 'lightgrey');
        // d3.select('outline').style('fill', vis.settings.inactiveWaveColor);
        // console.log('hover');
        // d3
        // updateVis();
      })
      .on('mouseleave', (event, d) => {
        console.log('eave');
        vis.waveActive = false;
        // vis.updateVis();
      });
  }

  updateVis() {
    const vis = this;

    vis.calculatePercentage();

    d3.selectAll(`text.percent${vis.meatType}`)
        .text(vis.percent + "%");

    // The inner circle with the clipping wave attached.
    vis.fillCircleGroup = vis.gaugeGroup
      .append('g')
      .attr(
        'transform',
        'translate(' + vis.config.margin.x + ',' + vis.config.margin.y + ')'
      ) // applying adjustment again
      .attr('clip-path', 'url(#clipWave' + vis.meatType + ')');

    vis.fillCircleGroup
      .append('path')
      .attr(
        'transform',
        'translate(' + -vis.locationX + ',' + -vis.locationY + ')'
      )
      .attr('id', 'outline')
      .attr('d', vis.svgString)
      .style('fill', vis.settings.waveColor)
      .style('stroke', 'black')
      .style('stroke-width', '5px');

    vis.waveHeight =
      vis.fillCircleRadius * vis.waveHeightScale(vis.fillPercent * 100);

    vis.waveRiseScale = d3
      .scaleLinear()
      // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
      // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
      // circle at 100%.
      .range([
        vis.fillCircleMargin + vis.fillCircleRadius * 2 + vis.waveHeight,
        vis.fillCircleMargin - vis.waveHeight,
      ])
      .domain([0, 1]);

    vis.newHeight = vis.waveRiseScale(vis.fillPercent);

    vis.waveScaleX = d3
      .scaleLinear()
      .range([0, vis.waveClipWidth])
      .domain([0, 1]);
    vis.waveScaleY = d3.scaleLinear().range([0, vis.waveHeight]).domain([0, 1]);

    vis.newClipArea;

    vis.newClipArea = d3
      .area()
      .x(function (d) {
        return vis.waveScaleX(d.x);
      })
      .y0(function (d) {
        return vis.waveScaleY(
          Math.sin(
            Math.PI * 2 * vis.settings.waveOffset * -1 +
              Math.PI * 2 * (1 - vis.settings.waveCount) +
              d.y * 2 * Math.PI
          )
        );
      })
      .y1(function (d) {
        return vis.fillCircleRadius * 2 + vis.waveHeight;
      });

    vis.newWavePosition = vis.waveAnimateScale(1);
    vis.wave
      .transition()
      .duration(0)
      .transition()
      .duration(vis.settings.waveAnimateTime * (1 - vis.wave.attr('T')))
      .ease(d3.easeLinear)
      .attr('d', vis.newClipArea)
      .attr('transform', 'translate(' + vis.newWavePosition + ',0)')
      .attr('T', '1')
      .on('end', function () {
        vis.wave.attr(
          'transform',
          'translate(' + vis.waveAnimateScale(0) + ',0)'
        );
        vis.animateWave(vis.settings.waveAnimateTime);
      });
    vis.waveGroup
      .transition()
      .duration(vis.settings.waveRiseTime)
      .attr(
        'transform',
        'translate(' + vis.waveGroupXPosition + ',' + vis.newHeight + ')'
      );

    vis.animateWave();
  }
}
