kick-ed
-------

Crowdsourcing lesson content for the Ed Platform
Meant to be used as a node module in an express environment 

Features

- uploadRouter.apply(expressApp, url) 

Takes an express app, and a string as parameters. 
Handles the direct upload to s3. 
When the upload is finished, the client receives the s3 url of the asset. 
