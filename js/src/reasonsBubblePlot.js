class ReasonsBubblePlot {
    constructor(_config, _data, type, dataLabels, listOfReasons) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 1500,
            containerHeight: 500,
            margin: {
                top: 25,
                right: 25,
                bottom: 25,
                left: 25
            }
        };
            this.data = _data;
            this.type = type;
            this.dataLabels = dataLabels;
            this.listOfReasons = listOfReasons;

        this.initVis();
    }

    textTranslateScale(d) {
        const vis = this;

        const textLabel = d3
            .scaleOrdinal()
            .domain(vis.dataLabels)
            .range(vis.listOfReasons);

        return textLabel(d);
    }

    circleColor(type) {
        const colourScale = d3
            .scaleOrdinal()
            .domain(['noWash', 'wash'])
            .range(['#C1504F', '#4E81BE']);

        return colourScale(type);
    }

    title(type) {
        const titleScale = d3
            .scaleOrdinal()
            .domain(['noWash', 'wash'])
            .range(['Reasons for Not Washing Meats', 'Reasons for Washing Meats']);

        return titleScale(type);
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
            .attr('height', vis.config.containerHeight)
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.chart = vis.svg
            .append('g')
            .attr('class', 'reasonsBubblePlotChart')
            .attr('transform', `translate(200,0)`);

        // Add chart title
        vis.svg
            .append('text')
            .attr('class', 'chart-title')
            .attr('transform', `translate(${vis.width / 2},${vis.config.margin.top + 40})`)
            .attr('text-anchor', 'middle')
            .style('font-size', '28px')
            .text(vis.title(this.type));

        // Add chart outline
        vis.title = vis.svg
            .append('rect')
            .attr('class', 'chart-outline')
            .attr('x', 100)
            .attr('y', vis.config.margin.top)
            .attr('width', vis.width - 175)
            .attr('height', vis.height)
            .attr('stroke', 'black')
            .attr('stroke-width', '1px')
            .attr('fill', 'none');


        // Initialize main scales
        vis.radiusScale = d3.scaleSqrt().range([80, 25]);

        vis.updateVis();
    }

    updateVis() {
        const vis = this;

        // Initialize a Dictionary to store each reason and it's total ranking score
        // higher ranking = stronger reasons
        const reasonsScoresDict = new Map();
        const  firstRow = this.data[0]
        for (const property in firstRow) {
            reasonsScoresDict.set(property, parseInt(firstRow[property]))
        }

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

        const countExtent = [Array.from(sortedReasonsScoresDict.values())[0], Array.from(sortedReasonsScoresDict.values()).pop()];
        vis.reasonsData = sortedReasonsScoresDict;

        vis.radiusScale.domain(countExtent);

        const scoreValues = Array.from(vis.reasonsData.values());
        vis.circlePositions = vis.calculateCirclePosition(scoreValues, 50);
        vis.renderVis();
    }

    // todo: fix spacing between circles
    renderVis() {
        const vis = this;

        // draw the circles
        vis.chart
            .selectAll('.circle-element')
            .data(vis.reasonsData, (d) => d)
            .join('circle')
            .attr('class', 'reason-circle')
            .attr('r', (d) => vis.radiusScale(d[1]))
            .attr('cy', vis.height)
            .attr('cx', (d, i) => {
                let pos = vis.circlePositions[i];
                return vis.config.margin.left + pos;
            })
            .attr('transform', (d) => `translate(0, ${-vis.radiusScale(d[1])})`)
            .style('fill', vis.circleColor(vis.type));

        // avg score label on the circles
        vis.chart
            .selectAll('text')
            .data(vis.reasonsData)
            .join('text')
            .attr('class', 'reason-num-label')
            .attr('y', vis.height)
            .attr('x', (d, i) => {
                let pos = vis.circlePositions[i];
                return vis.config.margin.left + pos;
            })
            .attr('transform', (d) => `translate(0, ${-vis.radiusScale(d[1])})`)
            .style('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', 'white')
            .text((d) => d[1]);

        // line labels between the circles and the text
        vis.chart
            .selectAll('.values-labels')
            .attr('class', 'values-line-wrap')
            .data(vis.reasonsData, (d) => d)
            .join('line')
            .attr('x1', (d, i) => {
                let pos = vis.circlePositions[i];
                return vis.config.margin.left + pos;
            })
            .attr('x2', (d, i) => {
                let pos = vis.circlePositions[i];
                return vis.config.margin.left + pos;
            })
            .attr('y1', vis.height)
            .attr('y2',  (d) => vis.height + 2*vis.radiusScale(d[1]))
            .attr('transform', (d) => `translate(0, ${4*-vis.radiusScale(d[1])})`)
            .style('stroke', 'black')
            .style('stroke-width', '2px')

        // text labels of different reasons
        vis.chart
            .selectAll('.values-labels')
            .attr('class', 'values-text')
            .data(vis.reasonsData, (d) => d)
            .join('text')
            .attr('dy', 0)
            .attr('y', (d) => vis.height + 2*vis.radiusScale(d[1]))
            .attr('x', (d, i) => {
                let pos = vis.circlePositions[i];
                return vis.config.margin.left + pos;
            })
            .attr('transform', (d) => `translate(0, ${6.5*-vis.radiusScale(d[1])})`)
            .style('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', 'black')
            .text((d) => vis.textTranslateScale(d[0]))
            .call(this.wrap, 150);

    }

    calculateCirclePosition(scoreValues, distBetweenCircles) {
        const vis = this;
        const positionValues = [];
        const radiusValues = scoreValues.map(d => vis.radiusScale(d));
        let prevNum = 0;
        let currNum = 0;

        for (let i = 0; i < radiusValues.length; i++) {
            if (i > 0) {
                currNum = prevNum + radiusValues[i-1] + radiusValues[i] + distBetweenCircles;
            } else {
                currNum = radiusValues[0];
            }
            positionValues.push(currNum);
            prevNum = currNum;
        }
        return positionValues;
    }


    //todo move to util maybe
    // Function to wrap X axis labs
    // Sampled from : bl.ocks.org/mbostock/7555321
    wrap(text, width) {
        text.each(function () {
            const text2 = d3.select(this);
            const words = text2.text().split(/\s+/).reverse();
            let word;
            let line = [];
            let lineNumber = 0;
            const lineHeight = 1.1; // ems
            const y = text2.attr('y');
            const dy = parseFloat(text2.attr('dy'));
            const x = text2.attr('x')

            let tspan = text2
                .text(null)
                .append('tspan')
                .attr('x', x)
                .attr('y', y)
                .attr('dy', `${dy}em`);

            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(' '));

                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = text2
                        .append('tspan')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('dy', `${++lineNumber * lineHeight + dy}em`)
                        .text(word);
                }
            }
        });
    }

}

