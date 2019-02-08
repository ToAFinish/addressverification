({
	 getpostal : function(component, event, helper) {
      
        var isblank='false';
		
        var city=document.getElementById('city').value;
        var state=document.getElementById('state').value;
        var street=document.getElementById('s').value;
		var country=document.getElementById('country').value;                         
        var zip=document.getElementById('zip').value; 
        var street2=document.getElementById('street2').value; 
    
        if(city!='' || state!='' || street!='')
            isblank='false';
        else
            isblank='true';
       
    	if(isblank=='false'){            
            var action = component.get("c.getTheAddress");
            action.setParams({
                "street": street,
                "street2":street2,
                "city": city,
                "state": state,
                "country": country,
                "zip": zip,
                "extra": component.get("v.Extra")
            });
            
            action.setCallback(this, function(response) {   
                component.set("v.doingProcess","false");
               
                if (response.getState() == "SUCCESS") { 
                    component.set("v.result",response.getReturnValue());
                    console.log(JSON.stringify(response.getReturnValue()));
                    if(response.getReturnValue()!=undefined && response.getReturnValue().Success==true){  
                        component.set("v.valid","true");
                        component.set("v.invalid","false");
                        component.set("v.blank","false");
                        component.set("v.DefaultMess","false");   
                        component.set("v.isError","false");
                        component.set("v.defaultselected",response.getReturnValue().matchAddress.formatedAddress);
                        
                        document.getElementById('city').value=response.getReturnValue().matchAddress.city;
                        document.getElementById('state').value=response.getReturnValue().matchAddress.state;
                        document.getElementById('s').value=response.getReturnValue().matchAddress.street1;
                        document.getElementById('country').value=response.getReturnValue().matchAddress.country;                         
                        document.getElementById('zip').value=response.getReturnValue().matchAddress.postalcode; 
                        document.getElementById('street2').value=response.getReturnValue().matchAddress.street2; 
                    }
                    else{
                        component.set("v.invalid","true");
                        component.set("v.blank","false");
                        component.set("v.valid","false");
                        component.set("v.DefaultMess","false");  
                        
                        if(response.getReturnValue()!=undefined && response.getReturnValue().errorMessages.length>0){                         
                            component.set("v.isError","true"); 
                            component.set("v.invalid","false");
                        }
                        
                        var street1=document.getElementById('s').value;
                        component.set("v.Street1",street1);
                        var street2='';
                        if(document.getElementById('street2').value!=''){
                            street2 =document.getElementById('street2').value;                          
                        }
                        component.set("v.Street2",street2);
                        var rest=document.getElementById('city').value+' '+document.getElementById('state').value+' '+document.getElementById('zip').value;
                    	component.set("v.Rest",rest);
                    }
                }
            });
            $A.enqueueAction(action);       
        } else{
            component.set("v.doingProcess","false");
            component.set("v.blank","true");
            component.set("v.invalid","false");          
            component.set("v.valid","false");
            component.set("v.DefaultMess","false");
            component.set("v.isError","false");  
        }
	}
})
