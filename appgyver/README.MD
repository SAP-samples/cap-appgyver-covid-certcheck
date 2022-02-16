# SAP AppGyver configuration

## Initial app setup

  1. Run the LCNC Booster in BTP
  2. Access SAP AppGyver from LCNC application lobby and create a new app called CovidApp
  3. Create a page called **OAuth**
  4. Select **AUTH** and enable authentication for the app
  5. Select **Direct third party authentication**
  6. Set **OAuth** to be the initial view
  7. Delete the login page
  8. Select the **OAuth** page
  9. Remove the default widgets and add a WebView component to the canvas. You will need to install it from the component market (note that WebView component only renders on mobile device)
     1. set URL property to: https://awhs090l4.accounts400.ondemand.com/oauth2/authorize?response_type=code&scope=openid,email&client_id=f06e0956-37e7-418c-a5b2-8c5864461d40&nonce=m-0G6_FaS3K&state=state&redirect_uri=https://localhost
     2. Set layout of WebView to Width and Height > Advanced > Grow set to 1
     3. Set layout of WebView > Position > Align Self to Align this horizontally to the middle
  10. Select Page Layout element > Style > Check **Stretch to Viewport Height** and **Disable Scrolling**
  11. Expand Padding and clear it to make the component full screen

## OAuth configuration

  1. Click **Variables** and add an App Variable with the following properties:
     1.  Variable name: auth
     2.  Variable value type: Object
     3.  Add the following object properties, as below
         1.  authCode (text)
         2.  authToken (text)
         3.  expiresIn (text)
         4.  idToken (text)
         5.  refreshToken (text)

           <placeholder for screenshot>
      4.  Save the app and go back to OAuth screen view
      5.  Select the WebView component and expand the logic modeling screen from the bottom
      6.  Install the HTTP request component from the flow function market
      7.  Configure the component logic as below:
      8.  Configure each node as follows:
          1.  JS
              1. input1: Output Value of another node > Receive event / Event Object
              2. JavaScript:
              3. Output 1 properties:
                 1. code (text)
                 2. codeAvailable (text)
          2.  If condition > Output Value of another node > Function > codeAvailable
          3.  Set app variable:
              1.  Variable name > auth.authCode
              2.  Assigned value > Output value of another node > Function > code
          4.  HTTP Request:
              1.  URL > https://awhs090l4.accounts400.ondemand.com/oauth2/token
              2.  HTTP Method > POST
              3.  Headers > Custom List:
                  1.  Header: Content-Type  
                  2.  Value: application/x-www-form-urlencoded
                  3.  Header: Authorization
                  4.  Value: Basic ZjA2ZTA5NTYtMzdlNy00MThjLWE1YjItOGM1ODY0NDYxZDQwOlBZTFpDN0lZNHlyX0FFRUJMaFd2VHRSX11zZmlZag==
              4.  Request Body > Formula > {"grant_type": "authorization_code", "code": appVars.auth.authCode, "redirect_uri": "https://localhost", "client_id": "f06e0956-37e7-418c-a5b2-8c5864461d40"}
              5.  Request Body Type > x-www-form-urlencoded
          5.  Alert > Formula > ENCODE_JSON(outputs["HTTP request"].error)
          6.  Last 4 Set app variable components:
              1.  auth.authToken > Formula > STRING(outputs["HTTP request"].resBodyParsed.access_token)
              2.  auth.refreshToken > Formula > STRING(outputs["HTTP request"].resBodyParsed.refresh_token)
              3.  auth.idToken > Formula > STRING(outputs["HTTP request"].resBodyParsed.id_token)
              4.  auth.expiresIn > Formula > STRING(outputs["HTTP request"].resBodyParsed.expires_in)
      9.  Save the app before continuing

## Pages to display OAuth details

  1. Create 2 additional pages, Start and Token
  2. Access Start Page
     1. Add text placeholders to display the `auth.authCode` and `auth.authToken` values
  3. Save and access Token page
     1. Add text placeholders to display the `auth.refreshToken`, `auth.expiresIn`, and `auth.idToken` values
  4. Save and click **Navigation**
     1. Rename the first tab to **Start** amd set the page to the same value
     2. Add another item and change the label and value to **Token**
  5. Save the application