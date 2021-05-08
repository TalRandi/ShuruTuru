const fs = require('fs');

const dataPath = './data/tours.json';

// helper methods
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                console.log(err);
            }
            if (!data) data="{}";
            callback(returnJson ? JSON.parse(data) : data);
       });
};
    
const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err)
                console.log(err);
            
            callback();
        });
};

function getTour(callback){

    fs.readFile(dataPath, 'utf8', (err, data) => {

        if (err)
            console.log(err);      

        else
            callback(data);  
    });     
}

function getTours(callback){

    fs.readFile(dataPath, 'utf8', (err, data) => {

        if (err)
            console.log(err);      

        else
            callback(data);  
    });     
}


module.exports = {
    //READ
    read_tour: (req, res) => {

        const userId = req.params["id"];
        if(userId == undefined){

            fs.readFile(dataPath, 'utf8', (err, data) => {
                
                if (err) {
                    console.log(err);
                    res.sendStatus(500);                 
                }
                else{
                    getTours(data =>{
                        let choice
                        let sortOrder
                        let js_data = JSON.parse(data);
                        let arr = [];
                        let new_data = {}; 

                        for (const key in req.query) {
                            choice = JSON.parse(key).choice
                            sortOrder = JSON.parse(key).sortOrder
                        }

                        for(var key in js_data){
                            if(js_data.hasOwnProperty(key))
                            {
                                if(choice == undefined || choice == 'Tour name')
                                    arr.push(key);
                                else if(choice == 'Start date')
                                    arr.push(js_data[key].start_date)
                                else if(choice == 'Duration')
                                    arr.push(js_data[key].duration)
                                else if(choice == 'Tour cost')
                                    arr.push(js_data[key].cost)
                            }
                        }

                        if(choice == 'Duration' || choice == 'Tour cost')
                            arr.sort((a,b) => a-b)
                        else
                            arr.sort();
                        
                        if(sortOrder)
                            arr.reverse()


                        for(let i = 0 ; i<arr.length ; i++)
                            for(var key in js_data)
                            {
                                if(js_data.hasOwnProperty(key))
                                {
                                    if(choice == undefined || choice == 'Tour name')
                                    {
                                        if(key == arr[i])
                                            new_data[key] = js_data[key];
                                    }
                                    else if(choice == 'Start date')
                                    {
                                        if(js_data[key].start_date == arr[i])
                                            new_data[key] = js_data[key];        
                                    }
                                    else if(choice == 'Duration')
                                    {
                                        if(js_data[key].duration == arr[i])
                                            new_data[key] = js_data[key];        
                                    }
                                    else if(choice == 'Tour cost')
                                    {
                                        if(js_data[key].cost == arr[i])
                                            new_data[key] = js_data[key];        
                                    }
                                }
                            }                
                        writeFile(JSON.stringify(new_data, null, 2), () => {
                            res.send(!data? JSON.parse("{}") :new_data);      
                        }); 
                        
                    });
                }

            });
        }
        else{

            getTour(data =>{

                let j_data = JSON.parse(data)

                if(j_data[userId] == undefined)
                    res.status(404).send('Tour does not exist')
                
                else  
                    res.send(j_data[userId]);
            })    
        }    
    },
    // CREATE
   create_tour: function (req, res) {

        readFile(data => {

            if (!req.body.tour_name) return res.sendStatus(500); 

            if (data[req.body.tour_name] == undefined || req.method == 'PUT')  
            {
                data[req.body.tour_name] = req.body;
                writeFile(JSON.stringify(data, null, 2), () => {
                    if(req.method == 'PUT')
                        res.status(200).send('Site added successfully'); 
                    else
                        res.status(200).send('new tour added');        
                });
            }
            else{
                res.status(400).send('Tour is already exist')
            }
        },
        true);
    },

    // UPDATE
    update_tour: function (req, res) {

        readFile(data => {

            const tourId = req.params["id"];
            
            if (data[tourId] && tourId == req.body.tour_name)
            {
                data[tourId].start_date = req.body.start_date;
                data[tourId].duration = req.body.duration;
                data[tourId].cost = req.body.cost;
                data[tourId]["guide"].name = req.body.guide.name;
                data[tourId]["guide"].email = req.body.guide.email;
                data[tourId]["guide"].phone  = req.body.guide.phone;
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send(`Tour id :${tourId} updated`);
                });
            }
            else res.status(400).send(`Tours: ${tourId} and ${req.body.tour_name} does not match or exist`);
            
        },
        true);
    },

    // DELETE tour
    delete_tour: function (req, res) {
        
        readFile(data => {
            
            // add the new user
            const userId = req.params["id"];
            
            if(!data[userId]){
                
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(404).send(`Tour id:${userId} does not exist`);
                });    
            }

            delete data[userId];
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(data);
            });
            
        },
        true);
    },
    // DELETE site
    delete_site: function (req, res) {
        
        readFile(data => {
            
            const userId = req.params["id"];
            const name = req.body.name;

            if(!data[userId])
                res.status(404).send(`Tour id: ${userId} not exist`);
   
            
            if(name == 'ALL' || name == '')
            {
                delete data[userId]["path"]
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send(`All: sites from: ${userId} removed`);
                });
            }
            else
            {    
                let deleted = false;
                if(data[userId]["path"] != undefined)
                {
                    for(i = 0 ; i < data[userId]["path"].length ; i++)
                    {
                        if(data[userId]["path"][i]["name"] == name)
                        {
                            delete data[userId]["path"].splice(i, 1);
                            deleted = true;
                            writeFile(JSON.stringify(data, null, 2), () => {
                                res.status(200).send(`Site ${name} from ${userId} removed`);
                            });
                            break;
                        }
                    }
                }
                if(!deleted)
                    res.status(400).send(`Site: ${name} from: ${userId} not exist`);
            }  
        },
        true);
    }
};