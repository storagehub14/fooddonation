//import express module
//require('express.js'), where the .js extension can be omitted, returns whatever is exported by that .js file. 
//If that .js file exports an object, require('.js') returns an object; if a function is exported, require('.js') returns a function; if a single string is exported, require('xxx.js') returns a string.
//express exports a single function
const express = require('express');

//invoking the function
//When you call express(), the function internally creates an instance of an Express application
//This application object serves as the foundation of your web application, providing methods and properties to handle HTTP requests and responses, define routes, apply middleware, and more.
//returns the application object 
const app = express();


//-----------------------------------------------------------------------------------------------------------------------------------------
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // Middleware to parse JSON bodies
//-----------------------------------------------------------------------------------------------------------------------------------------
const cors = require('cors');
app.use(cors());

//-----------------------------------------------------------------------------------------------------------------------------------------
const { MongoClient } = require('mongodb');
const url = "mongodb://localhost:27017";
const db_name = "users";
const collection_name = "users";
const client = new MongoClient(url);

async function db_users() {
    let result = await client.connect();
    let db = result.db(db_name);
    return db.collection(collection_name);
}
async function db_messages() {
    let result = await client.connect();
    let db = result.db("message");
    return db.collection("message");
}

//establishing connection to the "donations" database
async function con_donations() {

    //a promise is returned by the "client.connect()"
    //the promise that represents the result of establishing a connection with a client, such as a database server
    //the code execution of the async function stops until the promise is resolved(because of the await keyword)
    //but the event loop of the javascript runtime will continue processing other tasks
    //once resolved the result will have the value returned by the promise(the result is the connection object)
    let result = await client.connect();

    //calling the db function of the result object
    //referenceing a database named "donations".
    //"db_donations" now hold a reference to "donations" database
    let db_donations= result.db("donations");
    
    //returning a reference to "donations" collections of the "db_donations" database
    return db_donations.collection("donations");
}
//-----------------------------------------------------------------------------------------------------------------------------------------
//put the donations in the database
async function putdonationsindatabase(donation) {
    try {

        //getting the reference to "donations" collection of the "donations" database
        //here the "collection" is an object

        const collection = await con_donations();
         
        //inserting the donation object into the "donation" collection of the "donation" database 
        const result = await collection.insertOne(donation);

        // return the fetched objects
        return result;
    } catch (error) {
        console.error('Error fetching objects from the database:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

//fetch the donations from the database
async function fetchdonations(foodtype){
    try {
        
        //getting the reference to "donations" collection of the "donations" database
        //here "collection" is an object
        const collection = await con_donations();

        //serching the "Food_Name" attribute having the value of "foodtype" variable
        //The toArray() method is used to convert the results of a MongoDB query, represented as a cursor, into an array of documents.
        const result = await collection.find({Food_Name:foodtype}).toArray();

        //retruning the result
        return result;

    } catch (error) {
        console.error('Error fetching objects from the database:', error);
        throw error;
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------

//put the user in database
async function putuserindatabase(user) {

    try {
        
        //getting the reference to "user" collection of the "user" database
        //here the "collection" is an object
        const collection = await db_users();
        
        //inserting the donation object into the "user" collection of the "user" database 
        const result = await collection.insertOne(user);
        
        //retruning the result
        return result;
    } catch (error) {
        console.error('Error fetching objects from the database:', error);
        throw error;
    }
}

//fetch the user from the database
async function fetchuserFromDatabaseforlogin(name,password) {
    try {

        //getting the reference to "user" collection of the "user" database
        //here the "collection" is an object
        const collection = await db_users();

        //serching the "User_Name" and "Password" attribute having the value of "username" and "password" variable
        //The toArray() method is used to convert the results of a MongoDB query, represented as a cursor, into an array of documents.
        const result = await collection.find({UserName:name,Password:password}).toArray();
        console.log(result);
         
        // Return the fetched objects
        return result;

    } catch (error) {
        console.error('Error fetching objects from the database:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------------

   
app.post("/User", (req, res) => {

    //getting the attributes of the request body into the variables 
    const {userName,age,phoneNumber,email,password} = req.body;
   
    //constructing the user object 
    const user = {
        UserName: userName,
        Age:age,
        PhoneNumber:phoneNumber,
        Email:email,
        Password: password 
    };
    
    //calling the "putuserindatabase" function to put the user in database
    putuserindatabase(user);
    
    //telling that nothing is to be send anymore
    res.end();

    });


app.get("/GetUser", async (req, res) => {
    try {

       //getting the "username" and "password" attributes from the request body
        const {username,password} =req.query;

       //calling the "FetchUserFromDatabase" to fetch the user from database
        const objects = await fetchuserFromDatabaseforlogin(username,password);
        
        //sending a json response
        res.json(objects);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//-----------------------------------------------------------------------------------------------------------------------------------------

//request -> store the donations
app.post('/StoreDonations', (req, res) => {

    //retriving the attributes from the request body
    const {foodName,quantity, freshTime,location,phoneNumber,otherDetails} = req.body;
    
    //making them in an object named "donation"
    const donation={
        Food_Name:foodName,
        Quantity: quantity,
        Fresh_Time: freshTime,
        Location:location,
        Mobile_Number: phoneNumber,
        Other_Details: otherDetails
    }

    //calling the "putdonationsindatabase" function to put donation objecct in database
    putdonationsindatabase(donation)

    //sending a response 
    res.send('Data received successfully');
});


//fetching the details for a specific type of donation
app.get("/FetchDonations",async (req,res)=>{
    try {
        //extract a foodname query parameter from the request body
        const {foodname} =req.query;

        //call the fetchdonation function to fetch the donations
        const result = await fetchdonations(foodname);
        
        //sending the response object to the frontend 
        //the resonponse will be of json format
        res.json(result);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//-----------------------------------------------------------------------------------------------------------------------------------------

//defining the port
const PORT = 8888;

//listen for request at port number "PORT"
//and exectue a callback function
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
