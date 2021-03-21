/*!
 * @license Open source under BSD 2-clause (http://choosealicense.com/licenses/bsd-2-clause/)
 * Copyright (c) 2015, Curtis Bratton
 * All rights reserved.
 *
 * Liquid Fill Gauge v1.1
 */

let paths = [
  {
    stroke: 'blue',
    fill: 'black',
    d:
      'M151.319 294.971C191.033 299.249 227.502 264.585 232.735 217.586C234.988 197.058 223.761 169.456 198.839 135.734C194.933 130.441 192.979 124.043 192.958 117.309L193.163 109.234C193.142 102.5 188.092 96.7933 181.368 96.4302L182.217 62.9781C185.895 62.1095 189.207 60.4622 191.967 57.839C199.862 49.9596 200.184 37.2708 192.305 29.3757C184.987 22.0719 173.077 21.3848 165.024 27.9136C156.948 20.2059 144.239 20.6528 136.344 28.5322C128.449 36.4116 129.083 49.317 136.963 57.2122C139.408 59.3904 142.061 60.9968 145.117 61.8439L144.258 95.6805C137.899 96.0962 132.764 101.352 132.598 107.889L132.383 116.348C132.208 123.269 129.538 129.935 124.974 135.398C102.778 160.998 90.2824 183.381 88.2661 202.183C85.5998 223.854 90.6139 246.105 102.459 264.489C114.709 282.114 131.936 293.132 151.319 294.971ZM153.664 58.598C153.526 56.4784 152.224 54.7139 150.114 54.468C143.4 53.7204 138.745 47.6385 139.68 41.1214C140.615 34.6043 146.509 29.7521 153.026 30.6871C155.708 31.1399 158.37 32.3618 160.244 34.3331C160.806 34.9245 161.368 35.5159 161.733 36.2947C162.838 38.2465 165.323 38.8867 167.472 37.5946C167.669 37.4073 167.866 37.2199 168.063 37.0325C168.26 36.8451 168.457 36.6578 168.654 36.4704C169.059 35.7111 169.65 35.149 170.241 34.5869C174.973 30.0899 182.663 30.2852 187.16 35.0164C191.657 39.7476 191.461 47.4378 186.73 51.9347C184.562 53.9958 181.644 55.2684 178.568 55.1903C176.261 55.1317 174.486 56.8181 174.428 59.1252L173.491 96.0379L152.727 95.5108L153.664 58.598ZM109.695 259.863C98.9638 243.046 94.0882 222.915 96.7057 203.167C98.6733 186.287 110.568 164.851 131.571 140.76C137.318 134.172 140.618 125.407 140.843 116.563L141.057 108.104C141.116 105.797 143.284 103.736 145.591 103.794L180.966 104.692C183.273 104.751 185.334 106.919 185.276 109.226L185.071 117.301C184.856 125.76 187.343 133.903 192.363 140.764C215.609 172.327 226.865 198.776 224.868 216.809C222.822 236.764 214.072 255.587 199.671 269.65C186.661 282.017 169.941 288.903 152.49 286.728C135.039 284.554 120.071 275.517 109.695 259.863Z',
    d2:
      'M22.6948 239.31C11.9638 222.493 7.08825 202.362 9.70574 182.613C11.6733 165.734 23.5677 144.297 44.5714 120.206C50.3175 113.619 53.6181 104.853 53.8426 96.0095L54.0573 87.5504C54.1159 85.2433 63.4203 74.8988 65.7273 74.9573L76.109 75.2209L86.4907 75.4844L91.5675 79.5C93.8746 79.5586 98.3343 86.3659 98.2757 88.6729L98.0708 96.7476C97.856 105.207 100.343 113.35 105.363 120.21C128.609 151.773 139.865 178.222 137.868 196.255C135.822 216.211 127.072 235.034 112.671 249.097C99.6606 261.463 82.9413 268.349 65.4901 266.175C48.039 264 33.0705 254.963 22.6948 239.31Z',
  },
];

function liquidFillGaugeDefaultSettings() {
  return {
    minValue: 0, // The gauge minimum value.
    maxValue: 100, // The gauge maximum value.
    circleThickness: 0.0, // The outer circle thickness as a percentage of it's radius.
    circleFillGap: 0.0, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
    circleColor: '#178BCA', // The color of the outer circle.
    waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
    waveCount: 1, // The number of full waves per width of the wave circle.
    waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
    waveAnimateTime: 1800, // The amount of time in milliseconds for a full wave to enter the wave circle.
    waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
    waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
    waveAnimate: true, // Controls if the wave scrolls or is static.
    waveColor: '#178BCA', // The color of the fill wave.
    waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
    textVertPosition: 0.5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
    textSize: 2, // The relative height of the text to display in the wave circle. 1 = 50%
    valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
    displayPercent: false, // If true, a % symbol is displayed after the value.
    textColor: '#045681', // The color of the value text when the wave does not overlap it.
    waveTextColor: '#A4DBf8', // The color of the value text when the wave overlaps it.
  };
}

