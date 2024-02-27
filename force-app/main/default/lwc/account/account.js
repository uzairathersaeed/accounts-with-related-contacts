import { LightningElement, wire } from "lwc";
import getAccountsRecord from "@salesforce/apex/accountAndItsRelatedContacts.getAccountsRecord";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";

const columnsData = [
  {
    label: "Account Name",
    fieldName: "Id",
    type: "button",
    typeAttributes: {
      label: { fieldName: "Name" },
      title: "Click to view details",
      variant: "base",
      name: "view_details"
    }
  },
  {
    label: "Annual Revenue",
    fieldName: "AnnualRevenue"
  },
  {
    label: "Industry",
    fieldName: "Industry"
  },
  {
    label: "Phone",
    fieldName: "Phone"
  },
  {
    label: "Type",
    fieldName: "Type"
  }
];

export default class Account extends LightningElement {
  columns = columnsData;
  result;
  error;
  wiredResult;
  isLoading = true;
  isModalOpen = false;
  selectedAccountId = "";
  selectedAccountName;
  fields = ["Name", "AnnualRevenue", "Industry", "Phone", "Type"];

  showModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  handleRowAction(event) {
    const actionName = event.detail.action.name;
    console.log("Event Detail:", JSON.stringify(event.detail));
    console.log("action Name:", JSON.stringify(actionName));
    const accountName = event.detail.row.Name;
    console.log("account Name: ", accountName);

    if (actionName === "view_details") {
      const rowId = event.detail.row.Id;
      console.log("Selected Account ID:", rowId);
      this.selectedAccountId = rowId;
      console.log("selectedAccountId after update:", this.selectedAccountId);
      this.selectedAccountName = accountName;
      console.log("Selected Account Name: ", this.selectedAccountName);
    }
  }
  @wire(getAccountsRecord)
  allGetAccountsRecord(result) {
    this.wiredResult = result;
    if (result.data) {
      console.log("data", result.data);
      this.result = result.data;
      this.error = undefined;
      this.isLoading = false;
    } else if (result.error) {
      this.result = undefined;
      this.error = result.error;
    }
  }

  handleSuccess() {
    this.closeModal();
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: "Record Inserted Successfully",
        variant: "success"
      })
    );
    return refreshApex(this.wiredResult).catch((error) => {
      console.error("Error in Refresing Data...", error);
    });
  }
}
