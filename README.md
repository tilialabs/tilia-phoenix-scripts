# tilia-phoenix-scripts

This is a repository for common marks built for tilia Phoenix. Inside you can find examples, screenshots, and sample files to illustrate the possibilities with scripting inside of Phoenix, as well as provide examples you can use and repurpose for your own needs. There are multiple areas of Phoenix that can take advantage of scripting, provided that you have a license for the Scripting module: 

- Script Marks
- Imposition AI Scripts
- Hotfolder Scripts
- Thing Scripting

## Script Marks
Script marks allow you to draw customized scripted marks to fulfill nearly any custom mark needs you may have. Script marks are loaded or copied and pasted into the Mark Wizard and can be added to layouts or products manually, or through automation. 

You can find example scripts in the [Script Marks directory](https://github.com/tilialabs/tilia-phoenix-scripts/blob/master/Script%20Marks) to help you understand how scripting works, as well as help with some common scripting needs. More examples will be added over time, so check back later for more examples. Keep in mind that Tilia Labs does offer solution services for building custom marks, so [reach out to your salesperson](mailto:sales@tilialabs.com) to inquire about scripting today!

### Derived Sheet Mark
This mark was created to easily identify the parent sheet size from which a derived stock was created. Imposition AI has an option "Use derived sheets" which allows Phoenix to consider half and quarter sheet sizes. This mark simply adds some text to the layout to indicate the original sheet size.

![](https://github.com/tilialabs/tilia-phoenix-scripts/blob/master/Script%20Marks/Derived%20Sheet/derived-sheet-mark.png)

### Bleed Outline Mark
This mark finds all products on a layout, looks for a custom property "bleedValue", and draws a stroked rectangle around the product, offset by this "bleedValue" in the first ink color of the product.

![](https://github.com/tilialabs/tilia-phoenix-scripts/blob/master/Script%20Marks/Bleed%20Outline/bleed-outline-mark.png)


## Imposition AI

Imposition AI provides the option to run scripts when layout results are applied, providing some powerful tools to evaluate layouts, modify them, and access items within the layouts.

Scripts are placed in the *Scripts* tab of the Imposition AI profile, and are executed immediately when an Imposition AI result is applied.

Example scripts can be found in the [Imposition AI directory](https://github.com/tilialabs/tilia-phoenix-scripts/blob/master/Imposition%20AI) to help you understand how scripting works, as well as help with some common scripting needs. More examples will be added over time, so check back later for more examples. Keep in mind that Tilia Labs does offer solution services for building custom marks, so [reach out to your salesperson](mailto:sales@tilialabs.com) to inquire about scripting today!

### Derived Sheet Layout Property
This script was created to easily identify the parent sheet size from which a derived stock was created. Imposition AI has an option "Use derived sheets" which allows Phoenix to consider half and quarter sheet sizes. This script simply adds a custom layout property to call out the original sheet size.

![](https://github.com/tilialabs/tilia-phoenix-scripts/blob/master/Imposition%20AI/Derived%20Sheet/derived-sheet-impositionai.png)