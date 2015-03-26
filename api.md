#TreeBook API

##TREE DATA
<pre>
/articles               GET  (PG) get some Tree Data for 250 trees
/articles/:treeId       GET  (PG) gets a tree data by ID
/treeimage/:treeId      GET  (PG) gets tree imgurl by ID

/articles/new           POST (PG) adds a new tree to the database
</pre>

##MESSAGES (Trees/Users)
<pre>
/usermessages           POST (PG) inserts a message made by a user
/usermessages/:userId   GET  (PG) gets all messages made by a user

/treemessages           POST (PG) inserts a message made by a tree (bot)
/treemessages/:treeId   GET  (PG) gets all messages made by a tree
</pre>

##USER DATA
<pre>

/user/:username         GET  (mongo) fetch a user's information based on username
/userimage              POST (mongo) upsert user imageurl in db
/userimage/*            GET  (mongo) fetch user's profile imgurl

Note: Actual profile picture is stored in AzureCDN
</pre>

##LIKES
<pre>
/treelike               POST (PG) inserts into likes table a userid/treeid
/treelikes              POST (PG) queries DB for params given, 
                                    returns list of users which like a tree
/userlikes              POST (PG) queries DB for params given,
                                    returns list of trees a user likes
</pre>

##Search
<pre>
/searchbyloc            GET (PG) gets a list of trees near a given coordinate
/searchbyname/:search   GET (PG) gets a list of 250 trees that match the query
</pre>


##Example Request Control Flow
User gets tree page by id

1. articles/controllers
  * TreesController.js > findOne

2. articles/services
  * articles.js['TreeData'] > ['Trees'] > getTree 
  * automatically passes id of tree to method
  * get request for article/:treeID

3. server/routes
  * articles.js > hits articles/:treeID resource

4. server/controllers
  * articles.js > hits getTreeData
  * connects to pg. and selects name, id, species.. etc
