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
        console.log('************** AUTOCOMPLETE IS USED');
        console.log(JSON.stringify(info));
        //CAN NOT DO ANYTHING WITH THIS, THE FORM BUTTONS ARE NOT PART OF THIS COMPONENT
	},
    handleSubmit : function(component, event, helper) {
        var isValidated=component.get("v.isValidated");
        if(isValidated!=true){
        event.preventDefault();
            //VALIDATE THE LOCATIONS ADDED FOR THIS ACCOUNT
            var result=component.find('autocomplete').validate();
        	console.log(JSON.stringify(result));
        }else{
            console.log('LET THE FORM SUBMIT AND CREATE ACCOUNT');
        }
    },
    handleValidated: function(component, event, helper) {
        console.log('****************ADDRESS IS VALIDATED');
        var info=event.getParam('info');
        console.log(JSON.stringify(info));
        if(info.validated==true){
            component.set("v.isValidated",true);
            //NOW SUBMIT THE FORM AND CREATE THE ACCOUNT BEFORE CREATING LOCATION
            component.find('accountform').submit();
        }
	},
    handleSuccess : function(component, event, helper) {
        component.set("v.recordId",event.getParam("id"));
        var otherfields=[];
        var parentField={};
        parentField.name='YYY__c';   // THIS IS THE LOOKUP FIELD FROM THE CHILD ADDRESS OBJECT TO THE PARENT OBJECT
        parentField.value=component.get("v.recordId");
        otherfields.push(parentField);
        var result=component.find('autocomplete').save(otherfields);
        console.log(result);
        if(result.status==true){
        	//SAVE PROCESS STARTED
        }
    },
    handlesave: function(component, event, helper) {
        console.log('*********** ADDRESSES  SAVED');
        console.log(event.getParam('info'));
        console.log(component.get("v.recordId"));
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.recordId"),
            "slideDevName": "related"
        });
        navEvt.fire();
    },
    handlecancel: function(component, event, helper) {
        console.log('FORM CANCELED');
        component.set("v.reset",true);
        component.set("v.reset",false);
    }
})
