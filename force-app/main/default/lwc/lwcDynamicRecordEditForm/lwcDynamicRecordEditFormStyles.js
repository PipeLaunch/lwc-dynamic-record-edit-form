export function computeRecordTypeFooterClasses(footerStyle, footerClasses) {
  const classes = [];

  if (footerStyle === "modal" || footerStyle === "simple") {
    classes.push("slds-var-m-top_medium", "slds-text-align_right");
  }
  if (footerStyle === "modal") {
    classes.push("slds-modal__footer");
  }
  if (footerStyle === "simple") {
    classes.push("slds-border_top", "slds-var-p-top_small");
  }

  if (footerClasses) {
    classes.push(footerClasses);
  }

  return classes.join(" ");
}

export function computeRecordFormFooterClasses(footerStyle, footerClasses) {
  const classes = [];

  if (footerStyle === "modal" || footerStyle === "simple") {
    classes.push("slds-var-m-top_medium", "slds-text-align_center");
  }
  if (footerStyle === "modal") {
    classes.push("slds-modal__footer");
  }
  if (footerStyle === "simple") {
    classes.push("slds-border_top", "slds-var-p-top_small");
  }

  if (footerClasses) {
    classes.push(footerClasses);
  }

  return classes.join(" ");
}
