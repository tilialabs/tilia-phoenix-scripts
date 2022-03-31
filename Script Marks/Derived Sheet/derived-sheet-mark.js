/*
 * Tilia Labs Inc.
 * Copyright (c) 2012-*, All Rights Reserved
 *
 * Derived Sheet Mark
 *
 * This script mark compares the layout sheet size to a list of potential 
 * parent sheet sizes. After finding a match (or not), it draws a text
 * mark on the plate with the name of the parent sheet.
 */

// We currently don't have an easy way to query the stock sizes, 
// so instead we are using this array to store potential parent 
// sheet sizes
var stockSizes = ["960x660", "1130x770"]

function run(context) {
  // Run checkStockSize function to get original sheet size
  var originalFormat = checkStockSize(context)
  // Draw the mark with the information returned from the previous funtion
  drawMark(originalFormat, context)
}

function checkStockSize(context) {
  // Grab the width and height from the context anchor (layout sheet)
  // and convert to mm and parse as an integer
  var width= parseInt((context.anchorRect.width / 72 * 25.4))
  var height = parseInt((context.anchorRect.height / 72 * 25.4))
  
  // Look through stocks array defined at top of script to find match
  for (var stockIndex = 0; stockIndex < stockSizes.length; stockIndex++) {
    var stock = stockSizes[stockIndex];
    var stockWidth = parseInt(stock.split('x')[0])
    var stockHeight = parseInt(stock.split('x')[1])
    // Check case if width and height are equal - No derived sheet
    if ((stockWidth / width == 1) && (stockHeight / height == 1)) {
      context.log("No derived sheet");
      return stock + " (Full Sheet)"
    } // Check case if width or height are half of stock width - Half sheet
    else if ((stockWidth / width == 2 && stockHeight / height) == 1 || (stockWidth / height == 2 && stockHeight / width == 1)) {
      context.log("Half sheet");
      return stock + " (Half sheet)"
    } // Check case if width and height are double stock width - Quarter sheet
    else if ((stockWidth / width == 2 && stockHeight / height) == 2 || (stockWidth / height == 2 && stockHeight / width == 2)) {
      context.log("Quarter sheet");
      return stock + " (Quarter sheet)"
    } else if (stockIndex<stockSizes.length){
      context.log("Not sheet " + stock + ", checking next stock");
    }
  }
  return width + " x " + height + " (No derived sheet)"
}

function drawMark(originalFormat, context){
  // Create a drawable painter from the mark context
  var painter = new Painter(context.data);

  // Create font object
  var font = new Font("Arimo");

  // Create the text string, font, size, and placement
  var textString = new Text("Original Format: " + originalFormat);
  textString.font = font
  textString.size = Units.parse("24pt");
  textString.setPoint(Units.parse("10mm"),Units.parse("10mm"))

  // Clear the painter to remove any existing colors
  painter.clearPen();
  painter.clearBrush();
  // Set pen tool to stroke the text
  var brushColor = new Color(0, 0, 0, 100);
  var brush = new Brush(brushColor);
  painter.brush = brush
    
  // Draw text string on artwork
  painter.draw(textString);
}