/**
 * @description       :
 * @author            : samuel@pipelaunch.com
 * @group             :
 * @last modified on  : 2023-07-26
 * @last modified by  : samuel@pipelaunch.com
 * Modifications Log
 * Ver   Date         Author                  Modification
 * 1.0   2023-07-26   samuel@pipelaunch.com   Initial Version
 **/
import { LightningElement, api, track } from "lwc";

import template_recordTypeSelection from "./templates/recordTypeSelection.html";
import template_loading from "./templates/loading.html";
import template_recordEditForm from "./templates/recordEditForm.html";

import { DEFAULT_LABELS, setLabels } from "./lwcDynamicRecordEditFormLabels";
export default class LwcDynamicRecordEditForm extends LightningElement {
  /**
   * @property {string} objectApiName - The API name of the object.
   */
  @api objectApiName;

  /**
   * @property {string} density - Sets the arrangement style of fields and labels in the form.
   * Accepted values are compact, comfy, and auto (default).
   * Use compact to display fields and their labels on the same line.
   * Use comfy to display fields below their labels.
   * Use auto to let the component dynamically set
   * the density according to the user's Display Density setting
   * and the width of the form.
   */
  @api density = "auto";

  /**
   * @property {string} formClass - A CSS class for the form element.
   */
  @api formClass = "";

  /**
   * @property {string} recordTypeId - The ID of the record type, which is required if you created
   * multiple record types but don't have a default.
   */
  @api recordTypeId;

  /**
   * @property {boolean} propagateEvents - Propagate events up with bubble and composed to use when the component is nested
   */
  @api propagateEvents = false;

  /**
   * @property {object} labels - An object with the labels for the component.
   */
  @api get labels() {
    return this._labels;
  }
  _labels = DEFAULT_LABELS;
  set labels(value) {
    this._labels = setLabels(value);
  }

  @track status = {
    loading: true,
    loadingMessage: DEFAULT_LABELS.LOADING_OBJECT_INFO,
  };

  render() {
    if (this.status.loading) {
      return template_loading;
    }
    return template_recordEditForm;
  }

  @api
  reset() {
    const inputFields = this.template.querySelectorAll("lightning-input-field");
    if (inputFields) {
      inputFields.forEach((field) => {
        field.reset();
      });
    }
  }

  handleError(evt) {}

  handleLoad(evt) {}

  handleSuccess(evt) {}

  handleClickCancelButton() {
    this.dispatchEvent(
      new CustomEvent("close", {
        composed: this.propagateEvents,
        bubbles: this.propagateEvents,
      })
    );
  }

  handleClickSaveButton() {}

  handleChangeRadioRecordType(evt) {}
}