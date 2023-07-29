/**
 * @description       :
 * @author            : samuel@pipelaunch.com
 * @group             :
 * @last modified on  : 2023-07-29
 * @last modified by  : samuel@pipelaunch.com
 * Modifications Log
 * Ver   Date         Author                  Modification
 * 1.0   2023-07-28   samuel@pipelaunch.com   Initial Version
 **/
import { LightningElement, track } from "lwc";

export default class SampleMockApiExchangeRate extends LightningElement {
  @track status = {
    loading: false,
    value: "-", // random number to store
  };

  /**
   * @description emulate api call with some delay
   * and a random value generated
   */
  async handleClick() {
    this.status.loading = true;
    await delay(2000);
    const value = randomNumber();
    this.status.value = value;
    this._dispatchEvent(value);
    this.status.loading = false;
  }

  _dispatchEvent(value) {
    this.dispatchEvent(
      new CustomEvent("slotvaluechange", {
        detail: [{ apiName: "Exchange_Rate__c", value }],
        composed: true,
        bubbles: true,
      })
    );
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomNumber() {
  return Math.round(Math.random() * (10 - 1) + 1);
}
