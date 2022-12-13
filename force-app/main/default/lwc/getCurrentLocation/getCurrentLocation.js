import { LightningElement, api,track } from "lwc";
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import saveLocation from "@salesforce/apex/locationController.saveLocation";
export default class navigateToRecordAction extends LightningElement {
    @api objectApiName;
    @api recordId;
    @track latitude=0;
    @track longitude=0;
    @api invoke() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              this.latitude = position.coords.latitude;
              this.longitude = position.coords.longitude;
            saveLocation({objectApiName: this.objectApiName,recordId: this.recordId,latitude:this.latitude,longitude:this.longitude})
              .then(() => {
              const evt = new ShowToastEvent({
                title: 'Geolocation Saved',
                message: 'Current Location Captured',
                variant: 'success',
              });
              this.dispatchEvent(evt);
              eval("$A.get('e.force:refreshView').fire();");
            });
        });
          } else {
            const evt = new ShowToastEvent({
              title: 'Geolocation is not supported by browser',
              message: 'Check your browser options or use another browser',
              variant: 'error',
            });
            this.dispatchEvent(evt);
          }
    }
}
