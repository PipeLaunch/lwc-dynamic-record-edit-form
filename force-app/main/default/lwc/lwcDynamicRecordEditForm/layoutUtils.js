import {
  deepCopy,
  guid,
  sortByEvenIndex,
} from "./lwcDynamicRecordEditFormUtils";

export function processLayoutSections({
  recordInfo,
  fieldsProperties,
  fieldsToIgnore = [],
  values = null,
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

        layoutItem.layoutComponents.forEach((component) => {
          defineRequiredProperty(
            component,
            fieldsProperties[component.apiName]
          );
          overrideValues(component, values);
        });
      });
    });
  });

  // do not show empty sections (TODO: check also for hidden)
  const filteredSections = sections.filter((section) =>
    hasLayoutComponents(section)
  );

  // sort array because with 2 columns layout the order is not correct
  for (const section of filteredSections) {
    if (section.columns === 2) {
      section.layoutRows = sortByEvenIndex(section.layoutRows);
    }
  }

  console.info("sections sorted", filteredSections);

  return filteredSections;
}

/**
 * @description check if the field is required by receiving data from the object info
 * @param {*} component
 * @param {*} fieldProperty
 * @returns
 */
function defineRequiredProperty(component, fieldProperty) {
  if (!fieldProperty) {
    return;
  }

  if (fieldProperty?.dataType?.toLowerCase() === "boolean") {
    component._required = false; // Boolean / checkbox fields return always as required from the getObjectInfos API
  } else {
    component._required = fieldProperty.required;
  }
}

function overrideValues(component, values) {
  if (!values || !values[component.apiName]) {
    return; // no values to override
  }

  const value = values[component.apiName];
  if (value.hasOwnProperty("value")) {
    component._value = value.value;
  }
  if (value.hasOwnProperty("required") && typeof value.required === "boolean") {
    component._required = true;
  }
  if (value.hasOwnProperty("disabled") && typeof value.disabled === "boolean") {
    component._disabled = true;
  }
  if (value.hasOwnProperty("hidden") && typeof value.hidden === "boolean") {
    component._computedClasses = "slds-hide";
  }
}

function computeElementLabel(label, layoutComponents) {
  return layoutComponents.length < 2 ||
    hasComponentWithSameLabel(label, layoutComponents)
    ? ""
    : label;
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

function hasComponentWithSameLabel(label, layoutComponents) {
  return layoutComponents.some((component) => component.label === label);
}