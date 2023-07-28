/**
 * @description       :
 * @author            : samuel@pipelaunch.com
 * @group             :
 * @last modified on  : 2023-07-28
 * @last modified by  : samuel@pipelaunch.com
 * Modifications Log
 * Ver   Date         Author                  Modification
 * 1.0   2023-07-27   samuel@pipelaunch.com   Initial Version
 **/
import { track } from "lwc";
import LightningModal from "lightning/modal";

import { toast, errorToast } from "c/utilsToast";
export default class SamplesModal extends LightningModal {
  @track status = {
    recordTypeName: null,
  };

  get computeButtonLabel() {
    const view =
      this.template.querySelector("c-lwc-dynamic-record-edit-form")?.view ??
      null;
    return view === "record-edit-form" ? "Save" : "Next";
  }

  get computeModalHeader() {
    if (this.status.recordTypeName) {
      return `New Contact: ${this.status.recordTypeName}`;
    }
    return "New Contact";
  }

  handleError(evt) {
    // error is handled by the form
    // errorToast("Unexpected error creating record", evt.detail);
  }

  handleSuccess(evt) {
    this._showSuccessToast(evt.detail);
    this.close();
  }

  handleClickCancelButton() {
    this.close();
  }

  handleClickActionButton() {
    this.template.querySelector("c-lwc-dynamic-record-edit-form")?.submit();
  }

  handlerRecordTypeSelected(evt) {
    this.status.recordTypeName = evt.detail.name ?? null;
  }

  _showSuccessToast(data) {
    const firstName = data?.fields?.FirstName?.value ?? "";
    const lastName = data?.fields?.LastName?.value ?? "";
    const name = `${firstName} ${lastName}`.trim();

    const messageData = [
      {
        url: `/lightning/r/Contact/${data.id}/view`,
        label: name,
      },
    ];

    toast({
      title: " ",
      message: "Contact {0} was created.",
      messageData,
      variant: "success",
    });
  }
}
