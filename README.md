# YouTube Comment Scraper

A React and Node.js application to scrape YouTube comments and their replies, with a focus on comments mentioning a specific word.

## Introduction

This project came to my mind because, every time there was a background song in a YouTube video or short, I had to go to the comments to see if someone mentioned the original song. This tool makes it easier to find that song or any other specific words in the comments just using the video URL.

## Features

- Fetch comments from a YouTube video.
- Search for comments mentioning a specific word.
- Fetch and display replies to comments.
- Supports both regular YouTube videos and YouTube Shorts.

## Screenshots

![image](https://github.com/Himanshu-Lilhore/yt-comment-scraper/assets/63799853/b8dbbcda-6f8d-47d1-9a1b-b52558423d21)

## Demo

You can check out the live demo [here](https://yt-comment-scraper.vercel.app/).

## Getting Started

### Prerequisites

- Node.js installed
- React knowledge
- A YouTube Data API key

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Himanshu-Lilhore/yt-comment-scraper
   cd yt-comment-scraper
   ```

2. Install backend dependencies:

   ```sh
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```sh
   cd ../frontend
   npm install
   ```

4. Set up your YouTube Data API key:

   - Create a `.env` file in the `backend` directory and add your YouTube Data API key:

     ```sh
     API_KEY=your_api_key_here
     ```

### Usage

1. Start the backend:

   ```sh
   cd backend
   npm start
   ```

2. Start the frontend:

   ```sh
   cd ../frontend
   npm start
   ```

3. Open your browser and go to `http://localhost:3000`.

### Deployment

To deploy the app to Vercel:

1. Install the Vercel CLI if you haven't already:

   ```sh
   npm install -g vercel
   ```

2. Deploy the backend:

   ```sh
   cd backend
   vercel
   ```

3. Deploy the frontend:

   ```sh
   cd ../frontend
   vercel
   ```

## Project Structure

- `backend/`: The backend Node.js code.
- `frontend/`: The frontend React code.

## Contributing

1. Fork the repository.
2. Create a new branch:

   ```sh
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```sh
   git commit -m 'Add some feature'
   ```

4. Push to the branch:

   ```sh
   git push origin feature/your-feature-name
   ```

5. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

Email - [himanshulilhore@gmail.com](mailto:himanshulilhore@gmail.com)

X - [x.com/HimanshuLilhore](https://x.com/HimanshuLilhore)
