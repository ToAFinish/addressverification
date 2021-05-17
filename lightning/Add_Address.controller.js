({
	 doInit : function(component, event, helper) {
         //PASS ARRAY OF FIELDS TO AUTOCOMPLETE EXTENSION
         var additionfields=[];
         additionfields.push('Name');
         //additionfields.push('LastName');
         component.set("v.additionfields",additionfields);
    },
    handleAutoComplete : function(component, event, helper) {
   		//GET INFO SEND FROM AUTOCOMPLETE EXTENSION
        var info=event.getParam('info');
        if(info.autocompleteloading==true){
            component.set("v.autocompleteloading",true);
        }else{
            component.set("v.autocompleteloading",false);
        }
	},
    save : function(component, event, helper) {
        var result=component.find('autocomplete').validate();
        console.log(JSON.stringify(result));
    },
    handleValidated: function(component, event, helper) {
        console.log('****************ADDRESS IS VALIDATED');
        var info=event.getParam('info');
        console.log(JSON.stringify(info));
        //SEND FIELDS LIKE PARENT LOOKUP TO POPULATE ON ALL RECORDS
        var otherfields=[];
        var parentField={};
        parentField.name='YYY__c';  // UPDATE WITH THE API NAME OF THE LOOKUP FIELD TO THE PARENT OBJECT
        parentField.value=component.get("v.recordId");
        otherfields.push(parentField);
    	var result=component.find('autocomplete').save(otherfields);
	},
    handlesave: function(component, event, helper) {
        console.log('*********** RECORD SAVED');
        console.log(event.getParam('info'));
        console.log(component.get("v.recordId"));
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.recordId"),
            "slideDevName": "related"
        });
        navEvt.fire();
    },
})
