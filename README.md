# Office Access - Covid Check app for SAP AppGyver

Concept of COVID-19 Check related to the “obligation to work from home and entering SAP’s workplaces” requirement.
This repository contains code samples and step by step instructions to enable *......*. 

## Description

The current COVID-19 pandemic has a big impact and implications on everyone’s personal life. Changing regulations and rules demand flexibility and often require new ways of doing things.
But this does not stop in private life, frequently changing legal regulations have to implemented by enterprises and institutions on short notice making it hard to come up with nicely automated solutions that integrate with enterprise’s often complex IT-environments; not to forget compliance and data protection requirements.
Sounds like a promising and compelling use case for testing a Low Code / No Code approach, doesn’t it?


### Current Position - What is the challenge?
(Max & Uwe)

### Destination - What is the outcome?
(Max & Uwe)

### How You Get There - What is the solution?
(Max & Uwe)

![architecture](./tutorials/0_General/images/architecture.png)

## Requirements
The required systems and components are:

- SAP BTP PAYGO (e.g. Free Tier) or CPEA contract
- SAP SuccessFactors system
- Covid vaccination certificate

Entitlements/Quota required in your SAP Business Technology Platform Account:

| Service                                       | Plan              | Number of instances |
| --------------------------------------------- | ----------------- | ------------------- |
| Cloud Foundry Memory                          |                   | 1GB                 |
| SAP Cloud Identity Services                   | application       | 1                   |
| SAP Graph                                     | standard          | 1                   |
| HTML5 Application Repository Service          | app-host          | 1                   |
| Destination Service                           | lite              | 2                   |
| SAP HANA Schemas & HDI Containers             | hdi-shared        | 1                   |
| SAP HANA Cloud                                | hana              | 1                   |
| Authorization and Trust Management Service    | application       | 1                   |


Subscriptions required in your SAP Business Technology Platform Account:

| Subscription                      | Plan                                                |
| --------------------------------- | --------------------------------------------------- |
| SAP AppGyver                      | standard                                            |
| SAP Business Application Studio   | standard-edition                                    |
| SAP Cloud Identity Services       | default (only if SAP IAS not available yet)         |
| Launchpad Service                 | standard                                            |


## Setup and Configuration

### [Step 1: Security setup](./tutorials/1_SecuritySetup/README.md) 

In this part of the tutorial you will learn how to setup the security related aspects of your scenario. The security setup will allow you secure access to your CAP REST endpoints using the so called PKCE flow. Therefore you will use SAP Identity Authentication Service and integrate it with your CAP service secured by SAP XSUAA. 

(Martin & Jim - Uwe the "Validation Monkey")
### [Step 2: Backend application](./tutorials/2_BackendApplication/README.md)
(Max)

### [Step 3: Graph application](./tutorials/3_EmployeeLookupService/README.md)

In this part of the tutorial you will learn how to setup and configure app that queries SuccessFactors using SAP BTP Graph service. This includes subscripbing to SAP BTP Graph Service and creating a destination for SuccessFactors and configuring SAP Graph to query SucessFactors.

(Praveen)

### [Step 4: AppGyver app](./tutorials/4_AppGyverApp/README.md)

In this part of the tutorial you will learn how to setup and configure your SAP AppGyver app including a secure access to your CAP REST endpoints. The SAP AppGyver app will allow you to upload or scan Covid vaccination or test certificates. The certificate will be checked in the CAP service and the validation result will be displayed and stored in the SAP AppGyver app. 

(Martin & Jim - Uwe the "Validation Monkey")
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
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing

Do you have ideas how to improve this scenario? Do you want to correct descriptions/artifacts of this repository? Don't hesitate to open a PR and we'll have a look at it. 

## License
Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.
