class HouseholdSizeBarChart {
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
                top: 25, right: 15, bottom: 20, left: 35,
            },
        };
        this.data = _data;
        console.log('con vis');

        this.initVis();
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
        vis.xScale.domain(['1', '2', '3', '4', '5', '6']);

        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickFormat((d) => {
                if (d === '6') return `${d}+`;
                return d;
            })
            .ticks(6);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
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

        vis.washCount = d3.rollup(vis.data, v => d3.sum(v, d => d.Beef), d => d.Houshold_size);
        vis.totalCount = d3.rollup(vis.data, v => v.length, d => d.Houshold_size);

        vis.washCountData = [];
        vis.washCount.forEach((value, key) => {
            var row = {
                householdSize: key,
                wash: value,
                dontWash: vis.totalCount.get(key) - value
            };
            vis.washCountData.push(row);
        })

        vis.subgroups = ["dontWash", "wash"];

        vis.stackedWashCountData = d3.stack()
            .keys(vis.subgroups)
            (vis.washCountData);

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

        const bars = vis.chart.selectAll('.bar_g')
            .data(vis.stackedWashCountData, (d) => d)
            .join('g')
            .attr('class', 'bar_g')
            .attr('fill', (d) => vis.color(d.key))
            .selectAll('.bar_rect')
            .data(d => d)
            .join('rect')
            .attr('class', 'bar_rect')
            .attr('width', vis.xScale.bandwidth())
            .attr('height', (d) => vis.yScale(d[0]) - vis.yScale(d[1]))
            .attr('y', (d) => vis.yScale(d[1]))
            .attr('x', (d) => vis.xScale(d.data.householdSize));

        // render axis
        vis.xAxisG
            .call(vis.xAxis)
            .call((g) => g.select('.domain').remove());

        vis.yAxisG
            .call(vis.yAxis)
            .call((g) => g.select('.domain').remove());
    }
}
