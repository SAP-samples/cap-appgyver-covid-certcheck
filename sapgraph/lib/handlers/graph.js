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
      const employeeDataFromSF = await getEmployeeData(authToken);
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

async function getEmployeeData(authToken){
  //fetch logged in user email from token
  const userEmail = getUserEmailFromAuthToken(authToken);
  if(userEmail){
    const graphUri = xsenv.cfServiceCredentials(GRAPH_INSTANCE_NAME).uri;
    const personIdQueryUrl = `${graphUri}/${DATA_GRAPH_ID}/${HCM_ENTITY}/PerEmail?$filter=isPrimary eq true and emailAddress eq '${userEmail}'&$select=personIdExternal&$top=1`;
    const response = await querySF(personIdQueryUrl,authToken);
    const personIdExternal = response.personIdExternal;
    const empUrl = `${graphUri}/${DATA_GRAPH_ID}/${HCM_ENTITY}/PerPerson?$filter=personIdExternal eq '${personIdExternal}'&$top=1&$expand=personalInfoNav,employmentNav`;
    const dataFromSF = await querySF(empUrl, authToken);
    const firstNameFromSF = dataFromSF.personalInfoNav[0].firstName;
    const lastNameFromSF = dataFromSF.personalInfoNav[0].lastName;
    const dateOfBirthFromSF = dataFromSF.dateOfBirth;
    const sfData = {};
    sfData.firstName = firstNameFromSF;
    sfData.lastName = lastNameFromSF;
    sfData.dateOfBirth = dateOfBirthFromSF;
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
  const options = {
    method: "get",
    headers: {
      "Authorization": authToken,
      "Accept": "application/json"
    }
  };
  const response = await fetch(url, options);
  const result = (await response.json()).value[0];
  return result;
}

function isStringValid(str) {
    if (!str || typeof str !== 'string' || str.length < 1 || str.length > 100 || !VALID_NAME_REGEX.test(str)) {
      return false;
    }
    return true;
}

function getUserEmailFromAuthToken(authToken) {
  let sUserEmail = '';
  try {
    if (!authToken) {
      return sUserEmail;
    }
    //Retrive token type and token from Auth header
    const parts = authToken.split(' ');
    let sTokenType = '';
    let sToken = '';
    if (parts.length > 1) {
      sTokenType = parts[0];
      sToken = parts[1];
    }
    if (sTokenType === 'Bearer') {
      const decodedToken = jsonwebtoken.decode(sToken);
      if (!decodedToken) {
        return sUserEmail;
      }
      sUserEmail = decodedToken.email;
    }
  } catch (error) {
    return sUserEmail;
  }
  return sUserEmail;
}

module.exports = {
  handleEmployeeQuery
};
