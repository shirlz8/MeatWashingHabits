class NotWashReasonsBubblePlot {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 1500,
            containerHeight: 500,
            margin: {
                top: 25,
                right: 25,
                bottom: 25,
                left: 225
            }
        };
            this.data = _data;
            this.textLabelData = [
                'Feel like I should, but I don\'t',
                'Meat is clean enough',
                'Follow expert\'s advice',
                'Preserve texture, smell, taste, etc',
                'Not cultural or religious custom',
                'Others'
            ];

            this.listOfReasons = [
                'Feel_I_should_but_dont',
                'Meat_is_clean_enough',
                'Exprts_advise_against',
                'Preserve_texture_etc',
                'Not_cultural_or_religious_custom',
                'Other'
            ]

        this.initVis();
    }

    textTranslateScale(d) {
        const vis = this;

        const textLabel = d3
            .scaleOrdinal()
            .domain(vis.listOfReasons)
            .range(vis.textLabelData);

        return textLabel(d);
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

        vis.reasonsData = sortedReasonsScoresDict;


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
                let r = vis.radiusScale(d[1]);
                return vis.config.margin.left + i * (110 + r);
            })
            .attr('transform', (d) => `translate(0, ${-vis.radiusScale(d[1])})`)
            .style('fill', '#C1504F');

        // avg score label on the circles
        vis.chart
            .selectAll('text')
            .data(vis.reasonsData, (d) => d)
            .join('text')
            .attr('class', 'reason-num-label')
            .attr('y', vis.height)
            .attr('x', (d, i) => {
                let r = vis.radiusScale(d[1]);
                return vis.config.margin.left + i * (110 + r);
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
                let r = vis.radiusScale(d[1]);
                return vis.config.margin.left + i * (110 + r);
            })
            .attr('x2', (d, i) => {
                let r = vis.radiusScale(d[1]);
                return vis.config.margin.left + i * (110 + r);
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
                let r = vis.radiusScale(d[1]);
                return vis.config.margin.left + i * (110 + r);
            })
            .attr('transform', (d) => `translate(0, ${6.5*-vis.radiusScale(d[1])})`)
            .style('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', 'black')
            .text((d) => vis.textTranslateScale(d[0]))
            .call(this.wrap, 150);

    }

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
            console.log(dy)
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

