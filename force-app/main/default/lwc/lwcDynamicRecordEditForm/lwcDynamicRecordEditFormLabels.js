export const DEFAULT_LABELS = {
  CANCEL: "Cancel",
  SAVE: "Save",
  SELECT_A_RECORD_TYPE: "Select a record type",
  LOADING_OBJECT_INFO: "Loading object info...",
};

export function setLabels(value) {
  if (typeof value !== "object" || !value) {
    return DEFAULT_LABELS;
  }

  return { ...DEFAULT_LABELS, ...value };
}
