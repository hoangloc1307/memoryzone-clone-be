# API Document

## I. Authentication

### 1.1. Đăng nhập (Login)

Đăng nhập vào hệ thống để truy cập các tính năng của ứng dụng.

#### Endpoint

`POST /auth/login`

#### Request

##### Headers

| Key            | Value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |

##### Body

```json
{
  "email": "test@memoryclone.com",
  "password": "123456"
}
```

| Name        | Type     | Description              |
| ----------- | -------- | ------------------------ |
| `email*`    | `String` | Email của người dùng.    |
| `password*` | `String` | Mật khẩu của người dùng. |

#### Response

##### Success

`200 OK`

```json
{
  "status": "Success",
  "message": "Login thành công",
  "data": {
    "id": "clhoaw8h40005mwlojaem6bja",
    "role": "USER",
    "name": "Test User",
    "avatar": null,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsaG9hdzhoNDAwMDVtd2xvamFlbTZiamEiLCJyb2xlIjoiVVNFUiIsIm5hbWUiOiJUZXN0IFVzZXIiLCJhdmF0YXIiOm51bGwsImlhdCI6MTY4NDEyMzEyMiwiZXhwIjoxNjg0MTI0OTIyfQ.C3mciInxMNFiHwoyfjskmrVIGrIgtTdKb9qpVmAIbmE",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsaG9hdzhoNDAwMDVtd2xvamFlbTZiamEiLCJyb2xlIjoiVVNFUiIsIm5hbWUiOiJUZXN0IFVzZXIiLCJhdmF0YXIiOm51bGwsImlhdCI6MTY4NDEyMzEyMiwiZXhwIjoxNjg0MjA5NTIyfQ.NQUue7j3t65arlP1nHiFNH-clJ9UYYCJGj9R3pJgOJA"
  }
}
```

| Name           | Type                  | Description                                                                                          |
| -------------- | --------------------- | ---------------------------------------------------------------------------------------------------- |
| `id`           | `String`              | Id của user.                                                                                         |
| `role`         | `'USER'` \| `'ADMIN'` | Quyền của user.                                                                                      |
| `name`         | `String`              | Tên user.                                                                                            |
| `avatar`       | `String`              | Avatar user.                                                                                         |
| `accessToken`  | `String`              | Access token được mã hóa JWT (JSON Web Token) sẽ được sử dụng để xác thực các yêu cầu API tiếp theo. |
| `refreshToken` | `String`              | Refresh token được mã hóa JWT sẽ được sử dụng để đăng nhập lại nếu `access token` hết hạn.           |

##### Error

| Code  | Description                                                |
| ----- | ---------------------------------------------------------- |
| `400` | Email không đúng định dạng, mật khẩu không đúng định dạng. |
| `401` | Email không tồn tại, sai mật khẩu, tài khoản đang bị khoá. |

**Ví dụ**

- `400`

```json
{
  "status": "Error",
  "name": "PAYLOAD_ERROR",
  "message": "Lỗi",
  "data": {
    "email": "Email không đúng định dạng",
    "password": "Mật khẩu phải từ 6-32 kí tự"
  }
}
```

- `401`

```json
{
  "status": "Error",
  "name": "INCORRECT_PASSWORD",
  "message": "Sai mật khẩu"
}
```

### 1.2. Đăng ký (Register)

Đăng ký tài khoản để đăng nhập vào ứng dụng.

#### Endpoint

`POST /auth/register`

#### Request

##### Headers

| Key            | Value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |

##### Body

```json
{
  "name": "Test User",
  "email": "test@memoryclone.com",
  "password": "123456"
}
```

| Name        | Type     | Description              |
| ----------- | -------- | ------------------------ |
| `name*`     | `String` | Tên của người dùng.      |
| `email*`    | `String` | Email của người dùng.    |
| `password*` | `String` | Mật khẩu của người dùng. |

#### Response

##### Success

`201 Created`

```json
{
  "status": "Success",
  "message": "Đăng ký thành công"
}
```

##### Error

| Code  | Description                                                                  |
| ----- | ---------------------------------------------------------------------------- |
| `400` | Email không đúng định dạng, mật khẩu không đúng định dạng, email đã tồn tại. |

