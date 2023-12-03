/**
 * @description       : Sample usage of the custom component
 * @group             : Generic Components
 * @author            : samuel@pipelaunch.com
 * @last modified on  : 2023-12-03
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
    Field_Not_Visible__c: {
      value: "this field is not visible in the layout",
    },
    Field_Not_Visible_2__c: {
      value: 5,
      hidden: true,
    },
  };

  values2 = {
    Rating__c: {
      hidden: true,
    },
  };

  fieldsToIgnore = ["Value__c", "OwnerId", "Name"];

  fieldsToShow = [
    "Field_Not_Visible__c",
    "Field_Not_Visible_2__c",
    "INVALID_FIELD__c",
  ];

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
