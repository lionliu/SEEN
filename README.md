# SEEN

SEEN (SEcurity Event Notice for IoT) is a graph based visualizer for an IoT network.

SEEN-IoT is available at: http://seen-iot.herokuapp.com/

## Getting Started


### Prerequisites

What you'll need:
1. Node.js
2. npm
3. MongoDB

## Running the back-end

1. Head to the back-end directory:
```
cd /SEEN-backend
```
2. Create a `.env` file:
```
touch .env
```
3. Paste the `uri` of your MongoDB database in the `.env` file:
```
DB_CONNECTION=mongodb://username:password@host:port/database?options...
```
4. Install the dependencies:
```
npm install
```
5. Start the server:
```
npm start
```

## Running the front-end

1. Head to the front-end directory:
```
cd /seen
```
2. Install the dependencies:
```
npm install
```
3. Start the front-end:
```
npm start
```


## Built With

* [React](https://www.reactjs.org/) - The web framework used
* [MongoDB](https://mongodb.com/) - No-SQL Database
* [D3](https://d3js.org/) - Data visualization library