function loadLiquidFillGauge(elementId, value, config) {
  if (config == null) config = liquidFillGaugeDefaultSettings();

  // d3.xml('svgs/beef.svg').then((data) => {
  //   let x = d3.select('#test').node().append(data.documentElement);
  //   console.log(x);
  // });
  var gauge = d3.select('#fillgauge1');

  gauge
    .append('svg')
    .append('path')
    .attr('id', 'beef')
    .attr('d', paths[0].d)
    .style('fill', paths[0].fill)
    .style('stroke', paths[0].stroke);

  let BBox = d3.select('#beef').node().getBBox();

  var radius = Math.min(parseInt(BBox.width), parseInt(BBox.height)) / 2;
  var locationX = parseInt(BBox.width) / 2 - radius + BBox.x;
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
  // var gaugeCircleX = d3
  //   .scaleLinear()
  //   .range([0, 2 * Math.PI])
  //   .domain([0, 1]);
  // var gaugeCircleY = d3.scaleLinear().range([0, radius]).domain([0, radius]);

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

  // Draw the outer circle.
  // var gaugeCircleArc = d3
  //   .arc()
  //   .startAngle(gaugeCircleX(0))
  //   .endAngle(gaugeCircleX(1))
  //   .outerRadius(gaugeCircleY(radius))
  //   .innerRadius(gaugeCircleY(radius - circleThickness));
  // gaugeGroup
  //   .append('path')
  //   .attr('d', gaugeCircleArc)
  //   .style('fill', config.circleColor)
  //   .attr('transform', 'translate(' + radius + ',' + radius + ')');

  // d3.xml('svgs/beef.svg').then((data) => {
  //   d3.select('#test').node().append(data.documentElement);
  // });

  // Text where the wave does not overlap.
  var text1 = gaugeGroup
    .append('text')
    .text(textRounder(textStartValue) + percentText)
    .attr('class', 'liquidFillGaugeText')
    .attr('text-anchor', 'middle')
    .attr('font-size', textPixels + 'px')
    .style('fill', config.textColor)
    .attr(
      'transform',
      'translate(' +
        radius +
        ',' +
        textRiseScaleY(config.textVertPosition) +
        ')'
    );

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
    .attr('id', 'clipWave' + elementId)
    .attr('class', 'waveeee');
  var wave = waveGroup
    .append('path')
    .datum(data)
    .attr('d', clipArea)
    .attr('T', 0);

  // The inner circle with the clipping wave attached.
  var fillCircleGroup = gaugeGroup
    .append('g')
    .attr('clip-path', 'url(#clipWave' + elementId + ')');
  // fillCircleGroup
  //   .append('circle')
  //   .attr('cx', radius)
  //   .attr('cy', radius)
  //   .attr('r', fillCircleRadius)
  //   .style('fill', config.waveColor);

  // fillCircleGroup.append(function () {
  //   var shape = d3.select('#beef');
  //   console.log(shape);
  //   shape
  //     .attr('transform', 'translate(' + -locationX + ',' + -locationY + ')')
  //     .style('fill', config.waveColor);
  //   console.log(shape.node());
  //   return shape.node();
  // });

  // Text where the wave does overlap.
  var text2 = fillCircleGroup
    .append('text')
    .text(textRounder(textStartValue) + percentText)
    .attr('class', 'liquidFillGaugeText')
    .attr('text-anchor', 'middle')
    .attr('font-size', textPixels + 'px')
    .style('fill', config.waveTextColor)
    .attr(
      'transform',
      'translate(' +
        radius +
        ',' +
        textRiseScaleY(config.textVertPosition) +
        ')'
    );

  // Make the value count up.
  if (config.valueCountUp) {
    var textTween = function () {
      var i = d3.interpolate(this.textContent, textFinalValue);
      return function (t) {
        this.textContent = textRounder(i(t)) + percentText;
      };
    };
    text1.transition().duration(config.waveRiseTime).tween('text', textTween);
    text2.transition().duration(config.waveRiseTime).tween('text', textTween);
  }

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
      .each('start', function () {
        wave.attr('transform', 'translate(1,0)');
      }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
  } else {
    waveGroup.attr(
      'transform',
      'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')'
    );
  }

  // if (config.waveAnimate) animateWave();

  function animateWave() {
    try {
      wave.attr(
        'transform',
        'translate(' + waveAnimateScale(wave.attr('T')) + ',0)'
      );
      wave
        .transition()
        .duration(config.waveAnimateTime * (1 - wave.attr('T')))
        .ease('linear')
        .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
        .attr('T', 1)
        .each('end', function () {
          wave.attr('T', 0);
          animateWave(config.waveAnimateTime);
        });
    } catch (e) {
      console.log(e);
    }
  }

  function GaugeUpdater() {
    this.update = function (value) {
      var newFinalValue = parseFloat(value).toFixed(2);
      var textRounderUpdater = function (value) {
        return Math.round(value);
      };
      if (
        parseFloat(newFinalValue) !=
        parseFloat(textRounderUpdater(newFinalValue))
      ) {
        textRounderUpdater = function (value) {
          return parseFloat(value).toFixed(1);
        };
      }
      if (
        parseFloat(newFinalValue) !=
        parseFloat(textRounderUpdater(newFinalValue))
      ) {
        textRounderUpdater = function (value) {
          return parseFloat(value).toFixed(2);
        };
      }

      var textTween = function () {
        var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
        return function (t) {
          this.textContent = textRounderUpdater(i(t)) + percentText;
        };
      };

      text1.transition().duration(config.waveRiseTime).tween('text', textTween);
      text2.transition().duration(config.waveRiseTime).tween('text', textTween);

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
