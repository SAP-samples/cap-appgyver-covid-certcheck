# AppGyver App Office Access - Covid Check 

## Introduction

Learn how to configure a new AppGyver app that allows you to upload screenshots or scans of Covid vacination certificates to your SAP CAP OData service. After successfull validation of the certificate, the app will display the validity date and status retreived by your service. 

### Create a new AppGyver app

1. Go to your SAP BTP Subaccount and subscribe to the SAP AppGyver service offering. 

2. Open SAP AppGyver from your Subaccount. 

    ![AppGyver](./images/image0.png)

3. Create a new SAP App Gyver project and call it e.g. **CovidChecker**.

### Enable authentication 

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

### Setup your navigation

1. Before you setup the navigation, rename the initial **Empty page** which was created by SAP AppGyver automatically. Therefore switch to the page overview and select the Empty page. 
    ![AppGyver](./images/image11.png)

2. Change the page name to **Office Access - Covid Check** and save your changes. 

    ![AppGyver](./images/image12.png)

3. Switch to the **Navigation** tab and modify the existing **Built-In Navigation**. Change the **icon** and **tab name** of the existing page as displayed in the screenshots. 
    ![AppGyver](./images/image14.png)

    >Hint: The icon used in this tutorial can be found by searching for **superpowers** in the icon library. 
    ![AppGyver](./images/image15.png)

### Apply the SAP Fiori theme

Apply the SAP Fiori theme to your your project in the **Theme** tab of SAP AppGyver. Details can be found in the screenshot. 
![AppGyver](./images/image16.png)

### Add variables to your app

Your SAP AppGyver app will need a variety of variables to store information like access tokens or business data. 

1. To add these variables, first open the **Office Access - Covid Check** page and change the toggle in the top right from **View** to **Variables**. Start adding the reuqired **App Variables** as you can see in the screenshots. 
    ![AppGyver](./images/image17.png)
    ![AppGyver](./images/image18.png)
    ![AppGyver](./images/image19.png)

2. Create two **page variables** required for the current page as you can see in the following screenshot. 
    ![AppGyver](./images/image20.png)

3. Save your changes and switch to the **OAuth** page which requires some more **page variables**. Create them as visible in the screenshot and save your changes again. 
    ![AppGyver](./images/image20a.png)

### Create your login view

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
    
### Create your login view logic

1. Being on the **OAuth** page, open the SAP AppGyver logic section in the bottom of the screen. This is where you will configure the logic applied when the OAuth page is loaded. 

2. Please add the following components to your logic flow and connect them as depicted, before you start with the individual component configurations. 
    ![AppGyver](./images/image26a.png)

    | #  |     Type     |       Feature         |
    |----|:------------:|----------------------:|
    | 1  | Event        | Page mounted          |
    | 2  | View         | Hide spinner          |
    | 3  | Storage      | Get item from storage |
    | 4  | Utility      | If condition          |
    | 5  | Storage      | Get item from storage |
    | 6  | Variables    | Set app variable      |
    | 7  | Data         | HTTP request          |
    | 8  | Variables    | Set app variable      |
    | 9  | Storage      | Set item to storage   |
    | 10 | Storage      | Set item to storage   |
    | 11 | Navigation   | Dismiss initial view  |
    | 12 | JS           | Java Script           |
    | 13 | Variables    | Set page variable     |
    | 14 | Variables    | Set page variable     |

    >#1 Event - Page mounted <br>
    >[<img src="./images/image27.png" width="100">](./images/image27.png)

    >#2 View - Hide spinner <br>
    >[<img src="./images/image29.png" width="100">](./images/image29.png)

    >#3 Storage - Get item from storage <br>
    >[<img src="./images/image28.png" width="100">](./images/image28.png)

    >#4 Utility - If condition <br>
    >[<img src="./images/image30.png" width="100">](./images/image30.png)
    >[<img src="./images/image31.png" width="100">](./images/image31.png)

    >#5 Storage - Get item from storage <br>
    >[<img src="./images/image32.png" width="100">](./images/image32.png)

    >#6 Variables - Set app variable <br>
    >[<img src="./images/image33.png" width="100">](./images/image33.png)
    >[<img src="./images/image34.png" width="100">](./images/image34.png)
    >[<img src="./images/image35.png" width="100">](./images/image35.png)

    >#7 Data - HTTP request <br>
    >[<img src="./images/image36.png" width="100">](./images/image36.png)
    >[<img src="./images/image37.png" width="100">](./images/image37.png)
    >[<img src="./images/image38.png" width="100">](./images/image38.png)
    >[<img src="./images/image39.png" width="100">](./images/image39.png)

    >#8 Variables - Set app variable <br>
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
    >[<img src="./images/image52.png" width="100">](./images/image52.png)
    >[<img src="./images/image54.png" width="100">](./images/image54.png)
    >[<img src="./images/image55.png" width="100">](./images/image55.png)
    >[<img src="./images/image56.png" width="100">](./images/image56.png)

    >#13 Variables - Set page variable <br>
    >[<img src="./images/image57.png" width="100">](./images/image57.png)
    >[<img src="./images/image58.png" width="100">](./images/image58.png)
    >[<img src="./images/image59.png" width="100">](./images/image59.png)

    >#14 Variables - Set page variable <br>
    >[<img src="./images/image60.png" width="100">](./images/image60.png)
    >[<img src="./images/image61.png" width="100">](./images/image61.png)
    >[<img src="./images/image62.png" width="100">](./images/image62.png)

