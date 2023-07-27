/**
 * @description       : Sample usage of the custom component
 * @group             : Generic Components
 * @author            : samuel@pipelaunch.com
 * @last modified on  : 2023-07-27
 * @last modified by  : samuel@pipelaunch.com
 **/
import { LightningElement } from "lwc";

export default class Samples extends LightningElement {
  values = {
    Email__c: {
      value: "sample@gmail.com",
    },
  };
}
