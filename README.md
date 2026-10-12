# TripNest ✦

TripNest is a polished, responsive travel-booking interface concept. It lets visitors explore eight destinations, save favourites in their browser, preview sample flight/train/bus fares, and create a pretend boarding pass.

> **Demo only:** schedules, prices and passes are illustrative. The site does not connect to travel inventory, process payments, create accounts, or issue valid tickets.

## Features

- Destination photography stored locally in \`assets/\`, with descriptive alt text and lazy loading
- Searchable destination cards with category filters and browser-local saved places
- Responsive travel search for flights, trains and buses
- A moving hero scene with animated flight, train and bus routes
- Sample departure cards and a demo boarding-pass flow
- Accessible labels, keyboard focus styles, reduced-motion support, and light/dark system themes
- No framework, package manager, or build step required

## Run locally

Open \`index.html\` in a browser, or serve the folder with any static web server:

\`\`\`sh
python3 -m http.server 8000
\`\`\`

Then visit \`http://localhost:8000\`.

## Deploy

The project is a static site. GitHub Pages is configured to publish the \`main\` branch root. Push changes to \`main\`; Pages will publish the updated site automatically.

## Photography

Destination photos are from [Unsplash](https://unsplash.com), included in the repository so the cards load without a runtime image service.

## Tech

HTML, CSS and vanilla JavaScript.

