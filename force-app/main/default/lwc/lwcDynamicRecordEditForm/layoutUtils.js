import { deepCopy, guid } from "./lwcDynamicRecordEditFormUtils";

export function processLayoutSections({
  recordInfo,
  fieldsProperties,
  fieldsToIgnore = [],
}) {
  if (
    !Array.isArray(recordInfo?.layout?.sections) ||
    !recordInfo.layout.sections.length
  ) {
    return [];
  }

  // clone the layout object. Needed to manipulate the object received
  const sections = deepCopy(recordInfo.layout.sections);

  sections.forEach((section) => {
    section.layoutRows.forEach((row) => {
      row.layoutItems.forEach((layoutItem) => {
        layoutItem._id = guid(); // add unique id for iterating on the template

        // remove fields that are in the exclude list (already hardcoded on the modal form)
        // layoutItem.layoutComponents = layoutItem.layoutComponents.filter(
        //   (component) => !fieldsToExclude.includes(component.apiName)
        // );

        // only show element label if needed (e.g. other address -> compound field)
        layoutItem._elementLabel =
          hasComponentWithSameLabel(
            layoutItem.label,
            layoutItem.layoutComponents
          ) || layoutItem.layoutComponents.length < 2
            ? ""
            : layoutItem.label;

        // check if the field is required by receiving data from the object info
        layoutItem.layoutComponents.forEach((component) => {
          // if (sObjectObjectInfoFields[component.apiName]) {
          //   if (
          //     sObjectObjectInfoFields[
          //       component.apiName
          //     ].dataType.toLowerCase() === "boolean"
          //   ) {
          //     component._required = false; // Boolean / checkbox fields return always as required from the getObjectInfos API
          //   } else {
          //     component._required =
          //       sObjectObjectInfoFields[component.apiName].required;
          //   }
          // }
        });
        // layoutItem._disabled = !layoutItem.editableForNew;
      });
    });
  });

  // sort array because with 2 columns layout the order is not correct

  console.log("sections", sections);

  for (const section of sections) {
    if (section.columns === 2) {
      section.layoutRows = sortByEvenIndex(section.layoutRows);
    }
  }

  console.log("sections sorted", sections);

  return sections;
}

function hasComponentWithSameLabel(label, layoutComponents) {
  return layoutComponents.some((component) => component.label === label);
}

function sortByEvenIndex(arr) {
  const evenIndexItems = [];
  const oddIndexItems = [];

  arr.forEach((item, index) => {
    if (index % 2 === 0) {
      oddIndexItems.push(item);
    } else {
      evenIndexItems.push(item);
    }
  });

  return evenIndexItems.concat(oddIndexItems);
}
