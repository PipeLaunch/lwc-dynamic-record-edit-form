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
import CUSTOM_LABELS from "./labels";

export default class Samples extends LightningElement {
  labels = CUSTOM_LABELS;

  values = {
    Email__c: {
      value: "sample@gmail.com",
      required: true,
    },
    Name: {
      hidden: true,
    },
  };

  values2 = {
    Rating__c: {
      hidden: true,
    },
  };

  fieldsToIgnore = ["Value__c", "OwnerId", "Name"];

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
