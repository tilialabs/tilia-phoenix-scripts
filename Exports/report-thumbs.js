/*
 * Tilia Labs Inc.
 * Copyright (c) 2012-*, All Rights Reserved
 *
 * This script generates blanks PDF files for all of the blank items found
 * in the project rolls.
 */

// Layout image base filename
var LAYOUT_FILENAME = "layout-preview";

// Product image base filename
var PRODUCT_FILENAME = "product-preview";

function run(context) {
  // Get path data
  var paths = context.paths;

  // Check to see if no product paths exist
  if (isListEmpty(paths)) {
    context.log("Unexpected empty path data array");
    return;
  }

  // Get specified path and directory
  var path = paths.get(0).path;
  var dir = FileUtils.directory(path);
  if (dir === undefined) {
    context.log("Unexpected undefined directory");
    return;
  }

  // Get project data
  var project = context.project;
  if (project === undefined) {
    context.log("Unexpected undefined project");
    return;
  }

  // Loop through layouts, create thumbnail and save it to directory
  var layouts = project.layouts;
  for (var li = 0; li < layouts.size(); li++) {
    var layout = layouts.get(li);
    var layout_thumb = layout.front.preview(1000, 800);
    layout_thumb.save(
      FileUtils.concat(dir, LAYOUT_FILENAME + "-" + (li + 1) + ".png")
    );
  }

  // Loop through products, create thumbnail and save it to directory
  var products = project.products;
  for (var pi = 0; pi < products.size(); pi++) {
    var product = products.get(pi);
    var product_thumb = product.preview(1000, 800);
    product_thumb.save(
      FileUtils.concat(dir, PRODUCT_FILENAME + "-" + (pi + 1) + ".png")
    );
  }
}

function isListEmpty(list) {
  return list === undefined || list.size() === 0;
}
