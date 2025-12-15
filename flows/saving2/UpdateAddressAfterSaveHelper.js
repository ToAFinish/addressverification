({
	getUpdateOnAddress : function(component) {
        component.set('v.loaded', true);
        var action = component.get("c.getUpdateOnAddress");
        var theaddresses = component.get("v.AddressString");
        action.setParams({ recordid : component.get("v.recordId"),addresswrapper:theaddresses});
      
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") { 
                 component.set('v.loaded', false);
               this.finalVerify(component);
            }           
            else if (state === "ERROR") {
            }
        });
        $A.enqueueAction(action);
    },
    finalVerify: function(component){
         component.set('v.loaded', true);
         var action = component.get("c.getverified");
        action.setParams({ recordid : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                            
               component.set("v.IsAddressSuccessful", true);
                 component.set('v.loaded', false);
            }          
            else if (state === "ERROR") {
              console.log('completed with error!!!');
            }
        });
        $A.enqueueAction(action);
    }
})
