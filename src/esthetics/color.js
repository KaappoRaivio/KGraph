const getPlotColors = () => ["#ff0000", "#ff7f00", "#cfcf00", "#00af00", "#007f7f", "#0000ff", "#ff00ff"];
export default length => {
  return getPlotColors()[(length + 1) % 7];
};
