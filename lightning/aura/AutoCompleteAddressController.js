({
	doInit : function(component, event, helper) {
        console.log('calling doInt of AutoCompleteAddress');
		helper.helperMethod(component, event, helper);
	},
    address: function(component, event, helper){
        helper.addSuggestions(component, event, helper);
    },
    callSuggestion: function(component, event, helper){
        var index=component.get('v.index');       
        var addresses=component.get('v.addresses');        
        document.getElementById('city'+index).value=addresses[event.target.id].city;
        document.getElementById('state'+index).value=addresses[event.target.id].state;
        document.getElementById('s'+index).value=addresses[event.target.id].street_line;
        document.getElementById('zip'+index).value=addresses[event.target.id].zipcode;
        
        document.getElementById('street'+index).style.display='none';
        var allValues=[];
        component.set('v.addresses',allValues);  
    
            var allAddresses=component.get('v.sObjaddresses');
            for(var l=0;l<allAddresses.length;l++){
                var oneRow=allAddresses[l].oneRow;
                for(var j=0;j<oneRow.length;j++){
                    if(oneRow[j].Index==index){
                        oneRow[j].updateVerified=true;
                    }
                }
            }
            console.log('**** after selecting');
            console.log(JSON.stringify(allAddresses));
    },
    hideSuggestion: function(component, event, helper){
        var index=component.get('v.index');
        console.log('index '+index);
        setTimeout(function() {
            helper.hideAutoSuggestion(index);
        }, 200)     
    }, 
})
