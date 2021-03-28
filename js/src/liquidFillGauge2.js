class LiquidFillGauge {
  /**
   * Class constructor with initial configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, meatType, svg) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 500,
      containerHeight: 550,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    };

    this.meatType = meatType;
    this.svg = svg;
    this.data = _data;

    this.initVis();
  }

  liquidFillGaugeDefaultSettings() {
    return {
      minValue: 0, // The gauge minimum value.
      maxValue: 100, // The gauge maximum value.
      circleThickness: 0, // The outer circle thickness as a percentage of it's radius.
      circleFillGap: 0, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
      circleColor: '#178BCA', // The color of the outer circle.
      waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
      waveCount: 3, // The number of full waves per width of the wave circle.
      waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
      waveAnimateTime: 1000, // The amount of time in milliseconds for a full wave to enter the wave circle.
      waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
      waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
      waveAnimate: true, // Controls if the wave scrolls or is static.
      waveColor: '#178BCA', // The color of the fill wave.
      waveOffset: 0.25, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
    };
  }

  calculatePercentage() {
    // Using vis.meatType do roll up and return percentage as number
    const vis = this;
    vis.data;

    let sum = d3.sum(vis.data, (d) => d[vis.meatType]);

    let count = d3.count(vis.data, (d) => d[vis.meatType]);

    let percent = (sum / count) * 100;
    console.log(sum);
    console.log(percent);

    vis.fillPercent =
      Math.max(vis.config.minValue, Math.min(vis.config.maxValue, percent)) /
      vis.config.maxValue;
  }

  /**
   * We initialize the arc generator, scales, axes, and append static elements
   */
  initVis() {
    const vis = this;
    vis.config = this.liquidFillGaugeDefaultSettings();
    vis.value = 20;
    let elementId = 1;

    vis.gauge = d3.select('#fillgauge1');

    vis.gauge
      .append('path')
      .attr('id', 'svg')
      .attr('d', vis.svg)
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '10px');

    // Get bounding box
    vis.BBox = d3.select('#svg').node().getBBox();

    // Get radius = half of the width
    vis.radius =
      Math.max(parseInt(vis.BBox.width), parseInt(vis.BBox.height)) / 2;

    // This is basically vis.BBox.x, top left x of bound box
    vis.locationX = parseInt(vis.BBox.width) / 2 - vis.radius + vis.BBox.x;
    // This is top left y of bounding box, plus height/2 - width/2
    vis.locationY = parseInt(vis.BBox.height) / 2 - vis.radius + vis.BBox.y;

    vis.calculatePercentage();

    vis.waveHeightScale;
    if (vis.config.waveHeightScaling) {
      vis.waveHeightScale = d3
        .scaleLinear()
        .range([0, vis.config.waveHeight, 0])
        .domain([0, 50, 100]);
    } else {
      vis.waveHeightScale = d3
        .scaleLinear()
        .range([vis.config.waveHeight, vis.config.waveHeight])
        .domain([0, 100]);
    }

    vis.circleThickness = vis.config.circleThickness * vis.radius;
    vis.circleFillGap = vis.config.circleFillGap * vis.radius;
    vis.fillCircleMargin = vis.circleThickness + vis.circleFillGap;
    vis.fillCircleRadius = vis.radius - vis.fillCircleMargin;
    vis.waveHeight =
      vis.fillCircleRadius * vis.waveHeightScale(vis.fillPercent * 100);

    vis.waveLength = (vis.fillCircleRadius * 2) / vis.config.waveCount;
    vis.waveClipCount = 1 + vis.config.waveCount;
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
            Math.PI * 2 * vis.config.waveOffset * -1 +
              Math.PI * 2 * (1 - vis.config.waveCount) +
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
      .attr('id', 'clipWave' + elementId);
    vis.wave = vis.waveGroup
      .append('path')
      .datum(vis.data)
      .attr('d', vis.clipArea)
      .attr('T', 0);

    // The inner circle with the clipping wave attached.
    vis.fillCircleGroup = vis.gaugeGroup
      .append('g')
      .attr('clip-path', 'url(#clipWave' + elementId + ')');

    vis.fillCircleGroup
      .append('path')
      .attr(
        'transform',
        'translate(' + -vis.locationX + ',' + -vis.locationY + ')'
      )
      .attr('id', 'svg')
      .attr('d', vis.svg)
      .style('fill', vis.config.waveColor)
      .style('stroke', 'black')
      .style('stroke-width', '10px');

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    vis.waveGroupXPosition =
      vis.fillCircleMargin + vis.fillCircleRadius * 2 - vis.waveClipWidth;
    if (vis.config.waveRise) {
      vis.waveGroup
        .attr(
          'transform',
          'translate(' +
            vis.waveGroupXPosition +
            ',' +
            vis.waveRiseScale(0) +
            ')'
        )
        .transition()
        .duration(vis.config.waveRiseTime)
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
    } else {
      vis.waveGroup.attr(
        'transform',
        'translate(' +
          vis.waveGroupXPosition +
          ',' +
          waveRiseScale(fillPercent) +
          ')'
      );
    }

    vis.animateWave = () => {
      vis.wave.attr(
        'transform',
        'translate(' + vis.waveAnimateScale(vis.wave.attr('T')) + ',0)'
      );
      vis.wave
        .transition()
        .duration(vis.config.waveAnimateTime * (1 - vis.wave.attr('T')))
        .ease(d3.easeLinear)
        .attr('transform', 'translate(' + vis.waveAnimateScale(1) + ',0)')
        .attr('T', 1)
        .on('end', function () {
          vis.wave.attr('T', 0);
          vis.animateWave(vis.config.waveAnimateTime);
        });
    };

    if (vis.config.waveAnimate) {
      vis.animateWave();
    }
  }

  updateVis() {
    const vis = this;

    vis.calculatePercentage();
    console.log(vis);

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

    if (vis.config.waveHeightScaling) {
      vis.newClipArea = d3
        .area()
        .x(function (d) {
          return vis.waveScaleX(d.x);
        })
        .y0(function (d) {
          return vis.waveScaleY(
            Math.sin(
              Math.PI * 2 * vis.config.waveOffset * -1 +
                Math.PI * 2 * (1 - vis.config.waveCount) +
                d.y * 2 * Math.PI
            )
          );
        })
        .y1(function (d) {
          return vis.fillCircleRadius * 2 + vis.waveHeight;
        });
    }

    vis.newWavePosition = vis.config.waveAnimate ? vis.waveAnimateScale(1) : 0;
    vis.wave
      .transition()
      .duration(0)
      .transition()
      .duration(
        vis.config.waveAnimate
          ? vis.config.waveAnimateTime * (1 - vis.wave.attr('T'))
          : vis.config.waveRiseTime
      )
      .ease(d3.easeLinear)
      .attr('d', vis.newClipArea)
      .attr('transform', 'translate(' + vis.newWavePosition + ',0)')
      .attr('T', '1')
      .on('end', function () {
        if (vis.config.waveAnimate) {
          vis.wave.attr(
            'transform',
            'translate(' + vis.waveAnimateScale(0) + ',0)'
          );
          vis.animateWave(vis.config.waveAnimateTime);
        }
      });
    vis.waveGroup
      .transition()
      .duration(vis.config.waveRiseTime)
      .attr(
        'transform',
        'translate(' + vis.waveGroupXPosition + ',' + vis.newHeight + ')'
      );
  }
}
