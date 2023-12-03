import {
  deepCopy,
  guid,
  sortByEvenIndex,
} from "./lwcDynamicRecordEditFormUtils";

export function processLayoutSections({
  recordInfo,
  fieldsProperties,
  fieldsToIgnore = [],
  fieldsToShow = [],
  values = null,
  debug = false,
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
          overrideValues(component, values); // override values with custom defined property
        });
      });
    });
  });

  addFieldsToShowToLayout({
    layoutComponents: sections,
    fieldsToShow,
    fieldsProperties,
    values,
    debug,
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

  if (debug) {
    console.info(
      "[LwcDynamicRecordEditForm] Processed Sections",
      filteredSections
    );
  }

  return filteredSections;
}

function addFieldsToShowToLayout({
  layoutComponents,
  fieldsToShow = [],
  fieldsProperties,
  values = null,
  debug = false,
}) {
  if (
    !Array.isArray(fieldsToShow) ||
    !fieldsToShow.length ||
    !Array.isArray(layoutComponents) ||
    !layoutComponents.length
  ) {
    return; // no need to check
  }

  const fieldsToAppend = fieldsToShow.filter(
    (fieldToShow) =>
      !checkIfFieldIsInLayout({
        layoutComponents,
        fieldToShow,
        fieldsProperties,
      })
  );
  if (debug) {
    console.info("[LwcDynamicRecordEditForm] Fields to append", fieldsToAppend);
  }

  if (fieldsToAppend.length) {
    layoutComponents.push({
      id: guid(),
      heading: "",
      columns: 1,
      layoutRows: [
        {
          layoutItems: computeFieldsToAppendLayoutItems(
            fieldsToAppend,
            fieldsProperties,
            values
          ),
        },
      ],
    });
  }
}

function computeFieldsToAppendLayoutItems(
  fieldsToAppend,
  fieldsProperties,
  values
) {
  return fieldsToAppend.map((fieldToShow) => ({
    _id: guid(),
    _elementLabel: "",
    _disabled: false,
    layoutComponents: computeLayoutComponentsForFieldsToAppend(
      fieldToShow,
      fieldsProperties,
      values
    ),
  }));
}

/**
 * @description compute the layout components for the fields to append
 * @param {string} apiName api name of the field to append
 * @param {object[]} fieldProperties field properties from object info
 * @param {object[]} values custom defined values to override the default ones
 * @returns
 */
function computeLayoutComponentsForFieldsToAppend(
  apiName,
  fieldProperties,
  values
) {
  const { value, disabled, hidden } = values[apiName] || {};

  return [
    {
      apiName,
      _value: value ?? undefined,
      _required: computeRequiredPropertyForFieldToAppend(
        apiName,
        fieldProperties,
        values
      ),
      _disabled: typeof disabled === "boolean" ? disabled : undefined,
      _computedClasses: hidden === true ? "slds-hide" : undefined,
    },
  ];
}

function computeRequiredPropertyForFieldToAppend(
  apiName,
  fieldProperties,
  values
) {
  if (values[apiName]?.required) {
    return values[apiName].required;
  }

  if (!fieldProperties[apiName]) {
    return false;
  }

  if (fieldProperties[apiName]?.dataType?.toLowerCase() === "boolean") {
    return false; // Boolean / checkbox fields return always as required from the getObjectInfos API
  }

  return fieldProperties[apiName]?.required ?? false;
}

function checkIfFieldIsInLayout({
  layoutComponents,
  fieldToShow,
  fieldsProperties,
}) {
  const normalizedField = fieldToShow?.trim()?.toLowerCase();
  if (!normalizedField) {
    return true; // no need to check invalid field
  }
  if (!fieldsProperties[fieldToShow]) {
    console.warn(
      "[LwcDynamicRecordEditForm] Field not found in the objectInfo",
      fieldToShow
    );
    return true; // field not found in object info (maybe it's deleted/no access)
  }

  return layoutComponents.some(({ layoutRows }) =>
    layoutRows.some(({ layoutItems }) =>
      layoutItems.some(({ layoutComponents }) =>
        layoutComponents.some(
          ({ apiName }) => apiName && apiName?.toLowerCase() === normalizedField
        )
      )
    )
  );
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
    component._required = value.required;
  }
  if (value.hasOwnProperty("disabled") && typeof value.disabled === "boolean") {
    component._disabled = value.disabled;
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
