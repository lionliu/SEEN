# **SEEN-IoT API Documentation**

## **Access Points**
----
## **Devices**
----
## **Events**

### **Get All Events**

  Returns json data of all events.

* **URL**

  `/events`

* **Method:**

  `GET`

* **Success Response:**

    * **Content Example:** 
    ```javascript
    [
    {
        "_id": "5e6bc551ef06b904cdb9f483",
        "eventType": "Suspect",
        "targetAddrMac": "AA:55:26:77:CC:66",
        "timestamp": "2020-03-13T17:39:29.619Z",
        "__v": 0
    },
    {
        "_id": "5e6bc58cef06b904cdb9f484",
        "eventType": "Vulnerable",
        "targetAddrMac": "AA:66:20:77:AA:55",
        "timestamp": "2020-03-13T17:40:28.289Z",
        "__v": 0
    }
    ]
    ```
 
* **Error Response:**

  * **Code:** 400
    **Content:** `{ msg: 'Events not found' }`

* **Sample Call with Axios:**

  ```javascript
    axios.get('https://localhost:5000/events')
    .then(data => console.log(data))
    .catch(err => console.log(err))
  ```

### **Post New Event**

  Post a new event.

* **URL**

  `/events`

* **Method:**

  `POST`

* **Success Response:**

    * **Content Example:** 
    ```javascript
    {
        "_id": "5e6f9e2f62d4eb08ce9435bc",
        "eventType": "Vulnerable",
        "targetAddrMac": "AA:66:20:77:AA:55",
        "timestamp": "2020-03-16T15:41:35.941Z",
        "__v": 0
    }
    ```
 
* **Error Response:**

  * **Code:** 400
    **Content:** `{ msg: 'Something went wrong. Probably you need to fill all the necessary fields or eventType is wrong' }`

* **Sample Call with Axios:**

  ```javascript
    axios.post('https://localhost:5000/events',{
        "eventType": "Vulnerable",
        "targetAddrMac": "AA:66:20:77:AA:55"
    })
    .then(data => console.log(data))
    .catch(err => console.log(err))
  ```

### **Delete All Events**

  Delete data of all events.

* **URL**

  `/events`

* **Method:**

  `DELETE`

* **Success Response:**

    * **Content:** 
    ```javascript
    {
        "msg": "Deleted all events"
    }
    ```
 
* **Sample Call with Axios:**

  ```javascript
    axios.delete('https://localhost:5000/events')
    .then(data => console.log(data))
    .catch(err => console.log(err))
  ```