# ![TreeBook Logo](https://s3-us-west-1.amazonaws.com/treebookicons/tree-64.png) TreeBook

TreeBook is the definitive social networking site for Tree Huggers, Lovers and Enthusiasts.

##Contributors:
*Greenfield:* Paulo Dniz, Eddie Dolan, Jonah Nisenson, and Eric Liu

*Legacy:* John Zhang, Seunghoon Ko, and Eli Xian

## Folder structure

The folder structure used was provided by [mean.io](mean.io). They have extensive documentation on the folder structure and how best to program in it. We strongly recommend taking time to go through the folder structure and understand how the logic flows.

```

├── config/
│   ├── env/                // Configuration files for different environments.
│   ├── packages/           // Application logic
│   │   ├── articles/       // Logic for tree functionality
│   │   ├── system/         // Logic for all non tree and non user pages (index, about, etc)
│   │   ├── theme/          // Logic for styling and components (header / footer)
│   │   ├── users/          // Logic for users

```
Each of articles, system, then and users loosely has the following structure
```

├── public/                 // Front end files
│   ├── assets/             // Css and images
│   ├── controllers/        // Angular controllers
│   ├── routes/             // Angular routes for front end logic
│   ├── services/           // Angular services
│   ├── tests/              // Mocha tests
│   ├── views/              // HTML
├── server/                 // Holds all backend files
│   ├── controllers/        // Backend controllers
│   ├── routes/             // Express routes


```

### Code Flow and API
In order to help you understand the folder structure we will walk through how data flows through the application logic for a specific use.
For detailed API information please refer to the [api readme](api.md).
<pre>
When a user posts a message on the tree profile page -
'SubmitMessage' is invoked in packages/articles/public/controllers/MessagesController.js
'SubmitMessage' uses the the 'Messages' factory in packages/articles/public/services/articles.js
A post request is submitted to /usermessages
Express routes the request via packages/articles/server/routes/MessagesController.js to 'postMessagesFromUser'
In packages/articles/server/controllers/articles.js 'postMessagesFromUser' inserts the message into the database
</pre>



## Environmental Vars
Create a .profile bash script that exports the following variables
```
#!/bin/sh
export TBSECRET=""                  #Secret Key for cookies
export APPLICATIONID=""             #ChatBot API
export POSTGRES=""                  #SQL DB with tree data
export AZURE_STORAGE_ACCOUNT=""     #Storage for image uploads 
export AZURE_STORAGE_ACCESS_KEY=""  #Storage for image uploads
export TBPASS=""                    #Email for reset password
export TBEMAIL=""                   #Email for reset password
export NODE_ENV="DEVELOPMENT"       #For local development only
```


## License
We believe that mean should be free and easy to integrate within your existing projects so we chose [The MIT License](http://opensource.org/licenses/MIT)

## ToDo
- Refactor much of the code from 'articles' to 'trees'
- Build admin functionality. Mean.io has the capabilities to set admin users already.
- Implement tests. Although testing is currently implemented only very basic tests have been implemented.
- Move certain logic out of 'articles' folder. This folder holds a lot of excess logic that ideally would be placed elsewhere. I.e. messages functionality moved to a new 'messages' folder.
- Styling improvements.
- Optimizations. Currently there are a significant number of angular watchers on each profile page that could potentially be removed.