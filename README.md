# nestjs_crud_authentication_authorization
 
## A Simple NestJS CRUD RESTFull API with Authentication and Authorization with Passport and JWT
<hr>

### Getting Started
##### Clone the repo
##### Run `npm install`
##### Run `npx prisma migrate dev`
##### Run `npm run start:dev`

### Auth
#### SignUp `[POST] - 201`: `http://localhost:3000/signup`
- You can signUp as new user here, is a public route. Should Return a _accessToken and refreshToken_. Default admin role for users that are created in this route is false
```json
{
	"name": "John Mist",
	"email": "mist.john@gmail.com",
	"password": "1234"
}
- Return example {
	"access_token": "eyJhbGciOiJIUzI1N...",
	"refresh_token": "eyJhbGciOiJIUzI1NiIsI..."
}
```
#### SignIn `[POST] - 200`: `http://localhost:3000/signin`
- You can Login in your account here, is a public route. Should Return a _accessToken and refreshToken_
```json
{
	"email": "mist.john@gmail.com",
	"password": "1234"
}
```
#### Refresh-Token `[POST] - 200`: `http://localhost:3000/refresh`
- You can refresh accessToken here, _passing the refreshToken_ trough Header param as Bearer Token Authorization, 
is a route that requires refresh_token. Should Return a _accessToken and refreshToken_ and update user refresh token hash
```Bearer eyJhbGciOiJIUzI1NiIsI...
```

#### Logout `[POST] - 200`: `http://localhost:3000/logout`
- You can logout here, _passing the accessToken_ trough Header param as Bearer Token Authorization, 
is a route that requires refresh_token. Should Return a _accessToken and refreshToken_ and update user refresh token hash
```Bearer eyJhbGciOiJIUzI1N......
```

### User

##### To create Admin user run `npx migrate studio`, will open a page in browser `http://localhost:5555/`, access Model `User` and create an admin user from root with default Admin as `true`
#### Profile `[GET] - 200`: `http://localhost:3000/user/me`
- Authenticated route to see user profile, _passing the accessToken_ trough Header param as Bearer Token Authorization. Should return User Profile Info
```json 
{
	"id": "c02868f1-4b15-444e-ad26-d280725fccf8",
	"email": "mecl.ely@gmail.com",
	"name": "Misael Lopes",
	"admin": true,
	"created_at": "2022-11-21T14:37:29.988Z",
	"updated_at": "2022-11-29T15:24:24.301Z"
    }
```

### Books
#### Create `[POST] - 201`: `http://localhost:3000/books`
- To create a new book, you must be logged in as administrator
```json 
{
	"title": "Domain Driven Design (DDD)",
	"description": "A book about best approach on how to get right in development with business domain",
	"bar_code": "197382645"
}
```

#### Update `[PUT] - 200`: `http://localhost:3000/books/:id`
- To update book information, you must be logged in as administrator. Add book ID as Route Param, and Body:
```json 
{
	"title": "Domain Driven Design (DDD)",
	"description": "A book about best approach on how to get right in development with business domain",
	"bar_code": "197382645"
}
```

#### Delete `[DELETE] - 200`: `http://localhost:3000/books/:id`
- To delete a book, you must be logged in as administrator. Simply pass the Book ID as route param

#### List All Books `[GET] - 200`: `http://localhost:3000/books`
- To list all books, you must be logged in as any role user, must return and array like:
```json 
	[
	{
		"id": "0b7fe927-d60e-473e-9808-1077a40b9c0f",
		"title": "Domain Driven Design (DDD)",
		"description": "A book about best approuch on how to get right in development with business domain",
		"bar_code": "197382645",
		"created_at": "2022-11-29T14:47:43.563Z",
		"updated_at": "2022-11-29T14:47:43.563Z"
	},
	{
		"id": "5d4d1e82-02a7-46c7-9922-40d9f1eb9b61",
		"title": "Clean Code",
		"description": "A Handbook of Agile Software Craftsmanship",
		"bar_code": "1894565359",
		"created_at": "2022-11-29T16:25:03.089Z",
		"updated_at": "2022-11-29T16:25:03.089Z"
	}
]
```
