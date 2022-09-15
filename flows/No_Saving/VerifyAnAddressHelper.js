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
	},
//GET THE SUGGESTIONS FROM THE SMARTYSTREET API
    addSuggestions:function (component, event, helper,searchInfo){
        console.log('*** in helper');
        //THIS IS TO SHOW SUGGESTION WHEN USER TYPE IN ADDRESS STREET FIELD
        //THIS CALLS API SUGGEST OF SMARTYSTREETS
        
        //ONLY DOMESTIC USA HAVE DROPDOWN WILL WORK
        var country=document.getElementById('country').value;
        console.log('country '+country);
        if(country==undefined || country=='' ||
           (country!=undefined && (country.toLowerCase()=='usa') 
		   || country.toLowerCase().trim()=='united states'
           || country.toLowerCase().trim()=='united states of america'
           || country.toLowerCase().trim()=='us' )
        ){
            var addValue=event.target.value;   
            var param =addValue+';'+'US'; 
            console.log('***** param='+param); 
            console.log('****** '+addValue); 
            if(addValue!='' && addValue.length>3){ 
                console.log('*** call server');
               //GET THE SUGGESTIONS
                var action = component.get("c.getDropdownAddresses");
                action.setParams({
                    "Parameters": param
                });
                var opts = [];
                action.setCallback(this, function(response) {
                    if (response.getState() == "SUCCESS") {
                        console.log('******* THE API CALLED');
                        console.log(JSON.stringify(response.getReturnValue()));
                        var allValues = response.getReturnValue();
                        console.log('allValues '+allValues);
                        component.set('v.addresses',response.getReturnValue());
                        
                        //IF THERE ARE MORE THAN ONE ADDRESS THEN SHOW DROPDOWN
                        if (allValues != undefined && allValues.length>0){
                            console.log('allValues length '+allValues.length);
                            var dropdownDiv=document.getElementById('streetDropdown');
                            dropdownDiv.classList.remove("achide");
                            dropdownDiv.classList.add("acshow");
                        } 
                        //HIDE THE DROPDOWN
                        else{
                            var dropdownDiv=document.getElementById('streetDropdown');
                            dropdownDiv.classList.remove("acshow");
                            dropdownDiv.classList.add("achide");
                        }   
                        searchInfo.timeId=undefined;
                        component.set("v.searchInfo",searchInfo);                 
                    }
                });
                $A.enqueueAction(action);
            }
            //IF STREET IS BLANK THEN RESET THE DROPDOWN 
            else{
                console.log('*** search key not full');
                //HIDE THE DROPDOWN VALUES
                var dropdownDiv=document.getElementById('streetDropdown');
                dropdownDiv.classList.remove("acshow");
                dropdownDiv.classList.add("achide");
                //CLEAR THE DROPDOWN VALUES
                var allValues=[];
                component.set('v.addresses',allValues); 
                searchInfo.timeId=undefined;
                component.set("v.searchInfo",searchInfo);
            }
        }
    },
    //HIDE THE SUGGESTIONS IF HOVER IS REMOVED 
    hideAutoSuggestion : function(component) {
        console.log('hideAutoSuggestion');
        if(document.getElementById('s')!=null){
            console.log('hover removed');
            var dropdownDiv=document.getElementById('streetDropdown');
            dropdownDiv.classList.remove("acshow");
            dropdownDiv.classList.add("achide");
        }
    }
})
