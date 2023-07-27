/**
 * @description       :
 * @author            : samuel@pipelaunch.com
 * @group             : LWC Dynamic Record Edit Form
 * @last modified on  : 2023-07-27
 * @last modified by  : samuel@pipelaunch.com
 * Modifications Log
 * Ver   Date         Author                  Modification
 * 1.0   2023-07-26   samuel@pipelaunch.com   Initial Version
 **/
import { LightningElement, api, track, wire } from "lwc";

import { getObjectInfo } from "lightning/uiObjectInfoApi";

import template_recordTypeSelection from "./templates/recordTypeSelection.html";
import template_loading from "./templates/loading.html";
import template_recordEditForm from "./templates/recordEditForm.html";
import { DEFAULT_LABELS, setLabels } from "./lwcDynamicRecordEditFormLabels";
import {
  extractRecordTypes,
  hasMultipleRecordTypes,
  computeRadioRecordTypesOptions,
  getDefaultRecordTypeId,
} from "./recordTypesUtils";
import { computeLayoutSections } from "./layoutUtils";
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
   * TODO: handle manual setting of record type
   */
  @api recordTypeId;

  /**
   * @property {boolean} propagateEvents - Propagate events up with bubble and composed to use when the component is nested
   */
  @api propagateEvents = false;

  @api disableRecordTypeSupport = false;

  /**
   * @property {boolean} hideLoadingRecordForm - Hide the loading stencil for the record form
   */
  @api hideLoadingRecordForm = false;

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
    recordFormLoading: true,
    loading: false,
    loadingMessage: DEFAULT_LABELS.LOADING_OBJECT_INFO,
    showRecordTypeSelection: false,
  };

  _objectApiName = null; // The API name of the object.
  _recordTypes = []; // Array of record types, empty if no record types
  selectedRecordTypeId = null; // The ID of the selected record type
  layoutSections = []; // Array of page layout sections

  @wire(getObjectInfo, {
    objectApiName: "$_objectApiName",
  })
  async getObjectInfoResponse(response) {
    try {
      if (response.data) {
        console.info("response.data", response.data);
        this._processRecordTypes(response.data);
        this.status.loading = false;
      } else if (response.error) {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error("Unexpected error on getting object info", err);
      this.status.loading = false;
    }
  }

  connectedCallback() {
    this.disableRecordTypeSupport = true;
    this._init();
  }

  errorCallback(error, stack) {
    console.error("Unexpected major error", error, stack);
  }

  render() {
    if (this.status.loading) {
      return template_loading;
    }
    if (this.status.showRecordTypeSelection) {
      return template_recordTypeSelection;
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

  /**
   * @type {Object[]} Array of record types options
   */
  get computeRadioRecordTypesOptions() {
    return computeRadioRecordTypesOptions(this._recordTypes);
  }

  get computeRadioRecordTypeValue() {}

  get computeShowRecordEditFormLoading() {
    return this.status.recordFormLoading;
  }

  handleError(evt) {
    this.status.recordFormLoading = false;
  }

  handleLoad(evt) {
    console.info("handle load", evt.detail);
    this.layoutSections = computeLayoutSections(evt.detail);
    this.status.recordFormLoading = false;
  }

  handleSuccess(evt) {}

  handleClickCancelButton() {
    this.dispatchEvent(
      new CustomEvent("close", {
        composed: this.propagateEvents,
        bubbles: this.propagateEvents,
      })
    );
  }

  handleSlotValueChange(evt) {
    evt.stopPropagation(); // stop the event from bubbling up (required)
    console.log("evt", evt.detail);
  }

  handleClickSaveButton() {}

  handleClickNextButton() {
    if (this.selectedRecordTypeId) {
      this.status.showRecordTypeSelection = false;
    }
  }

  handleChangeRadioRecordType(evt) {
    this.selectedRecordTypeId = evt.detail.value;
    console.info("this.selectedRecordTypeId", this.selectedRecordTypeId);
  }

  _init() {
    if (!this.disableRecordTypeSupport) {
      this.status.loading = true;
      this.status.loadingMessage = DEFAULT_LABELS.LOADING_OBJECT_INFO;
      this._objectApiName = this.objectApiName;
    }
  }

  _processRecordTypes(objectInfo) {
    this._recordTypes = extractRecordTypes(objectInfo);
    this.selectedRecordTypeId = getDefaultRecordTypeId(this._recordTypes);
    this.status.showRecordTypeSelection = hasMultipleRecordTypes(
      this._recordTypes
    );
    console.log("this._recordTypes", this._recordTypes);
  }
}
