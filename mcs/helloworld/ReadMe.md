# Overview

The scaffolding for your API implementation includes two files

1. package.json - This is a standard package.json file.
  The name, version and main sections are mandatory.
  You can also include an oracleMobile section that allows you to provide defaults used in your API execution.
  An empty example of that section is provided.  The 'apis' and 'connectors' sections hold a list of dependencies where:
  	key = uri of connector or api
  	value = default version 

2. Your main javascript file.
  This provides the main body of the scaffold.
  The functions included in the javascript file define where we are expecting API implementation code to appear.

Custom code should be packaged like a npm module.
- Run npm install on your module
- zip the custom code so that is resembles the scaffold file.  (the base directory appears at the base of the zip file)

