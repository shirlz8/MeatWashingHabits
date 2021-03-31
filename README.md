#  🍗 CPSC 436V Project - Group 10

We used the Airbnb style guide and added eslint to our project to improve code readability. Our code structure generally follows the starter repos we were provided for our programming assignments.

📂 **Repository structure:**

**These are the top level folders:**

**css** - contains all the CSS

-   Each visualization type has a separate css file that deals with styling for the file/chart and index.css for the overall general explore page styling.

**data** - contains all the CSVs with the data

-   There are 4 CSV files (reference our M2 write up to understand how the CSVs will be used)
-   There is also a jupyter notebook file that contains the R code we used for data preprocessing

**js** - contains all the JavaScript code for our visualizations, we put all the visualization files into a subfolder called src to run the linter easily.

-   [Main.js](https://github.students.cs.ubc.ca/cpsc436v-2020w-t2/436v-project_f9d1b_h8u0b_u3u0b/blob/master/js/src/main.js)

    -   Load the data

    -   Initializes the charts using the other js classes

    -   Implement the dispatchers

    -   Event listener for radio button for habit bubble plot

-   [foodSafetyBarChart.js](https://github.students.cs.ubc.ca/cpsc436v-2020w-t2/436v-project_f9d1b_h8u0b_u3u0b/blob/master/js/src/foodSafetyBarChart.js)

    -   Implements the food safety bar chart

    -   3 main functions : init, update, render

    -   Onclick linkage with dispatch to other charts

-   [householdSizeBarChart.js](https://github.students.cs.ubc.ca/cpsc436v-2020w-t2/436v-project_f9d1b_h8u0b_u3u0b/blob/master/js/src/householdSizeBarChart.js)

    -   Implements the household size bar chart

    -   3 main functions : init, update, render

    -   Onclick linkage with dispatch to other charts

-   [habitsBubblePlot.js](https://github.students.cs.ubc.ca/cpsc436v-2020w-t2/436v-project_f9d1b_h8u0b_u3u0b/blob/master/js/src/habitsBubblePlot.js)

    -   Implements the food safety habits proportional area matrix

    -   3 main functions : init, update, render

-   [liquidFillGauge.js](https://github.students.cs.ubc.ca/cpsc436v-2020w-t2/436v-project_f9d1b_h8u0b_u3u0b/blob/master/js/src/liquidFillGauge.js)

    -   Takes a svg path and meat type as parameters and creates each of the 6 meat type liquid charts.

    -   2 main functions : 

    -   initVis() - creates the initial liquid chart

    -   updateVis() - called from the dispatcher

    -   Onclick linkage with dispatch to other charts

**svg** -  contains all our svg images

📑 **References :**

-   Text wrapping for axes code : bl.ocks.org/mbostock/7555321

-   Stacked bar chart references : 

    -   <https://www.d3-graph-gallery.com/graph/barplot_stacked_basicWide.html>

    -   https://devdocs.io/d3~4/d3-shape#_stack

-   Liquid fill gauge : <http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6>

All other code came from tutorials or previous programming assignments