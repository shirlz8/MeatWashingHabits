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
    textVertPosition: 0.5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
    textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
    valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
    displayPercent: true, // If true, a % symbol is displayed after the value.
  };
}

function loadLiquidFillGauge(elementId, value, config) {
  if (config == null) config = liquidFillGaugeDefaultSettings();

  vis.paths = [
    {
      fill: 'black',
      d:
        'M143.97 281.595C181.901 288.306 216.914 257.382 222.133 212.56C224.381 192.982 213.78 165.722 190.12 131.686C186.412 126.344 184.575 120.068 184.586 113.596L184.819 105.85C184.83 99.3774 180.031 93.5627 173.607 92.7738L174.574 60.6834C178.092 60.0895 181.265 58.7232 183.914 56.3831C191.496 49.328 191.862 37.1558 184.369 29.0533C177.411 21.5559 166.032 20.1162 158.306 25.863C150.624 17.9277 138.477 17.5255 130.896 24.5806C123.314 31.6356 123.861 44.0786 131.354 52.1811C133.681 54.4343 136.208 56.1516 139.125 57.1656L138.147 89.6248C132.068 89.6081 127.137 94.323 126.948 100.594L126.703 108.708C126.503 115.348 123.921 121.578 119.534 126.529C98.2043 149.677 86.1592 170.369 84.1451 188.304C81.4966 208.955 86.185 230.665 97.4195 249.106C109.044 266.844 125.455 278.56 143.97 281.595Z',
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

  var textPixels = (config.textSize * radius) / 2;
  var textFinalValue = parseFloat(value).toFixed(2);
  var textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
  var percentText = config.displayPercent ? '%' : '';
  var circleThickness = config.circleThickness * radius;
  var circleFillGap = config.circleFillGap * radius;
  var fillCircleMargin = circleThickness + circleFillGap;
  var fillCircleRadius = radius - fillCircleMargin;
  var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

  var waveLength = (fillCircleRadius * 2) / config.waveCount;
  var waveClipCount = 1 + config.waveCount;
  var waveClipWidth = waveLength * waveClipCount;

  // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
  var textRounder = function (value) {
    return Math.round(value);
  };
  if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
    textRounder = function (value) {
      return parseFloat(value).toFixed(1);
    };
  }
  if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
    textRounder = function (value) {
      return parseFloat(value).toFixed(2);
    };
  }

  // Data for building the clip wave area.
  var data = [];
  for (var i = 0; i <= 40 * waveClipCount; i++) {
    data.push({ x: i / (40 * waveClipCount), y: i / 40 });
  }

  // Scales for drawing the outer circle.
  var gaugeCircleX = d3
    .scaleLinear()
    .range([0, 2 * Math.PI])
    .domain([0, 1]);
  var gaugeCircleY = d3.scaleLinear().range([0, radius]).domain([0, radius]);

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

  // Scale for controlling the position of the text within the gauge.
  var textRiseScaleY = d3
    .scaleLinear()
    .range([
      fillCircleMargin + fillCircleRadius * 2,
      fillCircleMargin + textPixels * 0.7,
    ])
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
