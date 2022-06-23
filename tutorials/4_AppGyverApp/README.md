# AppGyver App Office Access - Covid Check 

## Introduction

Learn how to configure a new AppGyver app that allows you to upload screenshots or scans of Covid vaccination certificates to your CAP OData service. After successful validation of the certificate, the app will display the validity date and status retrieved by your service. 

---

## Create a new AppGyver app

1. Go to your SAP BTP Subaccount and subscribe to the SAP AppGyver service offering. 

2. Open SAP AppGyver from your SAP BTP Subaccount. 

    ![AppGyver](./images/image0.png)

3. Create a new SAP App Gyver project and call it e.g. **CovidChecker**.

---

## Enable authentication 

1. Switch to the **Auth** tab of your project and add Authentication. 
    ![AppGyver](./images/image1.png)

2. Follow the screenshot details. 
    ![AppGyver](./images/image2.png)

3. Follow the screenshot details. 
    ![AppGyver](./images/image3.png)

4. Once Authentication is activated, you will see that the **Log In** page is loaded for authentication as it is defined as **Initial View**. 
    ![AppGyver](./images/image4.png)

5. Change the name of the initial view by switching to the page editor and selecting the **Log In** page. Change the page name to **OAuth**. Save your changes of required. 
    ![AppGyver](./images/image5.png)

6. Remove the default content of the **Log In** page and then open the **Component Marketplace** to add a new component. 
    ![AppGyver](./images/image6.png)

7. Follow the screenshot details to add the **WebView** component. 
    ![AppGyver](./images/image7.png)

8. Follow the screenshot details.  
    ![AppGyver](./images/image8.png)

9. Drop a new WebView component to the canvas.   
    ![AppGyver](./images/image9.png)

10. Save your changes and switch back to the **Auth** tab of your project. You will see that the name of the initial view has changed as you've changed the name of your page.   
    ![AppGyver](./images/image10.png)

---

## Setup your navigation

1. Before you setup the navigation, rename the initial **Empty page** which was created by SAP AppGyver automatically. Therefore switch to the page overview and select the Empty page. 
    ![AppGyver](./images/image11.png)

2. Change the page name to **Office Access - Covid Check** and save your changes. 

    ![AppGyver](./images/image12.png)

3. Switch to the **Navigation** tab and modify the existing **Built-In Navigation**. Change the **icon** and **tab name** of the existing page as displayed in the screenshots. 
    ![AppGyver](./images/image14.png)

    >Hint: The icon used in this tutorial can be found by searching for **superpowers** in the icon library. 
    ![AppGyver](./images/image15.png)

---

## Apply the SAP Fiori theme

Apply the SAP Fiori theme to your project in the **Theme** tab of SAP AppGyver. Details can be found in the screenshot. 
![AppGyver](./images/image16.png)

---

## Add variables to your app

Your SAP AppGyver app will need a variety of variables to store information like access tokens or business data. 

1. To add these variables, first open the **Office Access - Covid Check** page and change the toggle in the top right from **View** to **Variables**. Start adding the required **App Variables** as you can see in the screenshots. 
    ![AppGyver](./images/image17.png)
    ![AppGyver](./images/image18.png)
    ![AppGyver](./images/image19.png)

2. Create two **page variables** required for the current page as you can see in the following screenshot. 
    ![AppGyver](./images/image20.png)

3. Save your changes and switch to the **OAuth** page which requires some more **page variables**. Create them as visible in the screenshot and save your changes again. 
    ![AppGyver](./images/image20a.png)

---

## Create your login view

1. Open the **OAuth** page and follow the screenshot details.  
    ![AppGyver](./images/image21.png)

2. Modify the general page settings as visible in the following screenshots. 

    ![AppGyver](./images/image22.png)
    ![AppGyver](./images/image23.png)

3. Modify the WebView component settings as visible in the following screenshots.
    >**Hint**: A preview value does not need to be set!

    ![AppGyver](./images/image24.png)
    ![AppGyver](./images/image25.png)
    ![AppGyver](./images/image26.png)

---
    
## Create your Login View logic

1. Being on the **OAuth** page, open the SAP AppGyver logic section in the bottom of the screen. This is where you will configure the logic applied when the OAuth page is loaded. 

