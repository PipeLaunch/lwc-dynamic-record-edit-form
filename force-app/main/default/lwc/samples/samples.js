/**
 * @description       : Sample usage of the custom component
 * @group             : Generic Components
 * @author            : samuel@pipelaunch.com
 * @last modified on  : 2023-07-28
 * @last modified by  : samuel@pipelaunch.com
 **/
import { LightningElement } from "lwc";

import samplesModal from "c/samplesModal";

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

  async handleClickButtonShowModal() {
    await samplesModal.open({
      size: "small",
      description: "Modal test",
    });
  }
}
