import { LightningElement, api } from "lwc";

export default class Pagination extends LightningElement {
  totalRecords;
  recordSize = 10;
  @api
  set records(data) {
    if (data) {
      this.totalRecords = data;
      this.visibleRecords = data.slic(0, this.recordSize);
      this.totalPage = Math.ceil(data.length / this.recordSize);
      this.updateRecords();
    }
  }
  previousHandler() {}
  nextHandler() {}
  updateRecords() {
    this.dispatchEvent(
      new CustomEvent("update", {
        detail: {
          records: this.visibleRecords
        }
      })
    );
  }
}
