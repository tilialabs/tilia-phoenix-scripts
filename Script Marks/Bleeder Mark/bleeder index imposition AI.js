/*
 * Tilia Labs Inc.
 * Copyright (c) 2012-*, All Rights Reserved
 *
 * Bleeder Indexes
 *
 * This Imposition AI script sets an index property on each product based
 * on the layout it is placed in.  It will not be useful when products
 * are spanning layouts.
 */

var PROPERTY_NAME = "bleeder-index";

function run(context) {
  // Get the job we are currently operating on
  var job = context.job;

  // Get the jobs api for performing actions on jobs
  var jobs = context.jobs;

  // Loop over each layout in the job
  var layoutIndex;
  for (layoutIndex = 0; layoutIndex < job.layouts.size(); layoutIndex++) {
    var layout = job.layouts.get(layoutIndex);

    // Get the list of products placed on this layout
    var products = context.layoutProducts(layout.index);
    if (products != undefined && products != null) {
      // Loop over each layout placed in the layout
      var productIndex;
      for (productIndex = 0; productIndex < products.size(); productIndex++) {
        var product = products.get(productIndex);
        // Set the property on the product
        jobs.setProductProperty(
          job.id,
          product,
          PROPERTY_NAME,
          (productIndex + 1).toString()
        );
      }
    }
  }
}
