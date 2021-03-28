/*!
 * @license Open source under BSD 2-clause (http://choosealicense.com/licenses/bsd-2-clause/)
 * Copyright (c) 2015, Curtis Bratton
 * All rights reserved.
 *
 * Liquid Fill Gauge v1.1
 */
function liquidFillGaugeDefaultSettings() {
  return {
    minValue: 0, // The gauge minimum value.
    maxValue: 100, // The gauge maximum value.
    circleThickness: 0, // The outer circle thickness as a percentage of it's radius.
    circleFillGap: 0, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
    circleColor: '#178BCA', // The color of the outer circle.
    waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
    waveCount: 1, // The number of full waves per width of the wave circle.
    waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
    waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
    waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
    waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
    waveAnimate: true, // Controls if the wave scrolls or is static.
    waveColor: '#178BCA', // The color of the fill wave.
    waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
  };
}

function loadLiquidFillGauge(elementId, value, config) {
  if (config == null) config = liquidFillGaugeDefaultSettings();

  vis.paths = [
    {
      fill: 'black',
      d:
        'M51.2074 174.866C81.8865 176.965 109.076 154.133 111.896 123.903C113.106 110.7 103.806 93.1407 83.7064 71.9492C80.5862 68.5847 78.8348 64.4792 78.7066 60.2289L78.6566 55.0477C78.6032 52.9655 77.6013 50.9781 75.8539 49.4884C74.1066 47.9988 71.7446 47.1185 69.2469 47.0259L69.0469 25.5596C71.8312 24.9788 74.3768 23.7848 76.4167 22.1026C77.8294 20.8791 78.9382 19.4352 79.6794 17.8539C80.4206 16.2725 80.7797 14.5848 80.736 12.8875C80.6924 11.1903 80.2468 9.5169 79.4249 7.96344C78.603 6.40998 77.421 5.007 75.9467 3.835C73.1219 1.63168 69.427 0.365374 65.5588 0.274841C61.6905 0.184308 57.9161 1.2758 54.9473 3.34353C51.8692 1.05314 47.8368 -0.142188 43.7138 0.0135061C39.5907 0.1692 35.7047 1.66354 32.888 4.17653C26.9682 9.39109 27.8081 17.6544 34.0579 22.5941C35.898 23.9369 38.0844 24.9088 40.4477 25.4346L40.6577 47.1509C38.2693 47.3389 36.053 48.2681 34.4488 49.7541C32.8446 51.2401 31.9698 53.1743 31.998 55.1726V60.6038C32 65.0877 30.1697 69.4385 26.8082 72.9405C10.3987 89.7254 1.34893 104.286 0.278961 116.373C-1.19935 130.427 3.22969 144.472 12.8086 156.107C22.6883 167.219 36.2379 174 51.2074 174.866Z',
    },
  ];

  var gauge = d3.select('#fillgauge1');

  gauge
    .append('path')
    .attr('id', 'beef')
    .attr('d', vis.paths[0].d)
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-width', '10px');

  // Get bounding box
  var BBox = d3.select('#beef').node().getBBox();

  // Get radius = half of the width
  var radius = Math.max(parseInt(BBox.width), parseInt(BBox.height)) / 2;

  // This is basically vis.BBox.x, top left x of bound box
  var locationX = parseInt(BBox.width) / 2 - radius + BBox.x;
  // This is top left y of bounding box, plus height/2 - width/2
  var locationY = parseInt(BBox.height) / 2 - radius + BBox.y;
  var fillPercent =
    Math.max(config.minValue, Math.min(config.maxValue, value)) /
    config.maxValue;

  var waveHeightScale;
  if (config.waveHeightScaling) {
    waveHeightScale = d3
      .scaleLinear()
      .range([0, config.waveHeight, 0])
      .domain([0, 50, 100]);
  } else {
    waveHeightScale = d3
      .scaleLinear()
      .range([config.waveHeight, config.waveHeight])
      .domain([0, 100]);
  }

  var circleThickness = config.circleThickness * radius;
  var circleFillGap = config.circleFillGap * radius;
  var fillCircleMargin = circleThickness + circleFillGap;
  var fillCircleRadius = radius - fillCircleMargin;
  var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

  var waveLength = (fillCircleRadius * 2) / config.waveCount;
  var waveClipCount = 1 + config.waveCount;
  var waveClipWidth = waveLength * waveClipCount;

  // Data for building the clip wave area.
  var data = [];
  for (var i = 0; i <= 40 * waveClipCount; i++) {
    data.push({ x: i / (40 * waveClipCount), y: i / 40 });
  }

  // Scales for controlling the size of the clipping path.
  var waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  var waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);

  // Scales for controlling the position of the clipping path.
  var waveRiseScale = d3
    .scaleLinear()
    // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
    // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
    // circle at 100%.
    .range([
      fillCircleMargin + fillCircleRadius * 2 + waveHeight,
      fillCircleMargin - waveHeight,
    ])
    .domain([0, 1]);
  var waveAnimateScale = d3
    .scaleLinear()
    .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
    .domain([0, 1]);

  // Center the gauge within the parent SVG.
  var gaugeGroup = gauge
    .append('g')
    .attr('transform', 'translate(' + locationX + ',' + locationY + ')');

  // The clipping wave area.
  var clipArea = d3
    .area()
    .x(function (d) {
      return waveScaleX(d.x);
    })
    .y0(function (d) {
      return waveScaleY(
        Math.sin(
          Math.PI * 2 * config.waveOffset * -1 +
            Math.PI * 2 * (1 - config.waveCount) +
            d.y * 2 * Math.PI
        )
      );
    })
    .y1(function (d) {
      return fillCircleRadius * 2 + waveHeight;
    });
  var waveGroup = gaugeGroup
    .append('defs')
    .append('clipPath')
    .attr('id', 'clipWave' + elementId);
  var wave = waveGroup
    .append('path')
    .datum(data)
    .attr('d', clipArea)
    .attr('T', 0);

  // The inner circle with the clipping wave attached.
  var fillCircleGroup = gaugeGroup
    .append('g')
    .attr('clip-path', 'url(#clipWave' + elementId + ')');

  fillCircleGroup
    .append('path')
    .attr('transform', 'translate(' + -locationX + ',' + -locationY + ')')
    .attr('id', 'beef')
    .attr('d', vis.paths[0].d)
    .style('fill', config.waveColor)
    .style('stroke', 'black')
    .style('stroke-width', '10px');

  // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
  var waveGroupXPosition =
    fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
  if (config.waveRise) {
    waveGroup
      .attr(
        'transform',
        'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')'
      )
      .transition()
      .duration(config.waveRiseTime)
      .attr(
        'transform',
        'translate(' +
          waveGroupXPosition +
          ',' +
          waveRiseScale(fillPercent) +
          ')'
      )
      .on('start', function () {
        wave.attr('transform', 'translate(1,0)');
      }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
  } else {
    waveGroup.attr(
      'transform',
      'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')'
    );
  }

  if (config.waveAnimate) animateWave();

  function animateWave() {
    wave.attr(
      'transform',
      'translate(' + waveAnimateScale(wave.attr('T')) + ',0)'
    );
    wave
      .transition()
      .duration(config.waveAnimateTime * (1 - wave.attr('T')))
      .ease(d3.easeLinear)
      .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
      .attr('T', 1)
      .on('end', function () {
        wave.attr('T', 0);
        animateWave(config.waveAnimateTime);
      });
  }

  function GaugeUpdater() {
    this.update = function (value) {
      var fillPercent =
        Math.max(config.minValue, Math.min(config.maxValue, value)) /
        config.maxValue;
      var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
      var waveRiseScale = d3.scale
        .linear()
        // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
        // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.
        .range([
          fillCircleMargin + fillCircleRadius * 2 + waveHeight,
          fillCircleMargin - waveHeight,
        ])
        .domain([0, 1]);
      var newHeight = waveRiseScale(fillPercent);
      var waveScaleX = d3.scale
        .linear()
        .range([0, waveClipWidth])
        .domain([0, 1]);
      var waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);
      var newClipArea;
      if (config.waveHeightScaling) {
        newClipArea = d3.svg
          .area()
          .x(function (d) {
            return waveScaleX(d.x);
          })
          .y0(function (d) {
            return waveScaleY(
              Math.sin(
                Math.PI * 2 * config.waveOffset * -1 +
                  Math.PI * 2 * (1 - config.waveCount) +
                  d.y * 2 * Math.PI
              )
            );
          })
          .y1(function (d) {
            return fillCircleRadius * 2 + waveHeight;
          });
      } else {
        newClipArea = clipArea;
      }

      var newWavePosition = config.waveAnimate ? waveAnimateScale(1) : 0;
      wave
        .transition()
        .duration(0)
        .transition()
        .duration(
          config.waveAnimate
            ? config.waveAnimateTime * (1 - wave.attr('T'))
            : config.waveRiseTime
        )
        .ease('linear')
        .attr('d', newClipArea)
        .attr('transform', 'translate(' + newWavePosition + ',0)')
        .attr('T', '1')
        .each('end', function () {
          if (config.waveAnimate) {
            wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
            animateWave(config.waveAnimateTime);
          }
        });
      waveGroup
        .transition()
        .duration(config.waveRiseTime)
        .attr(
          'transform',
          'translate(' + waveGroupXPosition + ',' + newHeight + ')'
        );
    };
  }

  return new GaugeUpdater();
}
