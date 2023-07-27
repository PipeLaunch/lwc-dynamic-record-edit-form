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

  if (Array.isArray(fieldsToIgnore) && fieldsToIgnore.length) {
  }

  sections.forEach((section) => {
    section.layoutRows.forEach((row) => {
      row.layoutItems.forEach((layoutItem) => {
        layoutItem._id = guid(); // add unique id for iterating on the template

        // remove fields that are in the exclude list
        layoutItem.layoutComponents = ignoreFields(
          fieldsToIgnore,
          layoutItem.layoutComponents
        );

        // only show element label if needed (e.g. other address -> compound field)
        layoutItem._elementLabel = computeElementLabel(
          layoutItem.label,
          layoutItem.layoutComponents
        );

        layoutItem._disabled = !layoutItem.editableForNew;

        // check if the field is required by receiving data from the object info
        layoutItem.layoutComponents.forEach((component) => {
          if (fieldsProperties[component.apiName]) {
            if (
              fieldsProperties[component.apiName]?.dataType?.toLowerCase() ===
              "boolean"
            ) {
              component._required = false; // Boolean / checkbox fields return always as required from the getObjectInfos API
            } else {
              component._required =
                fieldsProperties[component.apiName].required;
            }
          }
        });
      });
    });
  });

  // sort array because with 2 columns layout the order is not correct

  // do not show empty sections
  const filteredSections = sections.filter((section) =>
    hasLayoutComponents(section)
  );

  console.log("sections", filteredSections);

  for (const section of filteredSections) {
    if (section.columns === 2) {
      section.layoutRows = sortByEvenIndex(section.layoutRows);
    }
  }

  console.log("sections sorted", filteredSections);

  return filteredSections;
}

function computeElementLabel(label, layoutComponents) {
  return layoutComponents.length < 2 ||
    hasComponentWithSameLabel(label, layoutComponents)
    ? ""
    : label;
}

function hasLayoutComponents(section) {
  return (
    Array.isArray(section.layoutRows) &&
    section.layoutRows.some((row) =>
      row.layoutItems.some(
        (layoutItem) =>
          Array.isArray(layoutItem.layoutComponents) &&
          layoutItem.layoutComponents.length
      )
    )
  );
}

function ignoreFields(fieldsToIgnore, layoutComponents) {
  if (!Array.isArray(fieldsToIgnore) || !fieldsToIgnore.length) {
    return layoutComponents;
  }

  const normalizedFieldsToIgnore = fieldsToIgnore.map((field) =>
    field?.trim()?.toLowerCase()
  );

  return layoutComponents.filter(
    (component) =>
      !normalizedFieldsToIgnore.includes(component.apiName?.toLowerCase())
  );
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
