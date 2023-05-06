# CSCI3100-project-Rettiwt
This project is a simplified social media platform for users to share and interact with others. It allows users to follow each other and post, edit, delete, like, comment posts. The server runs on local host.

## Developer Environment Setup
You will need to download nodejs first before you can run the server, you can download via https://nodejs.org/en/download.

After downloading nodejs, there are a few dependencies to download using npm.  
First, initialize the package.  
run `npm init -y`. 
Then download the dependencies, which are "body-parser", "ejs", "express" and "mysql".  
run `npm i <package_name>` for each of them.

Lastly, before starting the server, you should connect to the database, you can configure it in public/db.js.

After that, you can run `node rettiwt_server.js` to start the server.