### Create your Office Access - Covid Check view logic flow

1. Being on the **Office Access - Covid Check** page, open the SAP AppGyver logic section in the bottom of the screen. This is where you will configure the logic applied when the content page is loaded. 

2. Please add the following components to your logic flow and connect them as depicted, before you start with the individual component configurations. 
    ![AppGyver](./images/image63.png)

    | #  |     Type     |       Feature         |
    |----|:------------:|----------------------:|
    | 1  | Event        | Page mounted          |
    | 2  | Storage      | Get item from storage |
    | 3  | Variables    | Set app variable      |
    | 4  | Storage      | Get item from storage |
    | 5  | Variables    | Set app variable      |
    | 6  | Data         | HTTP request          |
    | 7  | Variables    | Set page variable     |
    | 8  | View         | Hide spinner          |

    >#1 Event - Page mounted <br>
    >[<img src="./images/image64.png" width="100">](./images/image64.png)

    >#2 Storage - Get item from storage <br>
    >[<img src="./images/image65.png" width="100">](./images/image65.png)

    >#3 Variables - Set app variable <br>
    >[<img src="./images/image66.png" width="100">](./images/image66.png)
    >[<img src="./images/image67.png" width="100">](./images/image67.png)
    >[<img src="./images/image68.png" width="100">](./images/image68.png)
    >[<img src="./images/image69.png" width="100">](./images/image69.png)
    >[<img src="./images/image70.png" width="100">](./images/image70.png)
    >[<img src="./images/image71.png" width="100">](./images/image71.png)
    >[<img src="./images/image72.png" width="100">](./images/image72.png)

    >#4 Storage - Get item from storage <br>
    >[<img src="./images/image73.png" width="100">](./images/image73.png)

    >#5 Variables - Set app variable <br>
    >[<img src="./images/image74.png" width="100">](./images/image74.png)
    >[<img src="./images/image75.png" width="100">](./images/image75.png)
    >[<img src="./images/image76.png" width="100">](./images/image76.png)
    >[<img src="./images/image77.png" width="100">](./images/image77.png)
    >[<img src="./images/image78.png" width="100">](./images/image78.png)
    >[<img src="./images/image79.png" width="100">](./images/image79.png)

    >#6 Data - HTTP request <br>
    >[<img src="./images/image80.png" width="100">](./images/image80.png)
    >[<img src="./images/image81.png" width="100">](./images/image81.png)
    >[<img src="./images/image82.png" width="100">](./images/image82.png)
    >[<img src="./images/image83.png" width="100">](./images/image83.png)

    >#7 Variables - Set page variable <br>
    >[<img src="./images/image84.png" width="100">](./images/image84.png)
    >[<img src="./images/image85.png" width="100">](./images/image85.png)
    >[<img src="./images/image86.png" width="100">](./images/image86.png)

    >#8 View - hide spinner <br>
    >[<img src="./images/image87.png" width="100">](./images/image87.png)

### Create your Office Access - Covid Check view

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
    >[<img src="./images/image104.png" width="100">](./images/image104.png)
    >[<img src="./images/image105.png" width="100">](./images/image105.png)
    >[<img src="./images/image106.png" width="100">](./images/image106.png)
    >[<img src="./images/image107.png" width="100">](./images/image107.png)
    >[<img src="./images/image108.png" width="100">](./images/image108.png)
    
    >#5 Text <br>
    >[<img src="./images/image104.png" width="100">](./images/image104.png)

    


### Launch your app

You can launch your app initially from the **Launch** tab. Therefore we recommend to use the SAP AppGyver app which is available in the Google or Apple app stores. Just scan the QR code and the app will start on your device. 

![AppGyver](./images/image13.png)

### Setup your navigation

