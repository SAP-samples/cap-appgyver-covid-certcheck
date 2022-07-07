[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/cap-appgyver-covid-certcheck)](https://api.reuse.software/info/github.com/SAP-samples/cap-appgyver-covid-certcheck)

# Validate Covid Certificates using SAP AppGyver, SAP BTP and OpenSource - A Sample App
This repository contains a sample application for the submission, validation, and associated workflow of restricting or permitting building entry to an employee, based on the validity of their Covid Certificate. It focuses on use of SAP Business Technology Platform (BTP) components such as SAP AppGyver, SAP Cloud Application Programming, and SAP Graph, working together to demonstrate the end to end process.
<!-- Please include descriptive title -->

<!--- Register repository https://api.reuse.software/register, then add REUSE badge:
[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/REPO-NAME)](https://api.reuse.software/info/github.com/SAP-samples/REPO-NAME)
-->

## Description
The COVID-19 pandemic created far-reaching impacts and disruption to nearly every facet of public life. One example was embodied in the return to work process, where companies needed to minimize risk to their returning onsite employees, while protecting their own business interest from widespread community transmission.

In many countries, verification of vaccination or recovery is provided in a so-called ["Covid Certificate"](https://ec.europa.eu/info/live-work-travel-eu/coronavirus-response/safe-covid-19-vaccines-europeans/eu-digital-covid-certificate_en) containing personal information and dates that confirm the holder is protected from the virus and thus able to safely enter the work facility. Implementing this process of verification at scale is both daunting and time consuming, and frequently requires manual steps by the submitting employee as well as a facilities person to approve or deny the building access.

The application in this repository illustrates how various components of SAP BTP can be utilized together to provide an automated and intelligent workflow enabling submission, enrichment, and approval of the employee's Covid Certificate, resulting in a secure and nearly frictionless process. 
<!-- Please include SEO-friendly description -->

![architecture](./tutorials/0_General/images/architecture.png)

## Requirements
The required systems and components are:

- SAP BTP PAYGO (e.g. Free Tier) or CPEA contract
- SAP SuccessFactors system
- Covid vaccination certificate

Entitlements/Quota required in your SAP Business Technology Platform Account:

| Service                                    | Plan        | Number of instances |
| ------------------------------------------ | ----------- | ------------------- |
| Cloud Foundry Memory                       |             | 1GB                 |
| SAP Cloud Identity Services                | application | 1                   |
| SAP Graph                                  | standard    | 1                   |
| HTML5 Application Repository Service       | app-host    | 1                   |
| Destination Service                        | lite        | 2                   |
| SAP HANA Schemas & HDI Containers          | hdi-shared  | 1                   |
| SAP HANA Cloud                             | hana        | 1                   |
| Authorization and Trust Management Service | application | 1                   |


Subscriptions required in your SAP Business Technology Platform Account:

| Subscription                    | Plan                                        |
| ------------------------------- | ------------------------------------------- |
| SAP AppGyver                    | standard                                    |
| SAP Business Application Studio | standard-edition                            |
| SAP Cloud Identity Services     | default (only if SAP IAS not available yet) |
| Launchpad Service               | standard                                    |


## Setup and Configuration

### [Step 1: Security setup](./tutorials/1_SecuritySetup/README.md) 

In this part of the tutorial you will learn how to setup the security related aspects of your scenario. The security setup will allow you secure access to your CAP REST endpoints using the so called PKCE flow. Therefore you will use SAP Identity Authentication Service and integrate it with your CAP service secured by SAP XSUAA. 

### [Step 2: Graph application](./tutorials/2_EmployeeLookupService/README.md)

In this part of the tutorial you will learn how to setup and configure app that queries SAP SuccessFactors using SAP BTP Graph service. This includes subscribing to the SAP Graph Service and creating a Destination for SAP SuccessFactors and configuring SAP Graph to query SAP SuccessFactors.

### [Step 3: Backend application](./tutorials/3_BackendApplication/README.md)

In this part of the tutorial you are going to deploy the main backend application built with the SAP Cloud Application Programming Model. This app validates and verifies the uploaded Covid Certificate and communicates with the earlier deployed EmployeeLookupService.

### [Step 4: AppGyver app](./tutorials/4_AppGyverApp/README.md)

In this part of the tutorial you will learn how to setup and configure your SAP AppGyver app including a secure access to your CAP REST endpoints. The SAP AppGyver app will allow you to upload or scan Covid vaccination or test certificates. The certificate will be checked in the CAP service and the validation result will be displayed and stored in the SAP AppGyver app. 

## Further Information

* Blog Post on the SAP Community about the entire sample app: [*"Validate Covid Certificates using SAP AppGyver, SAP BTP and OpenSource – A Sample App"*](https://blogs.sap.com/?p=1544180)
* Central Covid Certificate Validation Rules: https://distribution.dcc-rules.de/rules
* Digital Signing Certificate for Covid Certificates: https://de.dscg.ubirch.com/trustList/DSC/
* Blog Post on the SAP Community about PKCE in SAP AppGyver: [*SAP AppGyver and Proof Key for Code Exchange (PKCE) or “Striving for enterprise-grade security in SAP low-code applications”*](https://blogs.sap.com/2022/03/22/sap-appgyver-and-proof-key-for-code-exchange-pkce-or-striving-for-enterprise-grade-security-in-sap-low-code-applications/)
* [Technical Specifications
for EU Digital COVID Certificates](https://health.ec.europa.eu/system/files/2022-02/eu-dcc_validation-rules_en.pdf)
## Disclaimers:
- The author does not have a complete picture of all functional / non-functional requirements of the solution, e.g., legal requirements

## Known Issues
No known issues.

## How to obtain support
[Create an issue](https://github.com/SAP-samples/<repository-name>/issues) in this repository if you find a bug or have questions about the content.
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing
If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).
## License
Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.

