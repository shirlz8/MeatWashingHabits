class NotWashReasonsBubblePlot {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 1000,
            containerHeight: 500,
            margin: {
                top: 25,
                right: 25,
                bottom: 25,
                left: 225
            }
        };
            this.data = _data;

        this.initVis();
    }

    initVis() {
        const vis = this;

        vis.width = vis.config.containerWidth
            - vis.config.margin.left
            - vis.config.margin.right;
        vis.height = vis.config.containerHeight
            - vis.config.margin.top
            - vis.config.margin.bottom;

        vis.svg = d3
            .select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.chart = vis.svg
            .append('g')
            .attr('class', 'reasonsBubblePlotChart')
            // .attr(
            //     'transform',
            //     `translate(${vis.config.margin.left},${vis.config.margin.top})`
            // );

        // Initialize main scales
        vis.radiusScale = d3.scaleSqrt().range([4, 40]);

        vis.updateVis();
    }

    updateVis() {
        const vis = this;
        console.log(this.data)

        // Initialize a Dictionary to store each reason and it's total ranking score
        // higher ranking = stronger reasons
        const reasonsScoresDict = new Map();
        const  firstRow = this.data[0]
        for (const property in firstRow) {
            reasonsScoresDict.set(property, parseInt(firstRow[property]))
        }
        console.log(reasonsScoresDict)

        // sum up all the scores for all respondents for each reason
        for (const row of this.data) {
            for (const property in row) {
                let value = reasonsScoresDict.get(property);
                reasonsScoresDict.set(property, value + parseInt(row[property]));
            }
        }

        for (const row of reasonsScoresDict) {
            let avgScore = row[1] / this.data.length;
            reasonsScoresDict.set(row[0], parseFloat(avgScore.toFixed(2)));
        }

        // sort the Reason Score Dictionary in terms of scores
        // in decreasing order of importance (ie: stronger reasons to weaker reasons)
        const sortedReasonsScoresDict = new Map([...reasonsScoresDict.entries()].sort((a, b) => b[1] - a[1]));


        console.log(sortedReasonsScoresDict)

        vis.reasonsData = sortedReasonsScoresDict;
        // todo: sum counts of 5 or 6?


        vis.renderVis();
    }

    renderVis() {
        const vis = this;
        vis.chart
            .selectAll('.circle-element')
            .data(vis.reasonsData, (d) => d)
            .join('circle')
            .attr('class', 'reason-circle')
            .attr('r', (d) => vis.radiusScale(d[1]))
            .attr('cy', vis.height / 2)
            .attr('cx', (d, i) => {
                let r = vis.radiusScale(d[1]);
                return vis.config.margin.left + i * (120 + r);
            })
            .style('fill', '#C1504F');


        vis.chart
            .selectAll('text')
            .data(vis.reasonsData, (d) => d)
            .join('text')
            .attr('class', 'reason-num-label')
            .attr('y', vis.height / 2)
            .attr('x', (d, i) => {
                let r = vis.radiusScale(d[1]);
                return vis.config.margin.left + i * (120 + r);
            })
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', 'white')
            .text((d) => d[1]);
    }

}

