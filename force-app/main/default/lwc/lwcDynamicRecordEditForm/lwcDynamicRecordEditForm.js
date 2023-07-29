/**
 * @description       :
 * @author            : samuel@pipelaunch.com
 * @group             : LWC Dynamic Record Edit Form
 * @last modified on  : 2023-07-29
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
import { processLayoutSections } from "./layoutUtils";
import * as styles from "./lwcDynamicRecordEditFormStyles";
export default class LwcDynamicRecordEditForm extends LightningElement {
  /**
   * @property {boolean} debug - true to see debug messages in the console.
   */
  @api debug = false;

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

  /**
   * @property {boolean} disableRecordTypeSupport - Disable the record type selection
   */
  @api disableRecordTypeSupport = false;

  /**
   * @property {boolean} hideLoadingRecordForm - Hide the loading stencil for the record form
   */
  @api hideLoadingRecordForm = false;

  /**
   * @property {string[]} fieldsToIgnore - Array of then fields API name to ignore. E.g. manually added to the form on the slot
   */
  @api fieldsToIgnore = [];

  /**
   * @property {boolean} accordion - Show collapsible accordion
   */
  @api accordion = false;

  /**
   * @property {"modal"|"simple"} footerStyle - Style for the footer
   */
  @api footerStyle = "";

  /**
   * @property {string} recordTypeFooterClasses - Custom classes for the footer on the record type selection view
   */
  @api recordTypeFooterClasses = "";

  /**
   * @property {string} recordFormFooterClasses - Custom classes for the footer on the record edit form view
   */
  @api recordFormFooterClasses = "";

  /**
   * @property {boolean} showFooter - Show the footer with native buttons
   */
  @api showFooter = false;

  /**
   * @property {object} values - default values to be applied
   * format
   * {
   *    objectApiName: {
   *      value: "default value",
   *      hidden: true, // hide on the page (css hidden class)
   *      required: true, // force to make it required
   *      disabled: true, // force to make it disabled
   *    }
   * }
   */
  @api values = null;

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
    recordFormLoading: true, // true while it's loading the record edit form component
    loading: false, // initial loading
    overlayLoading: false, // show an overlay loading when submitting the form to prevent any interaction
    loadingMessage: DEFAULT_LABELS.LOADING_OBJECT_INFO,
    showRecordTypeSelection: false,
  };

  _recordTypes = []; // Array of record types, empty if no record types
  selectedRecordTypeId = null; // The ID of the selected record type
  @track layoutSections = []; // Array of page layout sections
  _fieldsProperties = {}; // Object with the properties of the fields fetched from the getObjectInfo

  @wire(getObjectInfo, {
    objectApiName: "$objectApiName",
  })
  async getObjectInfoResponse(response) {
    try {
      if (response.data) {
        if (this.debug) {
          console.info(
            "[LwcDynamicRecordEditForm] Wire getObjectInfo response",
            response.data
          );
        }
        this._processGetObjectInfoResponse(response.data);
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

  /**
   * @description reset the form fields
   */
  @api reset() {
    const inputFields = this.template.querySelectorAll("lightning-input-field");
    if (inputFields) {
      inputFields.forEach((field) => {
        field.reset();
      });
    }
  }

  /**
   * @description submits the form or the record type selection
   * depending on the current view
   */
  @api submit() {
    if (this.status.showRecordTypeSelection) {
      this._nextStep();
    } else {
      this.template.querySelector("lightning-record-edit-form")?.submit();
    }
  }

  /**
   * @description get the current view
   * @returns {string} record-type or record-edit-form
   */
  @api get view() {
    return this.status.showRecordTypeSelection
      ? "record-type"
      : "record-edit-form";
  }

  @api setValues(values) {
    this._setValues(values);
  }

  @api setValue(fieldName, value) {
    this._setValue(fieldName, value);
  }

  /**
   * @type {Object[]} Array of record types options
   */
  get computeRadioRecordTypesOptions() {
    return computeRadioRecordTypesOptions(this._recordTypes);
  }

  /**
   * @type {string} Classes for the footer on the record type selection view
   */
  get computeRecordTypeFooterClasses() {
    return styles.computeRecordTypeFooterClasses(
      this.footerStyle,
      this.recordTypeFooterClasses
    );
  }

  /**
   * @type {string} Classes for the footer on the record edit form view
   */
  get computeRecordFormFooterClasses() {
    return styles.computeRecordFormFooterClasses(
      this.footerStyle,
      this.recordFormFooterClasses
    );
  }

  handleError(evt) {
    this.status.overlayLoading = false;
    this.status.recordFormLoading = false;

    console.error(
      "[LwcDynamicRecordEditForm] Record form error payload",
      evt.detail
    );

    this._dispatchEvent("error", evt.detail);
  }

  /**
   * @description handle the onload event of the record form
   * @param {*} evt
   * @returns void
   */
  handleLoad(evt) {
    if (!this.status.recordFormLoading) {
      return; // only run once
    }
    if (this.debug) {
      console.info(
        "[LwcDynamicRecordEditForm] Record form onload payload",
        evt.detail
      );
    }

    this.layoutSections = processLayoutSections({
      recordInfo: evt.detail,
      fieldsProperties: this._fieldsProperties,
      fieldsToIgnore: this.fieldsToIgnore,
      values: this.values,
      debug: this.debug,
    });

    this.status.recordFormLoading = false;
  }

  handleSuccess(evt) {
    this.status.overlayLoading = false;

    if (this.debug) {
      console.info(
        "[LwcDynamicRecordEditForm] Record form onsuccess payload",
        evt.detail
      );
    }
    this._dispatchEvent("success", evt.detail);
  }

  handleSubmit(evt) {
    this.status.overlayLoading = true;

    if (this.debug) {
      console.info(
        "[LwcDynamicRecordEditForm] Record form onsubmit payload",
        evt.detail
      );
    }
    this._dispatchEvent("submit", evt.detail);
  }

  handleClickCancelButton() {
    this._dispatchEvent("close");
  }

  handleSlotValueChange(evt) {
    evt.stopPropagation(); // stop the event from bubbling up (required)
    if (this.debug) {
      console.info("Slot change event", evt.detail);
    }

    this._setValues(evt.detail);
  }

  handleClickSaveButton() {
    this._dispatchEvent("save");
  }

  /**
   * @description click next when selecting a record type
   */
  handleClickNextButton() {
    this._nextStep();
  }

  handleChangeRadioRecordType(evt) {
    this.selectedRecordTypeId = evt.detail.value;
    if (this.debug) {
      console.info(
        "[LwcDynamicRecordEditForm] Selected RecordType Id",
        this.selectedRecordTypeId
      );
    }
  }

  _init() {
    this.status.loading = true;
    this.status.loadingMessage = DEFAULT_LABELS.LOADING_OBJECT_INFO;
  }

  _nextStep() {
    if (this.selectedRecordTypeId) {
      this._dispatchEvent("recordtypeselected", {
        id: this.selectedRecordTypeId,
        name:
          this._recordTypes.find((rt) => rt.id === this.selectedRecordTypeId)
            ?.name || "",
      });
      this.status.showRecordTypeSelection = false;
    }
  }

  _processGetObjectInfoResponse(objectInfo) {
    this._fieldsProperties = objectInfo.fields; // save the original fields properties

    this._recordTypes = extractRecordTypes(objectInfo);
    this.selectedRecordTypeId = getDefaultRecordTypeId(this._recordTypes);

    const showRecordTypeSelection =
      !this.disableRecordTypeSupport &&
      hasMultipleRecordTypes(this._recordTypes);
    if (showRecordTypeSelection) {
      this._dispatchEvent("recordtypeselection");
    }
    this.status.showRecordTypeSelection = showRecordTypeSelection;

    if (this.debug) {
      console.info("[LwcDynamicRecordEditForm] RecordTypes", this._recordTypes);
    }
  }

  _setValues(values) {
    if (!values || !Array.isArray(values) || values.length === 0) {
      return;
    }

    values.forEach((value) => {
      this._setValue(value.apiName, value.value);
    });
  }

  _setValue(fieldName, value) {
    const inputFields = this.template.querySelectorAll("lightning-input-field");
    if (inputFields) {
      inputFields.forEach((field) => {
        if (field.fieldName?.toLowerCase() === fieldName?.toLowerCase()) {
          field.value = value;
        }
      });
    }
  }

  _dispatchEvent(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        composed: this.propagateEvents,
        bubbles: this.propagateEvents,
      })
    );
  }
}
