/*
 * Tilia Labs Inc.
 * Copyright (c) 2012-*, All Rights Reserved
 *
 * Bleeder Mark
 *
 * This product script mark draws a mark based on the bleeder-index
 * custom product property. This is designed to create a mark that
 * will bleed off the edge of a product to make collection easier
 * after cutting.
 */

// Width and height of mark in inches, converted to points
var WIDTH = Units.inPt(0.5);
var HEIGHT = Units.inPt(0.25);
var IDEAL_BAR_WIDTH = Units.inPt(0.1);

function run(context) {
  // Get the product instance
  var product = context.item;

  // Get the custom bleeder-index property set during layout generation
  var bleederIndex = context.jobs.productProperty(
    context.job.id,
    product.componentName,
    "bleeder-index"
  );

  // If bleeder-index was not set then give up
  if (
    bleederIndex === undefined ||
    bleederIndex === null ||
    bleederIndex == 0
  ) {
    context.log("No bleeder-index found");
    return false;
  }

  // Create a rect for the mark size
  var rect = new Rect(0, 0, WIDTH, HEIGHT);

  // Create a drawable painter from the mark context
  var painter = new Painter(context.data);

  // Create colors to be used in mark
  var cyan = new Color(1, 0, 0, 0);
  var magenta = new Color(0, 1, 0, 0);
  var yellow = new Color(0, 0, 1, 0);
  var red = new Color(0, 1, 1, 0);
  var green = new Color(1, 0, 1, 0);
  var blue = new Color(1, 1, 0, 0);

  // Setup colors based on bleeder-index.
  // We will rotate through colors based on the index
  var color1;
  var color2;
  var color3;

  // Set the colors based on the index
  if (bleederIndex <= 5) {
    color1 = cyan;
    color2 = yellow;
    color3 = magenta;
  } else if (bleederIndex <= 10) {
    color1 = magenta;
    color2 = yellow;
    color3 = red;
  } else if (bleederIndex <= 15) {
    color1 = yellow;
    color2 = red;
    color3 = green;
  } else if (bleederIndex <= 20) {
    color1 = red;
    color2 = green;
    color3 = blue;
  }

  // Find modulus of index so we can switch between colors
  bleederIndex %= 5;
  if (bleederIndex == 0) {
    bleederIndex = 5;
  }

  // Clear the pen so there will be no stroke
  painter.clearPen();

  // Draw the mark
  drawMark(context, painter, bleederIndex, color1, color2, color3);

  // Set the mark size
  context.setRect(rect);

  // Return true to tell ScriptMark it should update
  return true;
}

function drawMark(context, painter, index, color1, color2, color3) {
  // Number of bars and spaces
  var countAll = index * 2 - 1;

  // Compute bar width
  var barWidth = WIDTH / countAll;
  if (barWidth > IDEAL_BAR_WIDTH) {
    barWidth = IDEAL_BAR_WIDTH;
  }

  // Width of bars and spaces
  var widthAll = countAll * barWidth;

  // Start x position of first bar
  var start = (WIDTH - widthAll) / 2;

  // Set up loop based on bar count
  var color;
  for (var i = 0; i < countAll; i++) {
    // Every other bar will be blank to make a space
    if (i % 2 === 1) {
      continue;
    } else {
      // Switch between two colors
      if (i % 6 === 0) {
        color = color1;
      } else if (i % 6 === 2) {
        color = color2;
      } else {
        color = color3;
      }

      // Set brush (fill) color
      painter.setBrush(color);

      // Draw bar
      var barRect = new Rect(start + i * barWidth, 0, barWidth, HEIGHT);
      painter.draw(barRect);
    }
  }
}
