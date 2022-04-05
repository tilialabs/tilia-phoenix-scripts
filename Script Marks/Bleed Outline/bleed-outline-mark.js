/*
 * Tilia Labs Inc.
 * Copyright (c) 2012-*, All Rights Reserved
 *
 * Offset Mark
 * Sheet mark designed to create a stroke around the bleed.
 * Enter the desired width of the stroke in pts in line 13.
 * The stroke color is defined by the layouts's first ink
 *
 * Created 2021-11-03 by david@tilialabs.com
 */

var strokeWidth = 5
var items = [];

function run(context){
    // Get the jobs api for performing actions on jobs
	var jobs = context.jobs;
	var job = context.job;

    // find all products on the layout, this adds them
    // to the "items" array we can use later
    var products = findProducts(context,context.root);

    // loop through all products now stored in the items array
    for (var i=0;i<items.length;i++) {
        var product = items[i];
        // get the bleed value from the bleedValue custom property
		var bleed = jobs.productProperty(job.id, product.name, "bleedValue");
		// if property not set or doesn't exist set default bleed
		if (bleed == "" || bleed == null) {
			// set default bleed in inches
			bleed = 0.125;
		}

		// Create new Painter to draw with
      	var painter = new Painter(context.data);
	     // Clear the pen so there will be no stroke
        painter.clearPen();
        painter.clearBrush();
		
		// Create penColor from first color of layout
		var penColor = context.surfaceColor(1);
		// Create pen with penColor and thickness
		var pen = new Pen(penColor);
		pen.thickness = strokeWidth
		painter.pen = pen
        // Draw shape
        painter.draw(product.globalRect.adjusted(bleed*72));
    }
    return true;
}

function findProducts(context,item) {
    // check to see if the input is a product, if so add to "items"
    if (item.type == "Product") {
        items.push(item)
    }
    // loop through to find child items of the input item
    for (var i = 0; i < item.children.size(); i++) {
	    // Get item type
		var type = item.children.get(i).type;
		// if item is a mark, ignore
		if (type == "Mark") {
		}
		// if item is a group of products, push each child item to "items" array
		else if (type == "Group") {
			for (var j=0;j<item.children.get(i).children.size();j++) {
				if (item.children.get(i).children.get(j).type == "Product") {
					items.push(item.children.get(i).children.get(j))
				}
			}
		}
		// if item is a product, push to our items array
		else if (type == "Product") {
			items.push(item.children.get(i))
		}
        // otherwise if there are children of this child,
        // put them back into this function to find their children
		else if (item.children.get(i).children.size() < 0) {
			findProducts(context,item.children.get(i))
		}
    }
    return;
  }