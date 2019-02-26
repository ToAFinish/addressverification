# INSTRUCTIONS

## FLOW VERIFYING/SAVING EXISTING RECORDS

In order to use this flow, you will need to set up a few Lightning components and an event.

1. Make sure you are on version 5.0 or later.  If not, email support@toafinish.com with your org id and ask for an update.
2. Create the naviagteFlow Lightning event using the file in the "Saving" folder
3. Create the FlowFooter Lightning Component using the files in the "Saving" folder
4. Create the UpdateAddressFromFlow Lightning Component using the files in the "Saving" folder
5. Build a new Flow - or edit an existing one
   1. Drag a "Screen" element from the palette
   2. Give it a label name like "Open Verification Component" (the API name should update automatically).
   3. Uncheck the "Show Footer" and "Show Header" options.
   3. Click on the "Add A Field" tab, choose the "Lightning Component" element at the bottom, 
   4. Click on it, if it isn't visible, and give it a name like "Update"
   5. From the Lightning Component list, select "c:UpdateAddressFromFlow"
   6. In the "Input" subtab, select the "recordId" Attribute, and create a new "Read and Write" variable called Id.  Make sure {!Id} is selected as the value element.
   ![Flow](FlowSetup.png)
   7. Press the OK button
   8. If this is a new flow and this is the only element in the flow, then hover over the element, and press the "Set as Start Element" green arrow in the top-right of the Screen element.
   9. Save the flow and give it a name like "Verify"
   10. Activate the Flow if it is a new flow
6. If it is a new flow, create a new URL button on the object you want to run it from, with a URL something like this (depending on what name you gave it): /flow/Verify?Id={!Account.Id}&retURL={!Account.Id}
7. Add this button to the layout for your Lightning page layout

> NOTE: To run from Lighting, make sure you have the "Enable Lightning runtime for flows" in the "Process Automation Settings" in Setup.

You are now ready to test it out!



## FLOW VERIFYING AN ADDRESS WITHOUT SAVING

In order to use this flow, you will need to set up a Lightning component.

1. Make sure you are on version 5.0 or later. If not, email support@toafinish.com with your org id and ask for an update.
2. Create the VerifyAnAddress Lightning Component using the files in the "No_Saving" folder
3. Build a new Flow - or edit an existing one
	1. Drag a "Screen" element from the palette
        2. Give it a label name like "Open Verification Component"
	3. From the list of items on the left, scroll down and select the "VerifyAnAddress" lightning component you created in the 2nd step.  You should now see this new lighting component added inside the original screen element, like this:
   ![Flow](no_save_step1.png)
	4. Click on it and give it a name like "Verify".
	5. In the "Extra" input field, delete whatever value is there, and choose the "New Resource" option, and then select "Variable".
	6. In the variable popup, give it a name, Data Type should be "Text", check "Available for Input" (but not output) then the Default Value can be: YES, COUNTY, or COUNTYFIPS.  If you put "YES" it will bring both County and County FIPs into the results. Press "Done" to save:
   ![Flow](no_save_step2.png)
	7. Click back on the header, and then uncheck the "Show Footer" and "Show Header" options from General Info.
   ![Flow](no_save_step3.png)
	8. Press the Done button
	9. Connect the Screen element that you just created to the previous step in the flow.  If this is a new flow, then you want to connect it to the Start icon.  To do so, hover over the circle at the bottom of the Start icon and drag it to the Screen element and release it.  That should connect it:
   ![Flow](no_save_step4.png)
	10. Save the flow and give it a name like "Address Verification Plugin"
	11. You can Run the flow using the "Run" button to test it.
	12. Activate the Flow if it is a new flow
4. You can open flow with url "/flow/smartystreets/Address_Verification_Plugin", you will find the Url when you will save a flow.

> NOTE: To run from Lighting, make sure you have the "Enable Lightning runtime for flows" in the "Process Automation Settings" in Setup.

You are now ready to test it out!
