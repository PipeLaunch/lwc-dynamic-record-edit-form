/**
 * @description Extracts record types from object info payload
 * selects the default record type
 * @example
 * [
 *  {
 *     id: '012000000000000AAA',
 *     name: 'Record Type 1',
 *     selected: true
 *   },
 * ]
 * @param {*} objectInfo
 * @returns {Array} Array of record types, empty if no record types
 */
export function extractRecordTypes(objectInfo) {
  if (
    !objectInfo?.recordTypeInfos ||
    !Object.keys(objectInfo.recordTypeInfos).length
  ) {
    return [];
  }

  const recordTypeInfosArray = [];

  for (const key in objectInfo.recordTypeInfos) {
    const recordTypeInfo = objectInfo.recordTypeInfos[key];
    if (
      !recordTypeInfo.available ||
      recordTypeInfo.name?.toLowerCase() === "master"
    ) {
      continue;
    }

    recordTypeInfosArray.push({
      id: recordTypeInfo.recordTypeId,
      name: recordTypeInfo.name,
      selected: recordTypeInfo.defaultRecordTypeMapping,
    });
  }

  return recordTypeInfosArray;
}

/**
 * @description Checks if the object has multiple record types
 * 1 record type is considered as no record types (master)
 * @param {*} recordTypes
 * @returns {boolean} true if multiple record types
 */
export function hasMultipleRecordTypes(recordTypes) {
  return recordTypes && recordTypes.length > 1;
}

export function getDefaultRecordTypeId(recordTypes) {
  if (!recordTypes || !recordTypes.length) {
    return null;
  }

  return recordTypes.find((recordType) => recordType.selected)?.id;
}

export function computeRadioRecordTypesOptions(recordTypes) {
  return recordTypes.map((recordType) => ({
    label: recordType.name,
    value: recordType.id,
  }));
}
