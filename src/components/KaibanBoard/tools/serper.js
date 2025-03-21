import { Tool } from '@langchain/core/tools';
import { z } from 'zod';

/**
 * SerperTool extends the basic functionality of a search engine tool, you can sign up for get an API key at: https://serper.dev/
 * It supports various types of search queries depending on the specified type.
 * Available types include:
 *  - "search" (default): For general search queries.
 *  - "images": For image search.
 *  - "videos": For video search.
 *  - "places": For location-based search.
 *  - "maps": For map search.
 *  - "news": For news search.
 *  - "shopping": For shopping search.
 *  - "scholar": For academic publications search.
 *  - "patents": For patents search.
 *  - "webpage": For scraping webpages.
 *     !Note: The Scraper option is in Beta and may be subject to changes.
 *
 * The tool dynamically adjusts the request URL and body based on the specified type.
 */

export class SerperTool extends Tool {
  constructor(fields) {
    super(fields);

    this.apiKey = fields.apiKey;
    this.params = fields.params;
    this.type = fields.type || 'search'; // Default to 'search' if no type is specified

    this.name = 'serper';

    this.description = `A powerful search engine tool designed for retrieving real-time information and answering questions related to current events. The input should be a search query, and the tool will return relevant and up-to-date information based on the query.`;

    // Dynamically set the schema based on the type of search
    if (this.type === 'webpage') {
      this.schema = z.object({
        url: z.string().describe('the URL to scrape'),
      });
    } else {
      this.schema = z.object({
        query: z.string().describe('the query to search for'),
      });
    }
  }

  async _call(input) {
    let url = `https://google.serper.dev/${this.type}`;
    let bodyData = {};

    // Adjust the request body and URL based on the search type
    if (this.type === 'webpage') {
      url = 'https://scrape.serper.dev'; // Special endpoint for web scraping
      bodyData = { url: input.url };
    } else {
      bodyData = { q: input.query, ...this.params };
    }

    const options = {
      method: 'POST',
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`Got ${res.status} error from serper: ${res.statusText}`);
    }

    const json = await res.json();

    return json;
  }
}
