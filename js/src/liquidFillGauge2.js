class LiquidFillGauge {
  /**
   * Class constructor with initial configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
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
    this.data = _data;

    this.initVis();
  }

  /**
   * We initialize the arc generator, scales, axes, and append static elements
   */
  initVis() {
    const vis = this;

    vis.paths = [
      {
        fill: 'black',
        // d:
        //   'M151.319 294.971C191.033 299.249 227.502 264.585 232.735 217.586C234.988 197.058 223.761 169.456 198.839 135.734C194.933 130.441 192.979 124.043 192.958 117.309L193.163 109.234C193.142 102.5 188.092 96.7933 181.368 96.4302L182.217 62.9781C185.895 62.1095 189.207 60.4622 191.967 57.839C199.862 49.9596 200.184 37.2708 192.305 29.3757C184.987 22.0719 173.077 21.3848 165.024 27.9136C156.948 20.2059 144.239 20.6528 136.344 28.5322C128.449 36.4116 129.083 49.317 136.963 57.2122C139.408 59.3904 142.061 60.9968 145.117 61.8439L144.258 95.6805C137.899 96.0962 132.764 101.352 132.598 107.889L132.383 116.348C132.208 123.269 129.538 129.935 124.974 135.398C102.778 160.998 90.2824 183.381 88.2661 202.183C85.5998 223.854 90.6139 246.105 102.459 264.489C114.709 282.114 131.936 293.132 151.319 294.971ZM153.664 58.598C153.526 56.4784 152.224 54.7139 150.114 54.468C143.4 53.7204 138.745 47.6385 139.68 41.1214C140.615 34.6043 146.509 29.7521 153.026 30.6871C155.708 31.1399 158.37 32.3618 160.244 34.3331C160.806 34.9245 161.368 35.5159 161.733 36.2947C162.838 38.2465 165.323 38.8867 167.472 37.5946C167.669 37.4073 167.866 37.2199 168.063 37.0325C168.26 36.8451 168.457 36.6578 168.654 36.4704C169.059 35.7111 169.65 35.149 170.241 34.5869C174.973 30.0899 182.663 30.2852 187.16 35.0164C191.657 39.7476 191.461 47.4378 186.73 51.9347C184.562 53.9958 181.644 55.2684 178.568 55.1903C176.261 55.1317 174.486 56.8181 174.428 59.1252L173.491 96.0379L152.727 95.5108L153.664 58.598ZM109.695 259.863C98.9638 243.046 94.0882 222.915 96.7057 203.167C98.6733 186.287 110.568 164.851 131.571 140.76C137.318 134.172 140.618 125.407 140.843 116.563L141.057 108.104C141.116 105.797 143.284 103.736 145.591 103.794L180.966 104.692C183.273 104.751 185.334 106.919 185.276 109.226L185.071 117.301C184.856 125.76 187.343 133.903 192.363 140.764C215.609 172.327 226.865 198.776 224.868 216.809C222.822 236.764 214.072 255.587 199.671 269.65C186.661 282.017 169.941 288.903 152.49 286.728C135.039 284.554 120.071 275.517 109.695 259.863Z',
        d2:
          'M456.6,145c-0.3-2.9-2.5-5.4-5.4-6c-3-0.6-71.5-14.4-113.3,14.6c-21.5-12.2-42.3-19.2-57.8-19.2c-15.1,0-35.3,6.6-56.3,18.3c-0.1,0.1-0.2,0.1-0.4,0.2c-0.1,0-0.1-0.1-0.2-0.1c-41.9-27.8-109.1-14.3-112-13.7c-3,0.6-5.1,3-5.4,6c-5.2,58.1,18.1,91.5,27.6,102.5c0.1,0.1,0.2,0.2,0.3,0.3c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c-11,25.6-16.4,57.6-4,93.4c15,43.4,43.7,74.5,82.8,90c18.5,7.2,38.2,11,58,11c3.7,0,6.5-0.1,8.2-0.3c0.8-0.1,1.7-0.1,2.5,0c22.6,1.2,45.2-2.4,66.3-10.7c39.1-15.5,67.7-46.6,82.8-90c12.1-35,7.2-66.4-3.3-91.7C434.7,241.4,462.1,207.7,456.6,145z',
      },
    ];

    vis.value = 80;

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

    // Append group element that will contain our actual chart
    // and position it according to the given margin config
    vis.chartArea = vis.svg
      .append('g')
      .attr(
        'transform',
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    vis.chart = vis.chartArea.append('g');

    vis.minValue = 0; // The gauge minimum value.
    vis.maxValue = 100; // The gauge maximum value.
    vis.circleThickness = 0.0; // The outer circle thickness as a percentage of it's radius.
    vis.circleFillGap = 0.0; // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
    vis.waveHeight = 0.0; // The wave height as a percentage of the radius of the wave circle.
    vis.waveCount = 1; // The number of full waves per width of the wave circle.
    vis.waveRiseTime = 1000; // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
    vis.waveAnimateTime = 1800; // The amount of time in milliseconds for a full wave to enter the wave circle.
    vis.waveRise = true; // Control if the wave should rise from 0 to it's full height, or start at it's full height.
    vis.waveHeightScaling = true; // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
    vis.waveAnimate = true; // Controls if the wave scrolls or is static.
    vis.waveColor = '#178BCA'; // The color of the fill wave.
    vis.waveOffset = 0; // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.

    vis.updateVis();
  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    const vis = this;

    // Append fill
    vis.chartArea
      .append('path')
      .attr('id', 'beef2')
      .attr('d', vis.paths[0].d2)
      .style('fill', 'black')
      .style('stroke', 'none');

    // Append outline
    vis.chartArea
      .append('path')
      .attr('id', 'beef')
      .attr('d', vis.paths[0].d2)
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '10px');

    // Get bounding box
    vis.BBox = d3.select('#beef2').node().getBBox();

    console.log(vis.BBox);

    // Get radius = half of the width
    vis.radius =
      Math.min(parseInt(vis.BBox.width), parseInt(vis.BBox.height)) / 2;

    console.log(vis.radius);

    // What are the locations?
    // This is basically vis.BBox.x, top left x of bound box
    vis.locationX = parseInt(vis.BBox.width) / 2 - vis.radius + vis.BBox.x;
    // This is top left y of bounding box, plus height/2 - width/2
    vis.locationY = parseInt(vis.BBox.height) / 2 - vis.radius + vis.BBox.y;
    console.log('locationX ' + vis.locationX);
    console.log('locationY ' + vis.locationY);

    vis.fillPercent =
      Math.max(vis.minValue, Math.min(vis.maxValue, vis.value)) / vis.maxValue;

    vis.waveHeightScale;
    if (vis.waveHeightScaling) {
      vis.waveHeightScale = d3
        .scaleLinear()
        .range([0, vis.waveHeight])
        .domain([0, 100]);
    } else {
      vis.waveHeightScale = d3
        .scaleLinear()
        .range([vis.waveHeight, vis.waveHeight])
        .domain([0, 100]);
    }

    vis.circleThickness = vis.circleThickness * vis.radius;
    vis.circleFillGap = vis.circleFillGap * vis.radius;
    vis.fillCircleMargin = vis.circleThickness + vis.circleFillGap;
    vis.fillCircleRadius = vis.radius - vis.fillCircleMargin;
    console.log(vis.fillCircleRadius);
    console.log(vis.waveHeightScale(vis.fillPercent * 100));
    console.log(vis.fillPercent);
    vis.waveHeight =
      vis.fillCircleRadius * vis.waveHeightScale(vis.fillPercent * 100);
    console.log('waveheight: ' + vis.waveHeight);
    vis.waveLength = (vis.fillCircleRadius * 2) / vis.waveCount;
    vis.waveClipCount = 1 + vis.waveCount;
    vis.waveClipWidth = vis.waveLength * vis.waveClipCount;

    // Data for building the clip wave area.
    vis.data = [];
    for (var i = 0; i <= 40 * vis.waveClipCount; i++) {
      vis.data.push({ x: i / (40 * vis.waveClipCount), y: i / 40 });
    }
    console.log(vis.data);

    // Scales for controlling the size of the clipping path.
    vis.waveScaleX = d3
      .scaleLinear()
      .range([0, vis.waveClipWidth])
      .domain([0, 1]);
    vis.waveScaleY = d3.scaleLinear().range([0, vis.waveHeight]).domain([0, 1]);

    console.log(
      vis.fillCircleMargin + vis.fillCircleRadius * 2 + vis.waveHeight
    );
    console.log(vis.fillCircleMargin - vis.waveHeight);
    // Scales for controlling the position of the clipping path.
    vis.waveRiseScale = d3
      .scaleLinear()
      // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
      // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
      // circle at 100%.
      .range([500, 0]) // setting wave rise range here!!!
      .domain([0, 1]);
    vis.waveAnimateScale = d3
      .scaleLinear()
      .range([0, vis.waveClipWidth - vis.fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
      .domain([0, 1]);

    vis.renderVis();
  }

  /**
   * Bind data to visual elements (enter-update-exit) and update axes
   */
  renderVis() {
    const vis = this;

    // Center the gauge within the parent SVG. (outline)
    vis.gaugeGroup = vis.chartArea
      .append('g')
      .attr('id', 'gaugeGroup')
      .attr(
        'transform',
        'translate(' + vis.locationX + ',' + vis.locationY + ')'
      );

    // The clipping wave area.
    vis.clipArea = d3
      .area()
      .x(function (d) {
        console.log(d.x);
        // console.log(vis.waveScaleX(d.x));
        return vis.waveScaleX(d.x);
      })
      .y0(function (d) {
        return -50;
        // return waveScaleY(
        //   Math.sin(
        //     Math.PI * 2 * vis.waveOffset * -1 +
        //       Math.PI * 2 * (1 - vis.waveCount) +
        //       d.y * 2 * Math.PI
        //   )
        // );
        // return Math.sin(
        //   Math.PI * 2 * vis.waveOffset * -1 +
        //     Math.PI * 2 * (1 - vis.waveCount) +
        //     d.y * 2 * Math.PI
        // );
      })
      .y1(function (d) {
        // console.log(fillCircleRadius * 2 + waveHeight);
        return 310; // controls bottom limit of image
      });

    vis.waveGroup = vis.gaugeGroup
      .append('defs')
      .append('clipPath')
      .attr('id', 'clipWave')
      .attr('class', 'waveeee');
    vis.wave = vis.waveGroup
      .append('path')
      .datum(vis.data)
      .attr('d', vis.clipArea)
      .attr('T', 0);

    // The inner circle with the clipping wave attached.
    vis.fillCircleGroup = vis.gaugeGroup
      .append('g')
      .attr('clip-path', 'url(#clipWave' + ')');

    vis.fillCircleGroup.append(function () {
      var shape = d3.select('#beef2');
      console.log(shape);
      shape
        .attr(
          'transform',
          'translate(' + -vis.locationX + ',' + -vis.locationY + ')'
        )
        .style('fill', vis.waveColor);
      console.log(shape.node());

      var shape2 = d3.select('#beef');
      shape2.attr('class', 'good');
      return shape.node();
    });

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    vis.waveGroupXPosition =
      vis.fillCircleMargin + vis.fillCircleRadius * 2 - vis.waveClipWidth;
    if (vis.waveRise) {
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
        .duration(vis.waveRiseTime)
        .attr(
          'transform',
          'translate(' +
            vis.waveGroupXPosition +
            ',' +
            vis.waveRiseScale(vis.fillPercent) +
            ')'
        );
      // .each('start', function () {
      //   vis.wave.attr('transform', 'translate(1,0)');
      // }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    }
  }
}
