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

export default class SamplesModal extends LightningModal {
  @track status = {
    showRecordForm: false,
  };

  get computeButtonLabel() {
    const view =
      this.template.querySelector("c-lwc-dynamic-record-edit-form")?.view ??
      null;
    return view === "record-edit-form" ? "Save" : "Next";
  }

  handleClickCancelButton() {
    this.close();
  }

  handleClickActionButton() {}
}
