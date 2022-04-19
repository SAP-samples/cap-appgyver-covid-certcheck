'use strict';
const xsenv = require('@sap/xsenv');
const { stringSimilarity } = require("string-similarity-js");
const httpStatus = require('http-status-codes');
const fetch = require("node-fetch");
const jsonwebtoken = require('jsonwebtoken');
const VALID_NAME_REGEX =  /^[A-Za-z0-9_.'-]*$/;
const GRAPH_INSTANCE_NAME = 'covidApp-graph';
const DATA_GRAPH_ID = 'v1';
const HCM_ENTITY = 'sap.hcm';

async function handleEmployeeQuery(req, res) {
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  //validate firstName and lastName
  if(!isStringValid(firstName)){
    res.status(httpStatus.StatusCodes.BAD_REQUEST).send('Invalid Query Parameter '+firstName);
  } else if(!isStringValid(lastName)){
    res.status(httpStatus.StatusCodes.BAD_REQUEST).send('Invalid Query Parameter '+lastName);
  } else {
    //query SF and return result
    const authToken = req.headers.authorization;
    try{
      //exchange covid app xsuaa token with graph xsuaa token
      const graphToken = await getGraphXSUAAToken(authToken);
      const employeeDataFromSF = await getEmployeeData(graphToken);
      //compare data from SF with name from covid certificate
      const nameFromCertificate = firstName + ' ' + lastName;
      const nameFromSF = employeeDataFromSF.firstName + ' ' + employeeDataFromSF.lastName;
      const areStringsSimilar = await checkStringSimilarity(nameFromCertificate, nameFromSF);
      if(areStringsSimilar){
        res.status(httpStatus.StatusCodes.OK).json(employeeDataFromSF);
      } else {
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send('Employee data is not matching with HR system');
      }
    } catch(err){
      const errorMessage = err.message? err.message:'Error occured from server';
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(errorMessage);
    }
  }
}

async function getGraphXSUAAToken(authToken){
  const token = (authToken.split(' '))[1];
  const graphUaa = xsenv.cfServiceCredentials(GRAPH_INSTANCE_NAME).uaa;
  const uaaDetails = {
    "grant_type":"urn:ietf:params:oauth:grant-type:jwt-bearer",
    "client_id":graphUaa.clientid,
    "client_secret":graphUaa.clientsecret,
    "response_type":"token+id_token",
    "assertion":token
  };
  const formBody = Object.keys(uaaDetails).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(uaaDetails[key])).join('&');
  const options = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formBody
  };

  const oAuthUrl = graphUaa.url+"/oauth/token";
  const response = await fetch(oAuthUrl, options);
  const graphToken1 = (await response.json()).access_token;
  return graphToken1;
}

async function getEmployeeData(authToken){
  //fetch logged in user email from token
  const userEmail = await getUserEmailFromAuthToken(authToken);
  if(userEmail){
    const graphUri = xsenv.cfServiceCredentials(GRAPH_INSTANCE_NAME).uri;
    const graphAPI = `${graphUri}/${DATA_GRAPH_ID}/${HCM_ENTITY}`;
    const personalInfoQueryUrl = `${graphAPI}/PerEmail?$filter=isPrimary eq true and emailAddress eq '${userEmail}'&$select=personIdExternal&$top=1&$expand=personNav($expand=personalInfoNav,employmentNav)`;
    const personalInfoFromSF = await querySF(personalInfoQueryUrl, authToken);
    const personNav = personalInfoFromSF.personNav;
    const personalInfoNav = personNav.personalInfoNav[0];
    const employmentNav = personNav.employmentNav[0];
    const firstNameFromSF = personalInfoNav.firstName;
    const lastNameFromSF = personalInfoNav.lastName;
    const dateOfBirthFromSF = personalInfoFromSF.dateOfBirth;
    const isContingentWorker = employmentNav.isContingentWorker;
    const startDate = employmentNav.startDate;
    const endDate = employmentNav.endDate;
    const userId = employmentNav.userId;
    //get employee job details
    const empJobUrl = `${graphAPI}/EmpJob?$filter=userId eq '${userId}'&$top=1&$select=countryOfCompany&$expand=locationNav($select=name)`;
    const empJobDataFromSF = await querySF(empJobUrl, authToken);
    const countryCode = empJobDataFromSF.countryOfCompany;
    const territoryUrl = `${graphAPI}/Territory?$filter=territoryCode eq '${countryCode}'`;
    const territoryDataFromSF = await querySF(territoryUrl, authToken);
    const photoUrl = `${graphAPI}/Photo?$filter=userId eq '${userId}' and photoType eq 26&$top=1&$select=photo,mimeType`;
    const photoDataFromSF = await querySF(photoUrl, authToken);
    const sfData = {};
    sfData.firstName = firstNameFromSF;
    sfData.lastName = lastNameFromSF;
    sfData.dateOfBirth = dateOfBirthFromSF;
    sfData.isContingentWorker = isContingentWorker;
    sfData.startDate = startDate;
    sfData.endDate = endDate;
    sfData.countryOfCompany = territoryDataFromSF.territoryName;
    sfData.location = empJobDataFromSF.locationNav.name;
    sfData.mimeType = photoDataFromSF.mimeType;
    sfData.photo = photoDataFromSF.photo;
    return sfData;
  } else {
    throw new Error("User email not found");
  }
}

async function checkStringSimilarity(string1,string2){
  //fuzzy string similarity between two strings
  const result = await stringSimilarity(string1, string2);
  if(result > 0.8){
      return true;
  }
  return false;
}

async function querySF(url,authToken){
  try{
    const options = {
      method: "get",
      headers: {
        "Authorization": 'Bearer ' + authToken,
        "Accept": "application/json"
      }
    };
    const response = await fetch(url, options);
    const result = (await response.json()).value[0];
    return result;
  } catch(err){
    throw new Error("Employee details not found");
  }
}

function isStringValid(str) {
    if (!str || typeof str !== 'string' || str.length < 1 || str.length > 100 || !VALID_NAME_REGEX.test(str)) {
      return false;
    }
    return true;
}

async function getUserEmailFromAuthToken(authToken) {
  let sUserEmail = '';
  try {
    if (!authToken) {
      return sUserEmail;
    }
    const decodedToken = jsonwebtoken.decode(authToken);
    if (!decodedToken) {
      return sUserEmail;
    }
    sUserEmail = decodedToken.email;
  } catch (error) {
    return sUserEmail;
  }
  return sUserEmail;
}

module.exports = {
  handleEmployeeQuery
};
