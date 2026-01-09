import { LightningElement,wire,api,track } from 'lwc';
import getSuggestions from '@salesforce/apex/AutoCompleteServicesExtension.getSuggestions';
export default class AutoCompleteDemo extends LightningElement {
    @api searchRecords = [];
    @api required = false;
    @track txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    @track street;
    @track city;
    @track state;
    @track zip;
    @track isDataAvailable = false;

    searchField(event) {
        this.isDataAvailable = true;
        var currentText = event.target.value+';'+'US';
        this.LoadingText = true;
        getSuggestions({prefix:currentText})
        .then(result => {
            console.log(result);
            this.searchRecords= result.suggestions;;
            this.LoadingText = false;
            
            this.txtclassname =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
            if(currentText.length > 0 && result.length == 0) {
                this.messageFlag = true;
            }
            else {
                this.messageFlag = false;
            }

            if(this.selectRecordId != null && this.selectRecordId.length > 0) {
                this.iconFlag = false;
                this.clearIconFlag = true;
            }
            else {
                this.iconFlag = true;
                this.clearIconFlag = false;
            }
        })
        .catch(error => {
            console.log('-------error-------------'+error);
            console.log(error);
        });
        
    }
    

    useSuggestion(event){
        console.log('useSuggestion');
        let suggestionId=event.target.id;
        console.log('suggestionId '+suggestionId);
        console.log('value '+event.target.value);
        //GET EXACT INDEX FROM ID
         
        if(suggestionId.includes('-')){
            suggestionId=suggestionId.substring(0,suggestionId.indexOf('-'));
        }
        console.log('suggestionId '+suggestionId);
        console.log(this.searchRecords);
        var singleAddress = this.searchRecords[suggestionId];
        console.log(singleAddress);
        console.log(singleAddress.city);
        console.log(singleAddress.state);
        console.log(singleAddress.street_line);
        console.log(singleAddress.zipcode);
        this.street = singleAddress.street_line;
        this.city = singleAddress.city;
        this.state = singleAddress.state;
        this.zip = singleAddress.zipcode;
        this.isDataAvailable = false;
        this.suggestions=[];
    }

}
