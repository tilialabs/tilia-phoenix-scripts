// Tilia Labs Inc.
// Copyright (c) 2012-*, All Rights Reserved

// Convert PDF path to resource list using file name as job ID
function onStart(state, inputs) {
    // Create list of resources for this task
    var resources = [];

    // Use task ID for unique job ID and output folder
    var id = state.taskId;

    // Get current timestamp to use in Job notes
    var date = new Date();

    // Create Job resource
    var createJob = new CreateJobResource(1);
    createJob.id = id;
    createJob.notes = "Hot Folder '" + state.name + "' " + date;
    resources.push(createJob);

    // Add products resource
    var addProducts = new AddProductsResource(2);

    // Add all products from inputs
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];

        // Move input to processed folder first so file is not processed again
        // and product.artwork is set to correct file path below
        if (!input.moveToProcessed()) {
            continue;
        }

        var product = new AddProductEntity();
        product.artwork = input.path;
        addProducts.add(product);
    }

    resources.push(addProducts);

    var outputPath = id  + "-" + dateTimeFileName();

    // Export pdf resource
    var pdf = new ExportPdfResource("print/" + outputPath + ".pdf", 4);
    resources.push(pdf);

    // Save job resource
    var job = new SaveJobResource("phx/" + outputPath + ".phx", 5);
    resources.push(job);

    // Save job report
    var report = new ExportPdfReportResource("report/" + outputPath + "-report.pdf", 6);
    report.preset = "Example"
    resources.push(report);

    return resources;
}

function dateTimeFileName() {
    var date = new Date();

    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-"
          + date.getDate() + "_" + (date.getHours() + 1) + "-"
          + (date.getMinutes() + 1) + "-" + (date.getSeconds() + 1);
}
