({
	init : function(cmp, event, helper) {
		 // Figure out which buttons to display
        var availableActions = cmp.get('v.availableActions');
        for (var i = 0; i < availableActions.length; i++) {
            if (availableActions[i] == "PAUSE") {
                cmp.set("v.canPause", true);
            } else if (availableActions[i] == "BACK") {
                cmp.set("v.canBack", true);
            } else if (availableActions[i] == "NEXT") {
                cmp.set("v.canNext", true);
            } else if (availableActions[i] == "FINISH") {
                cmp.set("v.canFinish", true);
            }
        }
	},  
    onButtonPressed: function(cmp, event, helper) {
        // Figure out which action was called
        var actionClicked = event.getSource().getLocalId();
        if(actionClicked=='FINISH'){
            cmp.set("v.DoneProcess","true");
        }else{
            // Call that action
            var navigate = cmp.getEvent("navigateFlowEvent");
            navigate.setParam("action",actionClicked);
            navigate.fire();
        }
    },
    handleVerify: function(component, event, helper){
        component.set('v.doingProcess','true');       
        helper.getpostal(component,event,helper);               
    },
    onChange: function (cmp, evt, helper) {
        var theindex=cmp.find('adder').get('v.value');
       
        var theAddresses=cmp.get("v.result.theAddress");
        var theSelectedAddr=theAddresses[theindex];
        cmp.set("v.result.matchAddress",theSelectedAddr);
        
        document.getElementById('city').value=theSelectedAddr.city;
        document.getElementById('state').value=theSelectedAddr.state;
        document.getElementById('s').value=theSelectedAddr.street1;
        document.getElementById('country').value=theSelectedAddr.country;                         
        document.getElementById('zip').value=theSelectedAddr.postalcode; 
        document.getElementById('street2').value=theSelectedAddr.street2; 
    }
})
