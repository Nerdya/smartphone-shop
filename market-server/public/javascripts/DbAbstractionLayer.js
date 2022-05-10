var mongodb = require('mongodb');

var connected = false;
var db = null;

mongodb.MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }).then(connection => {
    connected = true;
    db = connection.db('market');
    console.log("DB Conection successful");
}).catch(error => {
    console.log("Error in connecting to DB");
});

async function queryDealsCollection() {
    if (connected) {

        let jsonResponse = {
            "handsetCards": [],
            "webCards": []
        };

        const dealsCollectionArray = await db.collection('DEALS').find().toArray();

        dealsCollectionArray.forEach(element => {
            let handsetElement = {}
            handsetElement['imageName'] = element['imageName'];
            handsetElement['title'] = element['title'];
            handsetElement['rows'] = element['handsetRows'];
            handsetElement['cols'] = element['handsetCols'];
            jsonResponse.handsetCards.push(handsetElement);

            let webElement = {};
            webElement['imageName'] = element['imageName'];
            webElement['title'] = element['title'];
            webElement['rows'] = element['webRows'];
            webElement['cols'] = element['webCols'];
            jsonResponse.webCards.push(webElement);
        });

        return jsonResponse;

    } else {
        return null;
    }
}

async function queryPhonesCollection() {
    if (connected) {

        let jsonResponse = {
            "status": true,
            "data": []
        };

        const phonesCollectionArray = await db.collection('PHONES').find().toArray();

        phonesCollectionArray.forEach(res => {
            let item = {}
            item['_id'] = res['_id'];
            item['imageName'] = res['imageName'];
            item['name'] = res['name'];
            item['original_price'] = res['original_price'];
            item['current_price'] = res['current_price']
            jsonResponse.data.push(item);
        });

        return jsonResponse;

    } else {
        return null;
    }
}

module.exports = { queryPhonesCollection, queryDealsCollection };