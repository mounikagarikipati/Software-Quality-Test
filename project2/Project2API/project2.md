# Project 2 – Integration Testing with Postman

## Introduction

This project focuses on understanding integration testing using APIs and Postman. The goal of this assignment is to explore how different components of a system communicate with each other through HTTP requests and responses. In this project, a Triangle API was developed using Python and Flask to simulate a real-world backend service. Postman was used to send requests to the API and validate the responses.

The project also demonstrates how different HTTP methods such as GET, POST, and DELETE are used to interact with API endpoints. Error handling and edge cases were tested to ensure the robustness of the system. Additionally, curl commands were used to perform API testing from the terminal as part of extra credit.



## Part 1: Research on APIs and Integration Testing

### HTTP Functionality

HTTP (HyperText Transfer Protocol) is the foundation of communication between clients and servers on the web.

* **Client:** A client is a system that sends requests to a server. Examples include web browsers and Postman.
* **Server:** A server receives requests and sends responses back to the client.
* **Request:** A request is sent by the client and includes a method (GET, POST, etc.), headers, and sometimes a body.
* **Response:** A response is sent by the server and contains status codes, headers, and data.
* **Headers vs Body:** Headers contain metadata (such as content type), while the body contains actual data.
* **Status Codes:** Examples include 200 (success), 404 (not found), and 500 (server error).
* **HTTP Verbs:**

  * GET: Retrieve data
  * POST: Create data
  * PUT: Update data
  * DELETE: Remove data

### Stateless Nature of HTTP

HTTP is stateless, meaning each request is independent and the server does not remember previous requests. Every request must contain all necessary information.

### Role of APIs in Modern Applications

APIs allow different software systems to communicate with each other. They are widely used in web and mobile applications.

**Open APIs** are publicly available APIs that developers can use to access data or services. For example, weather applications use APIs to fetch real-time weather data.

### Example of Open API Usage

A common example is a weather application that uses an Open API to retrieve current weather data for different locations. This allows developers to build applications without maintaining their own weather database.

### Cross-Origin Resource Sharing (CORS)

CORS is a security feature that allows or restricts requests from different origins. It ensures that only trusted sources can access resources on a server.

### API Security

APIs are secured using:

* API keys
* Authentication tokens (JWT)
* HTTPS encryption

To access a secure API, users must provide valid credentials such as tokens or keys.

### Public Open APIs

Some commonly used public APIs include:

* JSONPlaceholder
* OpenWeather API
* REST Countries API
* NASA API
* GitHub API



## Part 2: Postman Testing

### API Development

A Triangle API was developed using Python and Flask. The API accepts three side lengths and determines whether the triangle is valid and its type (Scalene, Isosceles, or Equilateral).

### Endpoints Used

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| GET    | /triangles      | Retrieve all triangles       |
| POST   | /triangles      | Create a new triangle        |
| GET    | /triangles/{id} | Retrieve a specific triangle |
| DELETE | /triangles/{id} | Delete a triangle            |

---

### Postman Setup

A collection named **"Triangle API Testing"** was created in Postman. An environment variable was defined:

* url = http://127.0.0.1:5000

All requests used `{{url}}` as the base URL.



### Example Requests and Responses

#### 1. GET Request (All Triangles)

**Request:**

```
GET {{url}}/triangles
```
![img.png](img.png)
**Response:**

```
[]
```


#### 2. POST Request (Create Triangle)

**Request Body:**

```json
{
  "a": 3,
  "b": 4,
  "c": 5
}
```

**Response:**

```json
{
  "id": 1,
  "a": 3,
  "b": 4,
  "c": 5,
  "type": "Scalene"
}
```

![img_1.png](img_1.png)

#### 3. GET Request by ID

```
GET {{url}}/triangles/1
```

![img_2.png](img_2.png)

#### 4. Error Case

```
GET {{url}}/triangles/2
```

**Response:**

```json
{
  "error": "Triangle not found"
}
```
![img_3.png](img_3.png)



### Data Persistence

The API stores data temporarily in memory. Data is not persisted after the server stops. When the application restarts, all stored triangles are lost.



### Screenshots
here are the screenshots for all cases:
#### Invalid Triangle

![img_4.png](img_4.png)

#### Zero case
![img_5.png](img_5.png)
#### Large values
![img_6.png](img_6.png)

#### Decimal values
![img_7.png](img_7.png)

## Extra Credit: curl Testing

### GET Request using curl

```bash
curl http://127.0.0.1:5000/triangles
```
![img_8.png](img_8.png)

### POST Request using curl

```bash
curl -X POST http://127.0.0.1:5000/triangles \
-H "Content-Type: application/json" \
-d '{"a":3,"b":4,"c":5}'
```
![img_9.png](img_9.png)
### Advantages of curl

* Lightweight and fast
* Can be used in scripts and automation
* Does not require a graphical interface



## Conclusion

This project provided hands-on experience with integration testing using APIs and Postman. It demonstrated how HTTP methods are used to interact with backend systems and how responses are validated. The use of Postman made it easier to test multiple scenarios, including successful and error cases.

Developing the Triangle API helped in understanding backend logic, while testing it reinforced the importance of verifying system behavior. Overall, this project enhanced knowledge of API development, integration testing, and debugging techniques.



## References

Fielding, R. T. (2000). Architectural styles and the design of network-based software architectures.

Postman. (2023). Postman API Platform. https://www.postman.com/

Flask Documentation. https://flask.palletsprojects.com/
