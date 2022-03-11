# SprintCompass -server

## Project APIs

 1. [Get all projects](#get-all-projects)
 2. [Get project by id](#get-project-by-id)
 3. [Post project](#post-a-project)
 4. [Update a project's name, description/startDate](#update-a-project-by-id)
 5. [Delete a project](#delete-a-project-by-id)

### Get All Projects
---
  Returns json data about all projects

* **URL**

  /project

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   None 

* **Data Params**

  `name=[string], description = [string], startDate = [string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** ```{
  "projects": [
    {
      "_id": "622aad4cefbf2d55aac06a4f",
      "name": "Testproject_one",
      "description": "This is a test project",
      "startDate": "2022-03-10",
      "owner": null,
      "lists": [],
      "users": []
    },
    {
      "_id": "622ab1aeefbf2d55aac06a50",
      "name": "Project test 2",
      "description": "This is another test project",
      "startDate": "2022-03-22",
      "owner": null,
      "lists": [],
      "users": []
    }
  ]
}```
 
* **Error Response:**



  * **Code:** 500 SERVER ERROR <br />
    **Content:** `{
  "msg": "get all projects failed - internal server error"
}`

* **Sample Call:**


```javascript
fetch('https://localhost:3000/project', {
  method: "GET"
})
.then(response => response.json()) 
.then(json => console.log(json));
.catch(err => console.log(err));
```


### Get project by id
---

  Returns json data for a project by id

* **URL**

  /project/:id

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** ```{
  "project": {
    "_id": "622aad4cefbf2d55aac06a4f",
    "name": "Testproject_one",
    "description": "This is a test project",
    "startDate": "2022-03-10",
    "owner": null,
    "lists": [],
    "users": []
  }
}```
 
* **Error Response:**

  * **Code:** 404 NOT FOUND<br />
    **Content:** `{
  "msg": "no project found with id"
}`

  OR

  * **Code:** 500 SERVER ERROR <br />
    **Content:** `{
  "msg": "get project failed - internal server error"
}`

* **Sample Call:**


```javascript
fetch('https://localhost:3000/project/622aad4cefbf2d55aac06a4f', {
  method: "GET"
})
.then(response => response.json()) 
.then(json => console.log(json));
.catch(err => console.log(err));
```

### Post a project
---

  Add a new project

* **URL**

  /project

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

  `name=[string], description=[string], startDate=[string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** ```{
  "msg": "document added to projects collection",
  "id": "622ab939efbf2d55aac06a51"
}```
 
* **Error Response:**

  * **Code:** 405 NOT ALLOWED <br />
    **Content:** `{
  "msg": "server received empty or invalid project data"
}`

  OR

  * **Code:** 500 SERVER ERROR <br />
    **Content:** `{
  "msg": "get project failed - internal server error"
}`

* **Sample Call:**
```javascript
// data to be sent to the POST request
let _data = {
  name: "Project test 3", 
  description : "this is another test project",
  startDate: "2022-03-22"
}

fetch('https://localhost:3000/project', {
  method: "POST",
  body: JSON.stringify(_data),
  headers: {"Content-type": "application/json; charset=UTF-8"}
})
.then(response => response.json()) 
.then(json => console.log(json));
.catch(err => console.log(err));
```

### Update a project by id
---

  Updates a project's name, description and start date.

* **URL**

  /project

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

  `id=[string], name = [string],description=[string], startDate=[string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** ```{
  "msg": "project Testproject_one was updated"
}```
 
* **Error Response:**

  * **Code:** 405 NOT ALLOWED <br />
    **Content:** `{
  "msg": "server received empty or invalid project data"
}`

  OR

  * **Code:** 500 SERVER ERROR <br />
    **Content:** `{
  "msg": "project update failed - internal server error"
}`

* **Sample Call:**
```javascript
// data to be sent to the PUT request
let _data = {
  id: "622aad4cefbf2d55aac06a4f",
  name: "Project test 3", 
  description : "this is another test project",
  startDate: "2022-03-22"
}

fetch('https://localhost:3000/project', {
  method: "PUT",
  body: JSON.stringify(_data),
  headers: {"Content-type": "application/json; charset=UTF-8"}
})
.then(response => response.json()) 
.then(json => console.log(json));
.catch(err => console.log(err));
```
### Delete a project by id
---

 Delete a project by id permanently from collection

* **URL**

  /project/:id

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**
 
   `id = [string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** ```{
  "msg": "project Testproject_put with id 622a7496222fd8ef5f9f5866 is deleted"
}```
 
* **Error Response:**

  * **Code:** 404 NOT FOUND<br />
    **Content:** `{
  "msg": "project with 622a7496222fd8ef5f9f5866 does not exist"
}`

  OR

  * **Code:** 500 SERVER ERROR <br />
    **Content:** `{
  "msg": "delete project failed - internal server error"
}`

* **Sample Call:**
```javascript
fetch('http://localhost:3000/project/622a7496222fd8ef5f9f5866', {
  method: "DELETE",
  headers: {"Content-type": "application/json; charset=UTF-8"}
})
.then(response => response.json()) 
.then(json => console.log(json));
.catch(err => console.log(err));
```