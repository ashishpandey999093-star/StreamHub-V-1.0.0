# StreamHub

StreamHub is a YouTube-style video platform built with React and Vite, an Express REST API, MongoDB, and Cloudinary. It started as a backend learning project inspired by Chai aur Code.

[Hosted frontend](https://stream-hub-v-1-0-0.vercel.app)

## Features

- Browse and search published videos, then watch them in the browser.
- Create an account with an avatar, sign in, and manage watch history.
- Like videos, post comments, and subscribe to channels.
- Switch between four interface themes.
- Use the API to upload and publish videos, manage playlists and text posts, and retrieve channel statistics.

## Run locally

You’ll need Git, Node.js 24 with npm, a local MongoDB instance or MongoDB Atlas connection, and Cloudinary credentials for media uploads.

### 1. Clone the repository and install dependencies

```sh
git clone https://github.com/ashishpandey999093-star/StreamHub-V-1.0.0.git
cd StreamHub-V-1.0.0
npm ci
npm --prefix client ci
```

### 2. Configure the backend

Create a `.env` file in the repository root. Replace the JWT and Cloudinary placeholders with your own values.

```dotenv
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
ACCESS_TOKEN_SECRET=replace_with_a_long_random_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=replace_with_a_different_long_random_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

- `PORT=8000` matches the [Vite development proxy](client/vite.config.js).
- Give `MONGODB_URI` a connection URI without a database name, trailing slash, or query string. The backend appends `/youtube-clone`.
- Leave the frontend API base at its default `/api/v1` for local development. Set `VITE_API_BASE_URL` in `client/.env` to a full API base URL if the frontend needs to call a separately hosted backend. For cross-origin requests, include the frontend’s origin in `CORS_ORIGIN`.

### 3. Start both servers

From the repository root, start the backend in one terminal and the frontend in another.

```sh
npm run dev
```

```sh
npm --prefix client run dev
```

Open [http://localhost:5173](http://localhost:5173). Once MongoDB connects and the API starts, [the health endpoint](http://127.0.0.1:8000/api/v1/healthcheck) should return HTTP `200`.

## Add your first video

1. Register in the web app with an avatar, then sign in. API clients can also call `POST /api/v1/users/login` and read `data.accessToken` from the JSON response.
2. Send an authenticated `POST /api/v1/videos` request as `multipart/form-data` with `title`, `description`, `videoFile`, and `thumbnail`. Use `Authorization: Bearer <accessToken>` for API requests.
3. Copy `data._id` from the upload response. Videos start unpublished. Send an authenticated `POST /api/v1/videos/changeisPublish/<videoId>` as the video owner to publish it, then reload the home page.

## Project structure

| Path | Contents |
| --- | --- |
| [`client/`](client/) | React pages, browser routes, and the Axios client |
| [`src/routes/`](src/routes/) | Express routes mounted under `/api/v1` |
| [`src/controllers/`](src/controllers/) | Request handlers for accounts, videos, and other features |
| [`src/models/`](src/models/) | Mongoose schemas |
| [`src/utils/cloudinary.js`](src/utils/cloudinary.js) | Cloudinary media upload and deletion |

Run `npm --prefix client run lint` to lint the frontend, `npm --prefix client run build` to create `client/dist/`, or `npm start` to run the backend without Nodemon.
