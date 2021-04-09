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
                left: 25
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
            .attr('class', 'habitsBubblePlotChart')
            .attr(
                'transform',
                `translate(${vis.config.margin.left},${vis.config.margin.top})`
            );

        // Initialize main scales
        vis.radiusScale = d3.scaleSqrt().range([40, 200]);

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

        // sort the Reason Score Dictionary in terms of scores
        // in decreasing order of importance (ie: stronger reasons to weaker reasons)
        const sortedReasonsScoresDict = new Map([...reasonsScoresDict.entries()].sort((a, b) => b[1] - a[1]));

        for (const row of sortedReasonsScoresDict) {
            let avgScore = row[1] / this.data.length;
            sortedReasonsScoresDict.set(row[0], avgScore.toFixed(2));
        }
        console.log(sortedReasonsScoresDict)

        // todo: sum counts of 5 or 6


        vis.renderVis();
    }

    renderVis() {
        const vis = this;

    }

}

