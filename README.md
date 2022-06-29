<<<<<<< HEAD
# Office Access - Covid Check app for SAP AppGyver

## Description

Description by Jim missing :-)

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

### [Step 5: Test cases](./tutorials/5_TestCases/README.md)
(Nani)

## Further Information

## Disclaimers:
- The author does not have a complete picture of all functional / non-functional requirements of the solution, e.g., legal requirements
- The concept is not meant to compete with the Microsoft PowerApps based solution built for the SAP Pandemic Taskforce.
- The concept tries to implement an easier workflow for the end-users of the solution (SAP employees, Pandemic Taskforce staff) than provided with the MS PowerApps based solution).

## Known Issues

None. 

## How to obtain support
[Create an issue](https://github.com/SAP-samples/covid-checker/issues) in this repository if you find a bug or have questions about the content.
=======
# SAP-samples/repository-template
This default template for SAP Samples repositories includes files for README, LICENSE, and .reuse/dep5. All repositories on github.com/SAP-samples will be created based on this template.

# Containing Files

1. The LICENSE file:
In most cases, the license for SAP sample projects is `Apache 2.0`.

2. The .reuse/dep5 file: 
The [Reuse Tool](https://reuse.software/) must be used for your samples project. You can find the .reuse/dep5 in the project initial. Please replace the parts inside the single angle quotation marks < > by the specific information for your repository.

3. The README.md file (this file):
Please edit this file as it is the primary description file for your project. You can find some placeholder titles for sections below.

# [Title]
<!-- Please include descriptive title -->

<!--- Register repository https://api.reuse.software/register, then add REUSE badge:
[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/REPO-NAME)](https://api.reuse.software/info/github.com/SAP-samples/REPO-NAME)
-->

## Description
<!-- Please include SEO-friendly description -->

## Requirements

## Download and Installation

## Known Issues
<!-- You may simply state "No known issues. -->

## How to obtain support
[Create an issue](https://github.com/SAP-samples/<repository-name>/issues) in this repository if you find a bug or have questions about the content.
>>>>>>> 2924a86e7bf355081d34764db150b4fc220c2700
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing
<<<<<<< HEAD
If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).
=======
If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License
Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
>>>>>>> 2924a86e7bf355081d34764db150b4fc220c2700
