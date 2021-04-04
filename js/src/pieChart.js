class FoodSafetyBarChart {
  /**
   * Class constructor with initial configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _dispatcher, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 350,
      containerHeight: 350,
      legendPosition: 50,
      margin: {
        top: 80,
        right: 15,
        bottom: 40,
        left: 45,
      },
    };
    this.data = _data;
    this.dispatcher = _dispatcher;
    this.initVis();
  }

  /**
   * We initialize the arc generator, scales, axes, and append static elements
   */
  initVis() {
    const vis = this;
  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    const vis = this;
  }

  /**
   * Bind data to visual elements (enter-update-exit) and update axes
   */
  renderVis() {
    const vis = this;
  }
}
