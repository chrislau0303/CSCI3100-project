# CSCI3100-project-Rettiwt
This project is a simplified social media platform for users to share and interact with others. It allows users to follow each other and post, edit, delete, like, comment posts. The server runs on local host.

## Developer Environment Setup
You will need to download nodejs first before you can run the server, you can download via https://nodejs.org/en/download.

After downloading nodejs, there are a few dependencies to download using npm.    
First, initialize the package.   
run `npm init -y`. 
Then download the dependencies, which are "body-parser", "ejs", "express" and "mysql2".  
run `npm i body-parser ejs express mysql2` to install them all.

Lastly, before starting the server, you should connect to the database, you can configure it in public/db.js. You will have to set up the database first. The SQL queries to create the tables are provide here.

After all is set, you can run `node rettiwt_server.js` to start the server.

## public
This folder contains all the files other than ".ejs" files, including the images, extra ".js" files.
## views
This folder contains all the ".ejs" files, which are the templates for the html pages.
