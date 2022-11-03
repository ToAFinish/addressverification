({	
    addSuggestions:function (component, event, helper,searchInfo){
        console.log('*** in helper');
        //THIS IS TO SHOW SUGGESTION WHEN USER TYPE IN ADDRESS STREET FIELD
        //THIS CALLS API SUGGEST OF SMARTYSTREETS
        
        component.set('v.index',(event.target.id).replace('s',''));
        var index = component.get('v.index');
        console.log('INDEX'+index);
        var country= document.getElementById('country'+index).value;
        console.log('country helper'+country);
        
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
                            var streetDropdownPanel=document.getElementById('streetDropdownPanel');
                            if(index==0){
                                console.log('inside 0');
                                streetDropdownPanel.classList.remove("dropDownCss1");
                                streetDropdownPanel.classList.add("dropDownCss0");
                            }
                            if(index==1){
                                console.log('inside 1');
                                streetDropdownPanel.classList.remove("dropDownCss0");
                                streetDropdownPanel.classList.add("dropDownCss1");
                            }
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
    getpostal : function(component, event, helper) {
        
        var isblank='false';
		var index=component.get("v.verifiedindex");
        var city=document.getElementById('city'+index).value;
        var state=document.getElementById('state'+index).value;
        var street=document.getElementById('s'+index).value;
		var country=document.getElementById('country'+index).value;     
        var zip=document.getElementById('zip'+index).value;
        console.log('index in get postal'+index);
        var isverificationNeeded=document.getElementById('need'+index).checked;
        
        if(isverificationNeeded==false){
            
            var street2='';
            if(document.getElementById('s2'+index)!=null){
                street2 =document.getElementById('s2'+index).value;
            }
                      
            if(city!='' || state!='' || street!='')
                isblank='false';
            else
                isblank='true';
            
            var el=document.getElementById('s'+index);  
            var _x = 0;
            var _y = 0;
            
            try{
                while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                    _x += el.offsetLeft - el.scrollLeft;
                    _y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }	
            }catch(e){}
            
            {            
                var action = component.get("c.getpostalcode");
                action.setParams({
                    "street": street,
                    "city": city,
                    "state": state,
                    "country": country,
                    "zip": zip,
                    "street2":street2
                });
                
                action.setCallback(this, function(response) {            
                    if (response.getState() == "SUCCESS") {            
                        document.getElementById('zip'+index).value=response.getReturnValue(); 
                        if(response.getReturnValue()!=''){                             
                            component.set("v.verifiedindex",parseInt(index)+1);                                            
                            //  NOW MAKE THE REVERIY RUN
                            document.getElementById('verifyagain').click();
                        }
                        else{
                            // OPEN THE ALERT BOX   
                            
                            document.getElementById("ErrorboxMain").style.display='';                        
                            document.getElementById("Errorbox").style.paddingTop=(_y-20)+'px';   
                            
                            //   document.getElementById("Errorbox").style.marginTop=10+(parseInt(index)*15);
                            
                            if((parseInt(index)+1)%2==0){
                                document.getElementById("Errorbox").style.cssFloat='Right';
                                document.getElementById("Errorbox").style.marginLeft='0px';
                                document.getElementById("Errorbox").style.marginRight='33px';
                            }else{
                                document.getElementById("Errorbox").style.cssFloat='Left';
                                document.getElementById("Errorbox").style.marginLeft='33px';
                                document.getElementById("Errorbox").style.marginRight='0px';
                            }
                            
                            document.getElementById("theMessage").innerHTML=document.getElementById('s'+index).value+' '+street2+' '+document.getElementById('city'+index).value+' '+document.getElementById('state'+index).value;
                            if(isblank=='false'){
                                document.getElementById("ErrorboxHeader").innerHTML='YOU ENTERED AN UNKNOWN ADDRESS';
                            }else{
                                document.getElementById("ErrorboxHeader").innerHTML='YOU DID NOT ENTER ENOUGH INFORMATION';
                            }                                                        
                        }
                    }
                });
                $A.enqueueAction(action);       
            } 
        }else{
           
            var verifiedIndex=component.get('v.verifiedindex');
            verifiedIndex=parseInt(verifiedIndex)+1;
        	component.set('v.verifiedindex',verifiedIndex);                                        
            //  NOW MAKE THE REVERIY RUN          
            //  document.getElementById('verifyagain').click();
            $A.enqueueAction(component.get('c.reverify'));
        }
    },
    saveAddressAfterSucess : function(component, event, helper) { 
       
        var addresses=component.get('v.sObjaddresses');
        for(var i=0;i<addresses.length;i++){           
            var oneRow=addresses[i].oneRow; 
            for(var j=0;j<oneRow.length;j++){
                var index=oneRow[j].Index;                
                addresses[i].oneRow[j].cityvalue=document.getElementById('city'+index).value;
                addresses[i].oneRow[j].statevalue=document.getElementById('state'+index).value;               
                addresses[i].oneRow[j].streetvalue=document.getElementById('s'+index).value;             
                addresses[i].oneRow[j].countryvalue=document.getElementById('country'+index).value;
                addresses[i].oneRow[j].postalcodevalue=document.getElementById('zip'+index).value;
                
                addresses[i].oneRow[j].IsSelectedToVerify=document.getElementById('need'+index).checked;
                
                //IF STREET 2 IS ENABLED
                if(addresses[i].oneRow[j].street2Enabled){
                    addresses[i].oneRow[j].street2value=document.getElementById('s2'+index).value;
                }
            }
        }       
        
        var theaddresses=JSON.stringify(addresses);
        console.log(theaddresses);
        var action = component.get("c.getUpdateOnAddress");
        action.setParams({ recordid : component.get("v.recordId"),addresswrapper:theaddresses});
      
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") { 
               document.getElementById('verifyNow').click();
            }           
            else if (state === "ERROR") {
            }
        });
        $A.enqueueAction(action);
    },
    //HIDE THE SUGGESTIONS IF HOVER IS REMOVED 
    hideAutoSuggestion : function(component) {
        console.log('hideAutoSuggestion');
        var index = component.get('v.index');
        if(document.getElementById('s'+index)!=null){
            console.log('hover removed');
            var dropdownDiv=document.getElementById('streetDropdown');
            dropdownDiv.classList.remove("acshow");
            dropdownDiv.classList.add("achide");
        }
    }
})
