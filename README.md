# LaunchQuery
A lightning-fast search tool that lets you quickly search multiple websites using bang commands (!). Type your query with a shortcut anywhere in the text to instantly search specific sites. Inspired heavily by DuckDuckGo but with better performance and being able to use any core search engine you would like.

### Features
- **Bang Shortcuts:** Use commands like !w, !g, or !yt to search Wikipedia, Google, or YouTube
- **Flexible Syntax:** Bang commands can be placed anywhere in your search query
- **Customizable:** Change your default search engine
- **Fast Performance:** Bangs data is cached locally for improved speed

### How It Works
LaunchQuery allows you to include special commands in your search queries:

- `python tutorial !yt` → Search YouTube for "python tutorial"
- `!w artificial intelligence` → Search Wikipedia for "artificial intelligence"
- `best coffee shops !maps` → Search Maps for "best coffee shops"

### Installation
Clone the repository:
```
git clone https://github.com/yourusername/search-redirector.git
cd search-redirector
```
Install dependencies:
```
npm install
```

Run the development server:
```
npm run dev
```

Access in your browser at `http://localhost:5173`

### Deployment
The project can be built for production using:
```
npm run build
```
Deploy the contents of the dist directory to your web server.

### Technologies
- TypeScript
- HTML/CSS
- Local Storage API for caching
- Vite (for development and building)

### Setting as Default Search Engine
You can set LaunchQuery as your default search engine to use it directly from your browser's address bar:

#### Chrome / Edge / Brave
1. Visit your LaunchQuery site
2. Right-click in the search box and select "Add as search engine"
3. Alternatively, go to Settings → Search engines → Manage search engines → Add
4. Enter the following details:
    - Name: LaunchQuery
    - Keyword: launchquery (or your preferred shortcut)
    - URL: https://launchquery.vercel.app/.com/?s=%s (or your own custom domain)
5. Click "Add"
6. To make it default, find LaunchQuery in your search engines list, click the three dots, and select "Make default"
#### Firefox
1. Visit your LaunchQuery site
2. Right-click in the search bar and select "Add a Keyword for this Search"
3. Alternatively, go to Settings → Search → Search Shortcuts → Add
4. Enter a name and keyword
5. To make it default, go to Settings → Search and select LaunchQuery from the Default Search Engine dropdown
#### Safari
1. Go to Safari → Preferences → Search
2. If LaunchQuery isn't listed, you can use a browser extension like "Custom Search Engine" to add it