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

// Define the name of the layout property you want to set
var PROPERTY_NAME = "Original Format";

function run(context) {
  // Get the job we are currently operating on
  var job = context.job;
  // Get the jobs api for performing actions on jobs
  var jobs = context.jobs;
  // Loop over each layout in the job
  for (var layoutIndex = 0; layoutIndex < job.layouts.size(); layoutIndex++) {
    var layout = job.layouts.get(layoutIndex);
    var sheet = layout.surfaces.get(0).sheet;
    // Run checkStockSize function to get original sheet size
    var originalFormat = checkStockSize(sheet, context)
    jobs.setLayoutProperty(
      job.id,
      layoutIndex + 1,
      PROPERTY_NAME,
      // SET NEW PRODUCT PROPERTY VALUE BELOW, 
      originalFormat
    );
  
  }
}

function checkStockSize(sheet, context) {
  // Grab the width and height from the sheet, which is returned with units
  // Need to split based on the units and parse as an integer
  var width= parseInt(sheet.width.split('"')[0])
  var height = parseInt(sheet.height.split('"')[0])
  
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

