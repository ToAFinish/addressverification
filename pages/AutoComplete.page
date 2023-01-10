<apex:page standardController="Office__c" extensions="OfficeAutocompleteExt">
    <html>
        <head>
            <script src="{!$resource.jquery_3_4_1_Min}"></script>
            <script src="{!$resource.jquery_ui}"></script>
            <link rel="stylesheet" href="{!$resource.jquery_ui_css}"/>
            <script>
        $(function() {

  var menu = $(".us-autocomplete-pro-menu");
  var input = $("#us-autocomplete-pro-address-input");

  function getSuggestions(search, selected) {
    $.ajax({
      url: "https://us-autocomplete-pro.api.smartystreets.com/lookup?",
      data: {
        "auth-id": '{!key}',
        "search": search,
        "selected": (selected ? selected : "")
      },
      dataType: "jsonp",
      success: function(data) {
        if (data.suggestions) {
          buildMenu(data.suggestions);
        } else {
          noSuggestions();
        }
      },
      error: function(error) {
        return error;
      }
    });
  }

  function getSingleAddressData(address) {
    $.ajax({
      url: "https://us-street.api.smartystreets.com/street-address?",
      data: {
        "auth-id": '{!key}',
        "street": address[0],
        "city": address[1],
        "state": address[2],
          "zip": address[3],
      },
      dataType: "jsonp",
      success: function(data) {
        $("#zip").val(data[0].components.zipcode);
      },
      error: function(error) {
        return error;
      }
    });
  }

  function clearAddressData() {
    $("#city").val("");
    $("#state").val("");
    $("#zip").val("");
  }

  function noSuggestions() {
    var menu = $(".us-autocomplete-pro-menu");
    menu.empty();
    menu.append("<li class='ui-state-disabled'><div>No Suggestions Found</div></li>");
    menu.menu("refresh");
  }

  function buildAddress(suggestion) {
    var whiteSpace = "";
    if (suggestion.secondary || suggestion.entries > 1) {
      if (suggestion.entries > 1) {
        suggestion.secondary += " (" + suggestion.entries + " more entries)";
      }
      whiteSpace = " ";
    }
    var address = suggestion.street_line + whiteSpace + suggestion.secondary + " " + suggestion.city + ", " + suggestion.state + " " + suggestion.zipcode;
    var inputAddress = $("#us-autocomplete-pro-address-input").val();
    for (var i = 0; i < address.length; i++) {
      var theLettersMatch = typeof inputAddress[i] == "undefined" || address[i].toLowerCase() !== inputAddress[i].toLowerCase();
      if (theLettersMatch) {
        address = [address.slice(0, i), "<b>", address.slice(i)].join("");
        break;
      }
    }
    return address;
  }
  
  
    
  function buildMenu(suggestions) {
    var menu = $(".us-autocomplete-pro-menu");
    menu.empty();
    suggestions.map(function(suggestion) {
      var caret = (suggestion.entries > 1 ? "<span class=\"ui-menu-icon ui-icon ui-icon-caret-1-e\"></span>" : "");
      menu.append("<li><div data-address='" +
        suggestion.street_line + (suggestion.secondary ? " " + suggestion.secondary : "") + ";" +
        suggestion.city + ";" +
        suggestion.state + "'>" +
        caret +
        buildAddress(suggestion) + "</b></div></li>");
    });
    menu.menu("refresh");
  }

  $(".us-autocomplete-pro-menu").menu({
    select: function(event, ui) {
      var text = ui.item[0].innerText;
      var address = ui.item[0].childNodes[0].dataset.address.split(";");
      var searchForMoreEntriesText = new RegExp(/(?:\ more\ entries\))/);
      input.val(address[0]);
      $("#city").val(address[1]);
      $("#state").val(address[2]);

      if (text.search(searchForMoreEntriesText) == "-1") {
        $(".us-autocomplete-pro-menu").hide();
        getSingleAddressData(address);
      } else {
        $("#us-autocomplete-pro-address-input").val(address[0] + " ");
        var selected = text.replace(" more entries", "");
        selected = selected.replace(",", "");
        getSuggestions(address[0], selected);
      }
    }
  });

  $("#us-autocomplete-pro-address-input").keyup(function(event) {
    if (input.val().length > 0 || input.val() === "") clearAddressData();
    if (event.key === "ArrowDown") {
      menu.focus();
      menu.menu("focus", null, menu.menu().find(".ui-menu-item"));
    } else {
      var textInput = input.val();
      if (textInput) {
        menu.show();
        getSuggestions(textInput);
      } else {
        menu.hide();
      }
    }
  });

  $(".us-autocomplete-pro-menu").css("width", ($("#us-autocomplete-pro-address-input").width() + 200) + "px")

});
        </script>
        <script>
            function changeAddress(){
               var city = document.getElementById('city').value ;
               var street = document.getElementById('us-autocomplete-pro-address-input').value ;
               var state = document.getElementById('state').value ;
               var country = document.getElementById('country').value ;
               var zip = document.getElementById('zip').value ;
              
               document.getElementById('{!$Component.frm.hiddenCity}').value = city;
               document.getElementById('{!$Component.frm.hiddenStreet}').value = street;
               document.getElementById('{!$Component.frm.hiddenZip}').value = zip;
               document.getElementById('{!$Component.frm.hiddenCountry}').value = country;
               document.getElementById('{!$Component.frm.hiddenState}').value = state;
                                     
           }
        </script>
    
        </head>
        <body>      
            <apex:pageMessages ></apex:pageMessages> 
            <apex:form id="frm">
                <apex:actionFunction name="callSaveRec" action="{!saveRec}"/>
                <apex:inputHidden value="{!offc.City__c}" id="hiddenCity" />
                <apex:inputHidden value="{!offc.Street__c}" id="hiddenStreet" />
                <apex:inputHidden value="{!offc.State__c}" id="hiddenState" />
                <apex:inputHidden value="{!offc.Country__c}" id="hiddenCountry" />
                <apex:inputHidden value="{!offc.Zip__c}" id="hiddenZip" />
                <apex:pageBlock mode="Edit" id="pb">
                    <apex:pageBlockSection columns="1" title="Information" id="pbs">   
                        <apex:inputField value="{!offc.name}" required="true"/>
                        <form>
                            <table class="detailList" border="0" cellpadding="0" cellspacing="0" style="margin-left:-10px;">
                                <tbody>
                                    <tr>
                                        <th class="labelCol vfLabelColTextWrap">
                                            <label>Country</label>
                                        </th>
                                        <td class="data2Col">
                                            <input type="text" id="country" value="{!offc.Country__c}"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="labelCol vfLabelColTextWrap  first ">
                                            <label>Street</label>
                                        </th>
                                        <td class="data2Col  first ">
                                            <input type="text" value="{!offc.Street__c}" id="us-autocomplete-pro-address-input" autocomplete="smartystreets"/>
                                            <ul class="us-autocomplete-pro-menu" style="display:none;"></ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="labelCol vfLabelColTextWrap">
                                            <label>City</label>
                                        </th>
                                        <td class="data2Col">
                                            <input type="text" id="city" value="{!offc.City__c}"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="labelCol vfLabelColTextWrap">
                                            <label>State</label>
                                        </th>
                                        <td class="data2Col">
                                            <input type="text" id="state" value="{!offc.State__c}"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="labelCol vfLabelColTextWrap">
                                            <label>Zip</label>
                                        </th>
                                        <td class="data2Col">
                                            <input type="text" id="zip" value="{!offc.Zip__c}"/>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </apex:pageBlockSection>
                    <apex:pageBlockButtons >
                        <apex:commandButton action="{!saveOffcRec}" value="Save" onclick="changeAddress();" id="compSave" oncomplete="callSaveRec();"/>
                    </apex:pageBlockButtons>
                </apex:pageBlock>
            </apex:form>
        </body>
    </html>
</apex:page>
