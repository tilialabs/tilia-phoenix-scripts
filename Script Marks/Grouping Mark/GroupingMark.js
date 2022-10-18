/*
 * Tilia Labs Inc.
 * Copyright (c) 2012-*, All Rights Reserved
 *
 * Grouping Mark
 *
 * This layout script mark sets a filled shape mark
 * around a group of products based on the custom
 * "Group" property
 */
function run(context) {
  // Get the job we are currently operating on
  var job = context.job;

  // Get the jobs api for performing actions on jobs
  var jobs = context.jobs;

  // Create a group object we can add to as we find groups
  var groups = {};

  // Set the margin for the group mark to prevent the mark
  // from overprinting on a group
  var margin = Units.inPt(0.25);

  // Set the stroke width of the mark (in points)
  var stroke = 13.5;

  // Find the products and store them in a products array
  var products = findProducts(context.root, false, context);

  var groupNum = "";

  // Loop through products, storing the group if it hasn't
  // already been added to our groups array. For each group
  // see if this product expands the bounds of the group
  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    var group = jobs.productProperty(job.id, product.name, "Group");
    if (group != groupNum) {
      groups[group] = [
        product.globalRect.left,
        product.globalRect.top,
        product.globalRect.right,
        product.globalRect.bottom,
      ];
      groupNum = group;
    }
    if (product.globalRect.left < groups[group][0]) {
      groups[group][0] = product.globalRect.left;
    }
    if (product.globalRect.top > groups[group][1]) {
      groups[group][1] = product.globalRect.top;
    }
    if (product.globalRect.right > groups[group][2]) {
      groups[group][2] = product.globalRect.right;
    }
    if (product.globalRect.bottom < groups[group][3]) {
      groups[group][3] = product.globalRect.bottom;
    }
  }

  // If there are more than one group, calculate the gaps
  // and determine if using horizontal or vertical nesting
  if (Object.keys(groups).length > 1) {
    var vGapTotal =
      groups[Object.keys(groups)[0]][1] - groups[Object.keys(groups)[1]][1];
    if (vGapTotal == 0) {
      context.log("Vertical");
      var vGap = 0;
      var hGap =
        groups[Object.keys(groups)[0]][2] - groups[Object.keys(groups)[1]][0];
    } else {
      context.log("Horizontal");
      var vGap =
        groups[Object.keys(groups)[0]][3] - groups[Object.keys(groups)[1]][1];
      var hGap = 0;
    }
    context.log("HGAP: " + hGap + "  -  VGAP: " + vGap);
  }

  context.log("groups: " + Object.keys(groups));

  // Loop through each group, drawing a stroke around it
  for (var i = 0; i < Object.keys(groups).length; i++) {
    var groupName = Object.keys(groups)[i];
    var group = groups[groupName];
    context.log("Group " + groupName + ":");
    context.log(group);

    var groupWidth = group[2] - group[0];
    var groupHeight = group[1] - group[3];

    var painter = new Painter(context.data);
    // Create spot color to be used in mark
    // var ink = new Color(1, 0, 0, 0);
    var ink = calculateInk(groupName);
    // Clear the pen so there will be no stroke
    var pen = new Pen(ink);
    pen.thickness = stroke;
    painter.clearPen();
    painter.clearBrush();
    // Set brush (fill) color
    painter.setPen(pen);

    //Set bounds for mark and draw each piece
    var groupRect = new Rect(
      group[0] - margin,
      group[3] - margin - vGap / 2,
      groupWidth + 2 * margin + Math.abs(hGap) / 2,
      groupHeight + 2 * margin + vGap / 2
    );
    painter.draw(groupRect);

    var swatchRect = new Rect(
      group[2] - 72 + margin + Math.abs(hGap) / 2,
      group[3] - margin - vGap / 2,
      72,
      72
    );
    painter.clearPen();
    painter.setBrush(ink);
    painter.draw(swatchRect);

    painter.clearBrush();
    painter.clearPen();

    // Create CMYK stroke color
    var painter = new Painter(context.data);
    var penColor = new Color(0, 0, 0, 100);
    var penFill = new Color(0, 0, 0, 0);

    // Set the pen tool settings so the text gets stroked
    var pen = new Pen(penColor);
    pen.thickness = Units.parse("1pt");
    painter.pen = pen;
    painter.setBrush(penFill);

    // // Create the text string from the group name
    var textString = new Text(groupName);
    textString.size = Units.parse("40pt");
    textString.setPoint(
      swatchRect.rect.left +
        (swatchRect.rect.width - textString.rect.width) / 2,
      swatchRect.rect.bottom +
        (swatchRect.rect.height - textString.rect.height) / 2
    );

    // If vertical nesting, rotate the text
    if (vGapTotal == 0) {
      painter.save();
      var transform = new Transform();
      transform.translate(swatchRect.center);
      transform.rotateDeg(90);
      transform.translate(swatchRect.center.reversed);
      painter.combine(transform);
      painter.draw(textString.path);
      painter.restore();
    } else {
      painter.draw(textString);
    }
  }
  return true;
}

function findProducts(item, child, context) {
  var products = [];
  // Look at the type of the current item. If it's a product
  // add it to the array. If it's a child item, no need to recurse
  if (item.type === Type.Product) {
    if (child == true) {
      return item;
    }
    products.push(item);
  }
  // Find the children of the current item, and send it back into
  // this function. If it is a product, add it to our array
  var children = item.children(false);
  for (var index = 0; index < children.size(); index++) {
    var child = findProducts(children.get(index), true, context);
    if (child.type === Type.Product) {
      products.push(child);
    }
  }
  return products;
}

// Use some math tricks to create unique colors for each group
// even if the group numbers are very close together
function calculateInk(groupNum) {
  var paddedNum = ("00000" + groupNum).slice(-3);
  var str = Math.exp(
    Math.exp(paddedNum).toString().replace(".", "").toString().substring(0, 3)
  )
    .toString()
    .replace(".", "")
    .replace("e+", "");
  var cyan = str[0];
  var magenta = str[1];
  var yellow = str[2];
  var ink = new Color(cyan / 10, magenta / 10, yellow / 10, 0);
  return ink;
}