**Ví dụ**

- `400`

```json
{
  "status": "Error",
  "name": "EMAIL_ALREADY_EXISTS",
  "message": "Lỗi",
  "data": {
    "email": "Email đã được đăng ký trước đó"
  }
}
```

### 1.3. Refresh token

Làm mới access token khi hết hạn.

#### Endpoint

`PATCH /auth/refresh-token`

#### Request

##### Headers

| Key            | Value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |

##### Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsaG9hdzhoNDAwMDVtd2xvamFlbTZiamEiLCJyb2xlIjoiVVNFUiIsIm5hbWUiOiJUZXN0IFVzZXIiLCJhdmF0YXIiOm51bGwsImlhdCI6MTY4NDEyMzEyMiwiZXhwIjoxNjg0MjA5NTIyfQ.NQUue7j3t65arlP1nHiFNH-clJ9UYYCJGj9R3pJgOJA"
}
```

| Name            | Type     | Description                            |
| --------------- | -------- | -------------------------------------- |
| `refreshToken*` | `String` | Refresh token nhận được sau khi login. |

#### Response

##### Success

`200 OK`

```json
{
  "status": "Success",
  "message": "Refresh token thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsaG9hdzhoNDAwMDVtd2xvamFlbTZiamEiLCJyb2xlIjoiVVNFUiIsIm5hbWUiOiJUZXN0IFVzZXIiLCJhdmF0YXIiOm51bGwsImlhdCI6MTY4NDEzMDQzOSwiZXhwIjoxNjg0MTMyMjM5fQ.gyZ_sOlzf9v81cxNRCAU55fd2fCYcd4CoE1D84owJdg",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsaG9hdzhoNDAwMDVtd2xvamFlbTZiamEiLCJyb2xlIjoiVVNFUiIsIm5hbWUiOiJUZXN0IFVzZXIiLCJhdmF0YXIiOm51bGwsImlhdCI6MTY4NDEzMDQzOSwiZXhwIjoxNjg0MjE2ODM5fQ.fRLOajZj-ENNvoW_MSakbGRJA72nZxYFbIkmtWEEOwk"
  }
}
```

| Name           | Type     | Description                                                                                          |
| -------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `accessToken`  | `String` | Access token được mã hóa JWT (JSON Web Token) sẽ được sử dụng để xác thực các yêu cầu API tiếp theo. |
| `refreshToken` | `String` | Refresh token được mã hóa JWT sẽ được sử dụng để đăng nhập lại nếu `accessToken` hết hạn.            |

##### Error

| Code  | Description                                            |
| ----- | ------------------------------------------------------ |
| `400` | Refresh token chưa được gửi.                           |
| `401` | Refresh token không tồn tại, refresh token không đúng. |

**Ví dụ**

- `400`

```json
{
  "status": "Error",
  "name": "EMAIL_ALREADY_EXISTS",
  "message": "Lỗi",
  "data": {
    "email": "Email đã được đăng ký trước đó"
  }
}
```

- `401`

```json
{
  "status": "Error",
  "name": "TOKEN_ERROR",
  "message": "Token không đúng"
}
```

### 1.4. Đăng xuất (Logout)

Đăng xuất khỏi ứng dụng.

#### Endpoint

`DELETE /auth/logout`

#### Request

##### Headers

| Key             | Value                    |
| --------------- | ------------------------ |
| `Authorization` | `Bearer {{accessToken}}` |

#### Response

##### Success

`200 OK`

```json
{
  "status": "Success",
  "message": "Đăng xuất thành công"
}
```

##### Error

| Code  | Description                                                  |
| ----- | ------------------------------------------------------------ |
| `400` | Access token chưa được gửi.                                  |
| `401` | Token không đúng, token hết hạn, access token không tồn tại. |

**Ví dụ**

- `400`

```json
{
  "status": "Error",
  "name": "ACCESS_TOKEN_HAS_NOT_BEEN_SENT",
  "message": "Access token chưa được gửi"
}
```

- `401`

```json
{
  "status": "Error",
  "name": "TOKEN_ERROR",
  "message": "Token không đúng"
}
```

## II. Category

### 2.1. Lấy tất cả danh mục (Get all categories)

Lấy toàn bộ danh mục sản phẩm.

#### Endpoint

`GET /category`

#### Response

##### Success

`200 OK`

```json
{
  "status": "Success",
  "message": "Lấy danh mục thành công",
  "data": [
    {
      "id": 1,
      "name": "Chuột - Bàn phím - Tai nghe",
      "order": 1,
      "parentId": 0
    },
    {
      "id": 2,
      "name": "Thương hiệu chuột",
      "order": 1,
      "parentId": 1
    },
    {
      "id": 6,
      "name": "Logitech",
      "order": 1,
      "parentId": 2
    }
  ]
}
```

| Name       | Type     | Description                           |
| ---------- | -------- | ------------------------------------- |
| `id`       | `Number` | Id danh mục.                          |
| `name`     | `String` | Tên danh mục.                         |
| `order`    | `Number` | Thứ tự sắp xếp danh mục khi cùng cấp. |
| `parentId` | `Number` | Id danh mục cha.                      |

### 2.2. Thêm danh mục (Add category)

Thêm danh mục.

#### Endpoint

`POST /category` **`ADMIN`**

#### Request

##### Headers

| Key             | Value                    |
| --------------- | ------------------------ |
| `Content-Type`  | `application/json`       |
| `Authorization` | `Bearer {{accessToken}}` |

##### Body

```json
{
  "name": "Test",
  "parentId": 0,
  "order": 0
}
```

| Name       | Type     | Description                           |
| ---------- | -------- | ------------------------------------- |
| `name*`    | `String` | Tên danh mục.                         |
| `parentId` | `Number` | Id danh mục cha.                      |
| `order`    | `Number` | Thứ tự sắp xếp các danh mục cùng cấp. |

#### Response

##### Success

`201 Created`

```json
{
  "status": "Success",
  "message": "Thêm danh mục thành công"
}
```

### 2.3. Cập nhật danh mục (Update category)

Cập nhật danh mục.

#### Endpoint

`PATCH /category/:id` **`ADMIN`**

#### Request

##### Headers

| Key             | Value                    |
| --------------- | ------------------------ |
| `Content-Type`  | `application/json`       |
| `Authorization` | `Bearer {{accessToken}}` |

##### Body

```json
{
  "name": "Test 2",
  "parentId": 0,
  "order": 1
}
```

| Name       | Type     | Description                           |
| ---------- | -------- | ------------------------------------- |
| `name`     | `String` | Tên danh mục.                         |
| `parentId` | `Number` | Id danh mục cha.                      |
| `order`    | `Number` | Thứ tự sắp xếp các danh mục cùng cấp. |

#### Response

##### Success

`200 OK`

```json
{
  "status": "Success",
  "message": "Cập nhật danh mục thành công"
}
```

### 2.4. Xoá danh mục (Delete category)

Xoá danh mục.

#### Endpoint

`DELETE /category/:id` **`ADMIN`**

#### Request

##### Headers

| Key             | Value                    |
| --------------- | ------------------------ |
| `Authorization` | `Bearer {{accessToken}}` |

#### Response

##### Success

`200 OK`

```json
{
  "status": "Success",
  "message": "Xoá danh mục thành công"
}
```

##### Error

| Code  | Description                                                  |
| ----- | ------------------------------------------------------------ |
| `400` | Access token chưa được gửi.                                  |
| `401` | Token không đúng, token hết hạn, access token không tồn tại. |

**Ví dụ**

- `400`

```json
{
  "status": "Error",
  "name": "ACCESS_TOKEN_HAS_NOT_BEEN_SENT",
  "message": "Access token chưa được gửi"
}
```

- `401`

```json
{
  "status": "Error",
  "name": "TOKEN_ERROR",
  "message": "Token không đúng"
}
```

## III. Type

### 3.1. Lấy loại sản phẩm (Get all type)

Lấy danh sách toàn bộ loại sản phẩm.

#### Endpoint

`GET /type`

#### Response

##### Success

`200 OK`

```json
{
  "status": "Success",
  "message": "Lấy loại sản phẩm thành công",
  "data": [
    {
      "id": 1,
      "name": "Laptop"
    },
    {
      "id": 2,
      "name": "PC"
    },
    {
      "id": 3,
      "name": "Chuột"
    }
  ]
}
```

| Name   | Type     | Description        |
| ------ | -------- | ------------------ |
| `id`   | `Number` | Id loại sản phẩm.  |
| `name` | `String` | Tên loại sản phẩm. |

### 3.2. Thêm loại sản phẩm (Add type)

Thêm loại sản phẩm.

#### Endpoint

`POST /type` **`ADMIN`**

#### Request

##### Headers

| Key             | Value                    |
| --------------- | ------------------------ |
| `Content-Type	`  | `application/json`       |
| `Authorization` | `Bearer {{accessToken}}` |

##### Body

```json
{
  "type": "Test"
}
```

| Name    | Type     | Description        |
| ------- | -------- | ------------------ |
| `type*` | `String` | Tên loại sản phẩm. |

#### Response

##### Success

`201 Created`

```json
{
  "status": "Success",
  "message": "Thêm loại sản phẩm thành công"
}
```

##### Error

| Code  | Description                                                  |
| ----- | ------------------------------------------------------------ |
| `400` | Access token chưa được gửi, loại sản phẩm đã tồn tại.        |
| `401` | Token không đúng, token hết hạn, access token không tồn tại. |

**Ví dụ**

- `400`

```json
{
  "status": "Error",
  "name": "TYPE_ALREADY_EXISTS",
  "message": "Loại sản phẩm đã tồn tại"
}
```

- `401`

```json
{
  "status": "Error",
  "name": "TOKEN_ERROR",
  "message": "Token không đúng"
}
```

### 3.2. Cập nhật loại sản phẩm (Update type)

Cập nhật loại sản phẩm.

#### Endpoint

`PATCH /type/:id` **`ADMIN`**

#### Request

##### Headers

| Key             | Value                    |
| --------------- | ------------------------ |
| `Content-Type`  | `application/json`       |
| `Authorization` | `Bearer {{accessToken}}` |

##### Body

```json
{
  "type": "Test 2",
  "attributes": ["Test"]
}
```

| Name         | Type       | Description                                     |
| ------------ | ---------- | ----------------------------------------------- |
| `type`       | `String`   | Tên loại sản phẩm.                              |
| `attributes` | `String[]` | Danh sách các thuộc tính gán cho loại sản phẩm. |

#### Response

##### Success

`200 OK`

```json
{
  "status": "Success",
  "message": "Cập nhật loại sản phẩm thành công"
}
```

##### Error

| Code  | Description                                                  |
| ----- | ------------------------------------------------------------ |
| `400` | Access token chưa được gửi.                                  |
| `401` | Token không đúng, token hết hạn, access token không tồn tại. |

**Ví dụ**

- `400`

```json
{
  "status": "Error",
  "name": "PAYLOAD_ERROR",
  "message": "Lỗi",
  "data": {
    "attributes": "Phải là mảng"
  }
}
```

- `401`

```json
{
  "status": "Error",
  "name": "TOKEN_ERROR",
  "message": "Token không đúng"
}
```

### 3.4. Xoá loại sản phẩm (Delete type)

Xoá loại sản phẩm.

#### Endpoint

`DELETE /type/:id` **`ADMIN`**

#### Request

##### Headers

| Key             | Value                    |
| --------------- | ------------------------ |
| `Authorization` | `Bearer {{accessToken}}` |

#### Response

##### Success

`200 OK`

```json
{
  "status": "Success",
  "message": "Xoá loại sản phẩm thành công"
}
```

##### Error

| Code  | Description                                                  |
| ----- | ------------------------------------------------------------ |
| `400` | Access token chưa được gửi.                                  |
| `401` | Token không đúng, token hết hạn, access token không tồn tại. |

**Ví dụ**

- `400`

```json
{
  "status": "Error",
  "name": "PAYLOAD_ERROR",
  "message": "Lỗi",
  "data": {
    "id": "Phải là số"
  }
}
```

- `401`

```json
{
  "status": "Error",
  "name": "TOKEN_ERROR",
  "message": "Token không đúng"
}
```
