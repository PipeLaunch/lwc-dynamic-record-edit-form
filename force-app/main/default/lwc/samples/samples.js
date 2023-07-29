/**
 * @description       : Sample usage of the custom component
 * @group             : Generic Components
 * @author            : samuel@pipelaunch.com
 * @last modified on  : 2023-07-29
 * @last modified by  : samuel@pipelaunch.com
 **/
import { LightningElement } from "lwc";

import samplesModal from "c/samplesModal";
import { toast } from "c/utilsToast";

export default class Samples extends LightningElement {
  values = {
    Email__c: {
      value: "sample@gmail.com",
      required: true,
    },
    Name: {
      hidden: true,
    },
  };

  fieldsToIgnore = ["Value__c", "OwnerId", "Name"]; // Rating__c

  async handleClickButtonShowModal() {
    await samplesModal.open({
      size: "small",
      description: "Modal test",
    });
  }

  handleSuccess() {
    toast({ title: "Record created", variant: "success" });
  }

  handleSliderChange(evt) {
    const VALUE_MAP = ["Bad", "Average", "Good", "Excellent"];
    const value = VALUE_MAP[evt.detail.value];
    this.refs.ratingForm?.setValue("Rating__c", value);
  }
}