2. Please add the following components to your logic flow and connect them as depicted, before you start with the individual component configurations. 
    ![AppGyver](./images/image26a.png)

    | #   |    Type    |               Feature |
    | --- | :--------: | --------------------: |
    | 1   |   Event    |          Page mounted |
    | 2   |    View    |          Hide spinner |
    | 3   |  Storage   | Get item from storage |
    | 4   |  Utility   |          If condition |
    | 5   |  Storage   | Get item from storage |
    | 6   | Variables  |      Set app variable |
    | 7   |    Data    |          HTTP request |
    | 8   | Variables  |      Set app variable |
    | 9   |  Storage   |   Set item to storage |
    | 10  |  Storage   |   Set item to storage |
    | 11  | Navigation |  Dismiss initial view |
    | 12  |     JS     |           Java Script |
    | 13  | Variables  |     Set page variable |
    | 14  | Variables  |     Set page variable |

    >#1 Event - Page mounted <br>
    >[<img src="./images/image27.png" width="100">](./images/image27.png)

    >#2 View - Hide spinner <br>
    >[<img src="./images/image29.png" width="100">](./images/image29.png)

    >#3 Storage - Get item from storage <br>
    >[<img src="./images/image28.png" width="100">](./images/image28.png)

    >#4 Utility - If condition <br>
    >**If-Condition**: IF(DATETIME_DIFFERENCE(DATETIME(NOW("")), DATETIME(outputs["Get item from storage"].item), "seconds")<7776000, true, false)<br>
    >[<img src="./images/image30.png" width="100">](./images/image30.png)
    >[<img src="./images/image31.png" width="100">](./images/image31.png)

    >#5 Storage - Get item from storage <br>
    >[<img src="./images/image32.png" width="100">](./images/image32.png)

    >#6 Variables - Set app variable <br>
    >[<img src="./images/image33.png" width="100">](./images/image33.png)
    >[<img src="./images/image34.png" width="100">](./images/image34.png)
    >[<img src="./images/image35.png" width="100">](./images/image35.png)

    >#7 Data - HTTP request <br>
    >**URL (Formula)**: "https://`<<SAP IAS url e.g. sap.accounts.ondemand.com>>`/oauth2/token?grant_type=refresh_token&client_id=`<<app registration client id e.g. 0df641d4-1234-abcd-5678-06eaec363780>>`&refresh_token="+appVars.auth.refreshToken<br>
    >[<img src="./images/image36.png" width="100">](./images/image36.png)
    >[<img src="./images/image37.png" width="100">](./images/image37.png)
    >[<img src="./images/image38.png" width="100">](./images/image38.png)
    >[<img src="./images/image39.png" width="100">](./images/image39.png)

    >#8 Variables - Set app variable <br>
    >**authToken**: STRING(outputs["HTTP request"].resBodyParsed.access_token) <br>
    >**expiresIn**: STRING(outputs["HTTP request"].resBodyParsed.expires_in) <br>
    >**idToken**: STRING(outputs["HTTP request"].resBodyParsed.id_token) <br>
    >**refreshToken**: STRING(outputs["HTTP request"].resBodyParsed.refresh_token) <br>
    >[<img src="./images/image40.png" width="100">](./images/image40.png)
    >[<img src="./images/image41.png" width="100">](./images/image41.png)
    >[<img src="./images/image42.png" width="100">](./images/image42.png)
    >[<img src="./images/image43.png" width="100">](./images/image42.png)
    >[<img src="./images/image44.png" width="100">](./images/image44.png)
    >[<img src="./images/image45.png" width="100">](./images/image45.png)
    >[<img src="./images/image46.png" width="100">](./images/image46.png)

    >#9 Storage - Set item to storage <br>
    >[<img src="./images/image47.png" width="100">](./images/image47.png)
    >[<img src="./images/image48.png" width="100">](./images/image48.png)

    >#10 Storage - Set item to storage <br>
    >[<img src="./images/image49.png" width="100">](./images/image49.png)
    >[<img src="./images/image50.png" width="100">](./images/image50.png)

    >#11 Navigation - Dismiss initial view <br>
    >[<img src="./images/image51.png" width="100">](./images/image51.png)

    >#12 JS - Java Script <br>
    > **JavaScript Code**: [Click here](https://github.com/SAP-samples/appgyver-auth-flows/blob/main/appGyver/pkceCoding.js) (Please check the **licenses** of the polyfills used!) <br>
    >[<img src="./images/image52.png" width="100">](./images/image52.png)
    >[<img src="./images/image54.png" width="100">](./images/image54.png)
    >[<img src="./images/image55.png" width="100">](./images/image55.png)
    >[<img src="./images/image56.png" width="100">](./images/image56.png)

    >#13 Variables - Set page variable <br>
    >[<img src="./images/image57.png" width="100">](./images/image57.png)
    >[<img src="./images/image58.png" width="100">](./images/image58.png)
    >[<img src="./images/image59.png" width="100">](./images/image59.png)

    >#14 Variables - Set page variable <br>
    >**Web URL (Formula)**: "https://`<<SAP IAS url e.g. sap.accounts.ondemand.com>>`/oauth2/authorize?client_id=`<<app registration client id e.g. 0df641d4-1234-abcd-5678-06eaec363780>>`&scope=openid&code_challenge="+outputs["Get PKCE parameters"].challenge+"&code_challenge_method=S256&redirect_uri=http://localhost/&response_type=code" <br> <br>
    >[<img src="./images/image60.png" width="100">](./images/image60.png)
    >[<img src="./images/image61.png" width="100">](./images/image61.png)
    >[<img src="./images/image62.png" width="100">](./images/image62.png)

---

## Create your Login View authentication logic

1. Being on the **OAuth** page, open the SAP AppGyver logic section in the bottom of the screen. This is where you will configure the logic applied when the user authenticated using SAP Identity Authentication service. 

2. Please select the **Web View** component in your canvas, add the following components to your logic flow and connect them as depicted, before you start with the individual configurations. 
    ![AppGyver](./images/image190.png)

    | #   |    Type    |                    Feature |
    | --- | :--------: | -------------------------: |
    | 1   |   Event    | Component onLocationChange |
    | 2   |     JS     |                 JavaScript |
    | 3   |  Utility   |               If condition |
    | 4   | Variables  |           Set app variable |
    | 5   | Navigation |       Dismiss initial view |
    | 6   |    Data    |               HTTP request |
    | 7   | Variables  |           Set app variable |
    | 8   | Variables  |           Set app variable |
    | 9   |  Storage   |        Set item to storage |
    | 10  |  Storage   |        Set item to storage |
    | 11  | Variables  |           Set app variable |
    | 12  | Variables  |           Set app variable |

    >#1 Event - Component onLocationChange <br>
    >[<img src="./images/image191.png" width="100">](./images/image191.png)

    >#2 JS - JavaScript <br>
    > **JavaScript Code**: 
    > ```
    > if(inputs.input1.url.includes('localhost/?code')){
    >    var code = inputs.input1.url.split('code=')[1].split('&state')[0];
    >    return { code : code, codeAvailable: true } 
    > }else{
    >    return { codeAvailable: false } 
    > }
    > ```
    >[<img src="./images/image219.png" width="100">](./images/image219.png)
    >[<img src="./images/image218.png" width="100">](./images/image218.png)
    >[<img src="./images/image217.png" width="100">](./images/image217.png)

    >#3 Utility - If condition <br>
    >[<img src="./images/image216.png" width="100">](./images/image216.png)
    >[<img src="./images/image215.png" width="100">](./images/image215.png)

    >#4 Variables - Set app variable <br>
    >[<img src="./images/image214.png" width="100">](./images/image214.png)
    >[<img src="./images/image213.png" width="100">](./images/image213.png)
    >[<img src="./images/image212.png" width="100">](./images/image212.png)

    >#5 Navigation - Dismiss initial view <br>
    >[<img src="./images/image211.png" width="100">](./images/image211.png)

    >#6 Data - HTTP request <br>
    >[<img src="./images/image210.png" width="100">](./images/image210.png)
    >[<img src="./images/image209.png" width="100">](./images/image209.png)
    >[<img src="./images/image208.png" width="100">](./images/image208.png)

    >#7 Variables - Set app variable <br>
    >**Value**: STRING(outputs["HTTP request"].resBodyParsed.access_token)<br>
    >[<img src="./images/image207.png" width="100">](./images/image207.png)
    >[<img src="./images/image206.png" width="100">](./images/image206.png)
    >[<img src="./images/image205.png" width="100">](./images/image205.png)

    >#8 Variables - Set app variable <br>
    >**Value**: STRING(outputs["HTTP request"].resBodyParsed.refresh_token)<br>
    >[<img src="./images/image204.png" width="100">](./images/image204.png)
    >[<img src="./images/image203.png" width="100">](./images/image203.png)
    >[<img src="./images/image202.png" width="100">](./images/image202.png)

    >#9 Storage - Set item to storage <br>
    >[<img src="./images/image195.png" width="100">](./images/image195.png)
    >[<img src="./images/image194.png" width="100">](./images/image194.png)

    >#10 Storage - Set item to storage <br>
    >[<img src="./images/image193.png" width="100">](./images/image193.png)
    >[<img src="./images/image192.png" width="100">](./images/image192.png)

    >#11 Variables - Set app variable <br>
    >**Value**: STRING(outputs["HTTP request"].resBodyParsed.id_token)<br>
    >[<img src="./images/image201.png" width="100">](./images/image201.png)
    >[<img src="./images/image200.png" width="100">](./images/image200.png)
    >[<img src="./images/image199.png" width="100">](./images/image199.png)

    >#12 Variables - Set app variable <br>
    >**Value**: STRING(outputs["HTTP request"].resBodyParsed.expires_in)<br>
    >[<img src="./images/image198.png" width="100">](./images/image198.png)
    >[<img src="./images/image197.png" width="100">](./images/image197.png)
    >[<img src="./images/image196.png" width="100">](./images/image196.png)

---

## Create your Office Access - Covid Check view logic flow

1. Being on the **Office Access - Covid Check** page, open the SAP AppGyver logic section in the bottom of the screen. This is where you will configure the logic applied when the content page is loaded. 

2. Please add the following components to your logic flow and connect them as depicted, before you start with the individual component configurations. 
    ![AppGyver](./images/image63.png)

    | #   |   Type    |                     Feature |
    | --- | :-------: | --------------------------: |
    | 1   |   Event   |                Page mounted |
    | 2   |  Storage  |       Get item from storage |
    | 3   | Variables |            Set app variable |
    | 4   |  Storage  |       Get item from storage |
    | 5   | Variables |            Set app variable |
    | 6   |   Data    |                HTTP request |
    | 7   | Variables |           Set page variable |
    | 8   |   View    |                Hide spinner |
    | 9   |   Event   | App variable 'auth' changed |
    | 10  |   Event   |                Page focused |
    | 11  |  Utility  |                If condition |

    >#1 Event - Page mounted <br>
    >[<img src="./images/image64.png" width="100">](./images/image64.png)

    >#2 Storage - Get item from storage <br>
    >[<img src="./images/image65.png" width="100">](./images/image65.png)

    >#3 Variables - Set app variable <br>
    >**Country (Formula)**: outputs["Get item from storage"].item.country<br>
    >**Name (Formula)**: outputs["Get item from storage"].item.name<br>
    >**Photo (Formula)**: outputs["Get item from storage"].item.photo<br>
    >**ValidUntil (Formula)**: outputs["Get item from storage"].item.validUntil<br>
    >[<img src="./images/image66.png" width="100">](./images/image66.png)
    >[<img src="./images/image67.png" width="100">](./images/image67.png)
    >[<img src="./images/image68.png" width="100">](./images/image68.png)<br>
    >[<img src="./images/image69.png" width="100">](./images/image69.png)
    >[<img src="./images/image70.png" width="100">](./images/image70.png)
    >[<img src="./images/image71.png" width="100">](./images/image71.png)
    >[<img src="./images/image72.png" width="100">](./images/image72.png)

    >#4 Storage - Get item from storage <br>
    >[<img src="./images/image73.png" width="100">](./images/image73.png)

    >#5 Variables - Set app variable <br>
    >**Message (Formula)**: outputs["Get item from storage"].item.message<br>
    >**Status (Formula)**: outputs["Get item from storage"].item.status<br>
    >**UploadTime (Formula)**: outputs["Get item from storage"].item.uploadTime<br>
    >[<img src="./images/image74.png" width="100">](./images/image74.png)
    >[<img src="./images/image75.png" width="100">](./images/image75.png)
    >[<img src="./images/image76.png" width="100">](./images/image76.png)<br>
    >[<img src="./images/image77.png" width="100">](./images/image77.png)
    >[<img src="./images/image78.png" width="100">](./images/image78.png)
    >[<img src="./images/image79.png" width="100">](./images/image79.png)

    >#6 Data - HTTP request <br>
    >**URL**: https://`<<CAP service endpoint e.g. sap-dev-covidapp-srv.cfapps.eu10.hana.ondemand.com>>`/rest/verification/getAvailableCountries<br>
    >[<img src="./images/image80.png" width="100">](./images/image80.png)
    >[<img src="./images/image81.png" width="100">](./images/image81.png)
    >[<img src="./images/image82.png" width="100">](./images/image82.png)
    >[<img src="./images/image83.png" width="100">](./images/image83.png)

    >#7 Variables - Set page variable <br>
    >**Value**: outputs["HTTP request"].resBodyParsed<br>
    >[<img src="./images/image84.png" width="100">](./images/image84.png)
    >[<img src="./images/image85.png" width="100">](./images/image85.png)
    >[<img src="./images/image86.png" width="100">](./images/image86.png)

    >#8 View - Hide spinner <br>
    >[<img src="./images/image87.png" width="100">](./images/image87.png)

    >#9 Event - App variable 'auth' changed <br>
    >[<img src="./images/image87_1.png" width="100">](./images/image87_1.png)

    >#10 Event - Page focused <br>
    >[<img src="./images/image87_2.png" width="100">](./images/image87_2.png)

    >#11 Utility - If condition <br>
    >**Condition (Formula)**: IS_NULLY(appVars.auth.idToken)<br>
    >[<img src="./images/image87_3.png" width="100">](./images/image87_3.png)
    >[<img src="./images/image87_4.png" width="100">](./images/image87_4.png)

---

## Create your Office Access - Covid Check view

1. Being on the **Office Access - Covid Check** page, open the view design canvas. This is where you will configure the logic applied when the content page is loaded. 

2. Please add two containers to your canvas. 
    ![AppGyver](./images/image88.png)

    >#1 Container - Certificate <br>
    >[<img src="./images/image89.png" width="100">](./images/image89.png)
    >[<img src="./images/image90.png" width="100">](./images/image90.png)
    >[<img src="./images/image91.png" width="100">](./images/image91.png)
    

    >#2 Container - Upload <br>
    >[<img src="./images/image92.png" width="100">](./images/image92.png)
    >[<img src="./images/image93.png" width="100">](./images/image93.png)

3. Please add the following components to your view design canvas and set the individual component configurations. Not all items (e.g. plain text fields) are described in detail. 
    
    ![AppGyver](./images/image94.png)

    >#1 Title <br>
    >[<img src="./images/image95.png" width="100">](./images/image95.png)
    >[<img src="./images/image96.png" width="100">](./images/image96.png)

    >#2 Title <br>
    >[<img src="./images/image97.png" width="100">](./images/image97.png)
    >[<img src="./images/image98.png" width="100">](./images/image98.png)

    >#3 Image <br>
    >[<img src="./images/image99.png" width="100">](./images/image99.png)
    >[<img src="./images/image100.png" width="100">](./images/image100.png)
    >[<img src="./images/image101.png" width="100">](./images/image101.png)
    >[<img src="./images/image102.png" width="100">](./images/image102.png)
    >[<img src="./images/image103.png" width="100">](./images/image103.png)

    >#4 Text <br>
    >[<img src="./images/image103a.png" width="100">](./images/image103a.png)
    
    >#5 Text <br>
    >[<img src="./images/image104.png" width="100">](./images/image104.png)
    >[<img src="./images/image105.png" width="100">](./images/image105.png)
    >[<img src="./images/image106.png" width="100">](./images/image106.png)
    >[<img src="./images/image107.png" width="100">](./images/image107.png)
    >[<img src="./images/image108.png" width="100">](./images/image108.png)

    >#6 Text <br>
    >**Visible (Formula)**: NUMBER(appVars.certificate.validUntil) >= NUMBER(NOW("YYYYMMDD"))<br>
    >[<img src="./images/image109.png" width="100">](./images/image109.png)
    >[<img src="./images/image110.png" width="100">](./images/image110.png)
    >[<img src="./images/image111.png" width="100">](./images/image111.png)<br>
    >[<img src="./images/image112.png" width="100">](./images/image112.png)
    >[<img src="./images/image113.png" width="100">](./images/image113.png)
    >[<img src="./images/image114.png" width="100">](./images/image114.png)

    >#7 Text <br>
    >**Visible (Formula)**: NUMBER(appVars.certificate.validUntil) < NUMBER(NOW("YYYYMMDD"))<br>
    >[<img src="./images/image115.png" width="100">](./images/image115.png)
    >[<img src="./images/image116.png" width="100">](./images/image116.png)
    >[<img src="./images/image117.png" width="100">](./images/image117.png)

    >#8 Text <br>
    >[<img src="./images/image118.png" width="100">](./images/image118.png)
    >[<img src="./images/image119.png" width="100">](./images/image119.png)
    >[<img src="./images/image120.png" width="100">](./images/image120.png)

4. Please add the following components to your view design canvas and set the individual component configurations. Not all items (e.g. plain text fields) are described in detail. 
    
    ![AppGyver](./images/image121.png)

    >#1 Text <br>
    >[<img src="./images/image122.png" width="100">](./images/image122.png)
    >[<img src="./images/image123.png" width="100">](./images/image123.png)
    >[<img src="./images/image124.png" width="100">](./images/image124.png)

    >#2 Dropdown <br>
    >**Option list (Formula)**: MAP(SORT(pageVars.countries, "asc"), { label: item, value: item})<br>
    >
    >[<img src="./images/image125.png" width="100">](./images/image125.png)
    >[<img src="./images/image126.png" width="100">](./images/image126.png)
    >[<img src="./images/image127.png" width="100">](./images/image127.png)
    >[<img src="./images/image128.png" width="100">](./images/image128.png)
    >[<img src="./images/image129.png" width="100">](./images/image129.png)

    >#3 Button <br>
    >**Label (Formula)**: IF(appVars.upload.status === 'PENDING', "Processing...", "Select screenshot")<br>
    >**Disabled (Formula)**: appVars.upload.status === 'PENDING' || IS_EMPTY(pageVars.selectedCountry)<br>
    >[<img src="./images/image130.png" width="100">](./images/image130.png)
    >[<img src="./images/image131.png" width="100">](./images/image131.png)
    >[<img src="./images/image132.png" width="100">](./images/image132.png)

    >#4 Button <br>
    >**Label (Formula)**: IF(appVars.upload.status === 'PENDING', "Processing...", "Scan certificate")<br>
    >**Disabled (Formula)**: appVars.upload.status === 'PENDING' || IS_EMPTY(pageVars.selectedCountry)<br>
    >[<img src="./images/image133.png" width="100">](./images/image133.png)
    >[<img src="./images/image134.png" width="100">](./images/image134.png)
    >[<img src="./images/image135.png" width="100">](./images/image135.png)
    >[<img src="./images/image136.png" width="100">](./images/image136.png)

    >#5 Text <br>
    >[<img src="./images/image137.png" width="100">](./images/image137.png)
    >[<img src="./images/image138.png" width="100">](./images/image138.png)

    >#6 Text <br>
    >**Content (Formula)**: appVars.upload.uploadTime + ' - ' + appVars.upload.status<br>
    >[<img src="./images/image139.png" width="100">](./images/image139.png)
    >[<img src="./images/image140.png" width="100">](./images/image140.png)
    >[<img src="./images/image141.png" width="100">](./images/image141.png)

    >#7 Text <br>
    >**Content (Formula)**: appVars.upload.message<br>
    >[<img src="./images/image142.png" width="100">](./images/image142.png)
    >[<img src="./images/image143.png" width="100">](./images/image143.png)
    >[<img src="./images/image144.png" width="100">](./images/image144.png)

---

## Create your Office Access - Covid Check validation logic

1. Being on the **Office Access - Covid Check** page, open the SAP AppGyver logic section in the bottom of the screen. This is where you will configure the logic applied when the content page is loaded. 

2. Please select the **Scan certificate** button in your canvas, add the following components to your logic flow and connect them as depicted, before you start with the individual configurations. 
    ![AppGyver](./images/image145.png)

    | #   |   Type    |             Feature |
    | --- | :-------: | ------------------: |
    | 1   |   Event   |       Component tab |
    | 2   |  Device   |     Scan QR/barcode |
    | 3   | Variables |    Set app variable |
    | 4   |   Data    |        HTTP request |
    | 5   | Variables |    Set app variable |
    | 6   |  Storage  | Set item to storage |
    | 7   | Variables |    Set app variable |
    | 8   | Variables |    Set app variable |
    | 9   | Variables |    Set app variable |
    | 10  |  Storage  | Set item to storage |

    >#1 Event - Component tab <br>
    >[<img src="./images/image146.png" width="100">](./images/image146.png)

    >#2 Device - Scan QR/barcode <br>
    >[<img src="./images/image147.png" width="100">](./images/image147.png)

    >3 Variables - Set app variable <br>
    >[<img src="./images/image148.png" width="100">](./images/image148.png)
    >[<img src="./images/image149.png" width="100">](./images/image149.png)
    >[<img src="./images/image150.png" width="100">](./images/image150.png)
    >[<img src="./images/image151.png" width="100">](./images/image151.png)

    >4 Data - HTTP request <br>
    >**URL**: https://`<<CAP service endpoint e.g. sap-dev-covidapp-srv.cfapps.eu10.hana.ondemand.com>>`/rest/verification/decodeCertificateString<br>
    >[<img src="./images/image152.png" width="100">](./images/image152.png)
    >[<img src="./images/image153.png" width="100">](./images/image153.png)
    >[<img src="./images/image154.png" width="100">](./images/image154.png)
    >[<img src="./images/image155.png" width="100">](./images/image155.png)

    >5 Variables - Set app variable <br>
    >**Country (Formula)**: outputs["HTTP request"].resBodyParsed.country<br>
    >**Name (Formula)**: outputs["HTTP request"].resBodyParsed.name<br>
    >**Photo (Formula)**: outputs["HTTP request"].resBodyParsed.photo<br>
    >**ValidUntil (Formula)**: outputs["HTTP request"].resBodyParsed.validUntil<br>
    >[<img src="./images/image156.png" width="100">](./images/image156.png)
    >[<img src="./images/image157.png" width="100">](./images/image157.png)
    >[<img src="./images/image158.png" width="100">](./images/image158.png)<br>
    >[<img src="./images/image159.png" width="100">](./images/image159.png)
    >[<img src="./images/image160.png" width="100">](./images/image160.png)
    >[<img src="./images/image161.png" width="100">](./images/image161.png)
    >[<img src="./images/image162.png" width="100">](./images/image162.png)

    >6 Storage - Set item to storage <br>
    >[<img src="./images/image163.png" width="100">](./images/image163.png)
    >[<img src="./images/image164.png" width="100">](./images/image164.png)

    >7 Variables - Set app variable <br>
    >**Message (Formula)**: outputs["HTTP request"].resBodyParsed.message<br>
    >**UploadTime (Formula)**: NOW('DD-MM-YYYY HH:mm:ss')<br>
    >[<img src="./images/image165.png" width="100">](./images/image165.png)
    >[<img src="./images/image166.png" width="100">](./images/image166.png)
    >[<img src="./images/image167.png" width="100">](./images/image167.png)
    >[<img src="./images/image168.png" width="100">](./images/image168.png)
    >[<img src="./images/image169.png" width="100">](./images/image169.png)

    >8 Variables - Set app variable <br>
    >**Message (Formula)**: outputs["HTTP request"].resBodyParsed.error.message<br>
    >**Status (Formula)**: outputs["HTTP request"].resBodyParsed.error.code<br>
    >**UploadTime (Formula)**: NOW('DD-MM-YYYY HH:mm:ss')<br>
    >[<img src="./images/image170.png" width="100">](./images/image170.png)
    >[<img src="./images/image171.png" width="100">](./images/image171.png)
    >[<img src="./images/image172.png" width="100">](./images/image172.png)
    >[<img src="./images/image173.png" width="100">](./images/image173.png)
    >[<img src="./images/image174.png" width="100">](./images/image174.png)
    >[<img src="./images/image175.png" width="100">](./images/image175.png)

    >9 Variables - Set app variable <br>
    >**UploadTime (Formula)**: NOW('DD-MM-YYYY HH:mm:ss')<br>
    >[<img src="./images/image176.png" width="100">](./images/image176.png)
    >[<img src="./images/image177.png" width="100">](./images/image177.png)
    >[<img src="./images/image178.png" width="100">](./images/image178.png)
    >[<img src="./images/image179.png" width="100">](./images/image179.png)
    >[<img src="./images/image180.png" width="100">](./images/image180.png)

    >10 Storage - Set item to storage <br>
    >[<img src="./images/image181.png" width="100">](./images/image181.png)
    >[<img src="./images/image182.png" width="100">](./images/image182.png)


2. Please select the **Upload certificate** button in your canvas, add the following components to your logic flow and connect them as depicted, before you start with the individual configurations. 
    ![AppGyver](./images/image183.png)

    | #   |   Type    |                 Feature |
    | --- | :-------: | ----------------------: |
    | 1   |   Event   |           Component tab |
    | 2   |   Media   | Pick image from library |
    | 3   | Variables |        Set app variable |
    | 4   |   Media   |       Convert to base64 |
    | 5   |   Data    |            HTTP request |
    | 6   | Variables |        Set app variable |
    | 7   |  Storage  |     Set item to storage |
    | 8   | Variables |        Set app variable |
    | 9   | Variables |        Set app variable |
    | 10  | Variables |        Set app variable |
    | 11  |  Storage  |     Set item to storage |

    >#1 Event - Component tab <br>
    >[<img src="./images/image146.png" width="100">](./images/image146.png)

    >#2 Media - Pick image from library <br>
    >[<img src="./images/image184.png" width="100">](./images/image147.png)

    >3 Variables - Set app variable <br>
    >[<img src="./images/image148.png" width="100">](./images/image148.png)
    >[<img src="./images/image149.png" width="100">](./images/image149.png)
    >[<img src="./images/image150.png" width="100">](./images/image150.png)
    >[<img src="./images/image151.png" width="100">](./images/image151.png)

    >4 Media - Convert to base64 <br>
    >[<img src="./images/image185.png" width="100">](./images/image185.png)
    >[<img src="./images/image186.png" width="100">](./images/image186.png)

    >5 Data - HTTP request <br>
    >**URL**: https://`<<CAP service endpoint e.g. sap-dev-covidapp-srv.cfapps.eu10.hana.ondemand.com>>`/rest/verification/decodeQrCode<br>
    >[<img src="./images/image187.png" width="100">](./images/image187.png)
    >[<img src="./images/image188.png" width="100">](./images/image188.png)
    >[<img src="./images/image189.png" width="100">](./images/image189.png)

    >6 Variables - Set app variable <br>
    >**Country (Formula)**: outputs["HTTP request"].resBodyParsed.country<br>
    >**Name (Formula)**: outputs["HTTP request"].resBodyParsed.name<br>
    >**Photo (Formula)**: REPLACE_ALL(REPLACE_ALL(REPLACE_ALL(outputs["HTTP request"].resBodyParsed.photo, "\r\n", ""),"_", "/"), "-", "+")<br>
    >**ValidUntil (Formula)**: REPLACE_ALL(outputs["HTTP request"].resBodyParsed.validUntil, "-", "")<br>
    >[<img src="./images/image156.png" width="100">](./images/image156.png)
    >[<img src="./images/image157.png" width="100">](./images/image157.png)
    >[<img src="./images/image158.png" width="100">](./images/image158.png)<br>
    >[<img src="./images/image159.png" width="100">](./images/image159.png)
    >[<img src="./images/image160.png" width="100">](./images/image160.png)
    >[<img src="./images/image161.png" width="100">](./images/image161.png)
    >[<img src="./images/image162.png" width="100">](./images/image162.png)

    >7 Storage - Set item to storage <br>
    >[<img src="./images/image163.png" width="100">](./images/image163.png)
    >[<img src="./images/image164.png" width="100">](./images/image164.png)

    >8 Variables - Set app variable <br>
    >**Message (Formula)**: outputs["HTTP request"].resBodyParsed.message<br>
    >**UploadTime (Formula)**: NOW('DD-MM-YYYY HH:mm:ss')<br>
    >[<img src="./images/image165.png" width="100">](./images/image165.png)
    >[<img src="./images/image166.png" width="100">](./images/image166.png)
    >[<img src="./images/image167.png" width="100">](./images/image167.png)
    >[<img src="./images/image168.png" width="100">](./images/image168.png)
    >[<img src="./images/image169.png" width="100">](./images/image169.png)

    >9 Variables - Set app variable <br>
    >**Message (Formula)**: outputs["HTTP request"].resBodyParsed.error.message<br>
    >**Status (Formula)**: outputs["HTTP request"].resBodyParsed.error.code<br>
    >**UploadTime (Formula)**: NOW('DD-MM-YYYY HH:mm:ss')<br> 
    >[<img src="./images/image170.png" width="100">](./images/image170.png)
    >[<img src="./images/image171.png" width="100">](./images/image171.png)
    >[<img src="./images/image172.png" width="100">](./images/image172.png)
    >[<img src="./images/image173.png" width="100">](./images/image173.png)
    >[<img src="./images/image174.png" width="100">](./images/image174.png)
    >[<img src="./images/image175.png" width="100">](./images/image175.png)

    >10 Variables - Set app variable <br>
    >**UploadTime (Formula)**: NOW('DD-MM-YYYY HH:mm:ss')<br>
    >[<img src="./images/image176.png" width="100">](./images/image176.png)
    >[<img src="./images/image177.png" width="100">](./images/image177.png)
    >[<img src="./images/image178.png" width="100">](./images/image178.png)
    >[<img src="./images/image179.png" width="100">](./images/image179.png)
    >[<img src="./images/image180.png" width="100">](./images/image180.png)

    >11 Storage - Set item to storage <br>
    >[<img src="./images/image181.png" width="100">](./images/image181.png)
    >[<img src="./images/image182.png" width="100">](./images/image182.png)

---

## Launch your app

You can launch your app initially from the **Launch** tab. Therefore we recommend using the SAP AppGyver app which is available in the Google Play or Apple AppStore. Just scan the QR code and the app will start on your device. 

![AppGyver](./images/image13.png)

If you want to get the full picture about the entire solution, please read the corresponding blog post. TODO LINK 

