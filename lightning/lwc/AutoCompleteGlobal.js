import { LightningElement,wire,api,track } from 'lwc';
import getSuggestions from '@salesforce/apex/AutoComplete.getaddresses';
export default class AutoCompleteGlobal extends LightningElement {
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
        getSuggestions({Parameters:currentText})
        .then(result => {
            this.searchRecords= result;
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
        let suggestionId=event.target.id;
        //GET EXACT INDEX FROM ID

        if(suggestionId.includes('-')){
            suggestionId=suggestionId.substring(0,suggestionId.indexOf('-'));
        }
        var singleAddress = this.searchRecords[suggestionId];
        this.street = singleAddress.street_line;
        this.city = singleAddress.city;
        this.state = singleAddress.state;
        this.zip = singleAddress.zipcode;
        this.isDataAvailable = false;
        this.suggestions=[];
    }
}