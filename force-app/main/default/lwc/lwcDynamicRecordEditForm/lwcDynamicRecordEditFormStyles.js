export function computeRecordTypeFooterClasses(footerStyle, footerClasses) {
  const classes = [];

  if (footerStyle === "modal") {
    classes.push(
      "slds-modal__footer",
      "slds-var-m-top_medium",
      "slds-text-align_right"
    );
  }

  if (footerClasses) {
    classes.push(footerClasses);
  }

  return classes.join(" ");
}

export function computeRecordFormFooterClasses(footerStyle, footerClasses) {
  const classes = [];

  if (footerStyle === "modal") {
    classes.push(
      "slds-modal__footer",
      "slds-var-m-top_medium",
      "slds-text-align_center"
    );
  }

  if (footerClasses) {
    classes.push(footerClasses);
  }

  return classes.join(" ");
}
