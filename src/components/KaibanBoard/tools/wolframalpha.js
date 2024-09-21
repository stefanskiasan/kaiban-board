import { Tool } from "@langchain/core/tools";
import { z } from "zod";

/**
 * For getting started with WolframAlpha, you can sign up for get an API key at: https://developer.wolframalpha.com/
 */


export class WolframAlphaTool extends Tool {
    constructor(fields) {
        super(fields);

        this.appId = fields.appId;

        this.name = "wolfram_alpha";

        this.description = `This tool leverages the computational intelligence of WolframAlpha to provide robust and detailed answers to complex queries. By integrating with WolframAlpha, this tool allows users to perform advanced computations, data analysis, and retrieve scientifically accurate information across a wide range of domains, including mathematics, physics, engineering, astronomy, and more. Users can interact with the vast knowledge base of WolframAlpha, making it an essential tool for educational purposes, research, and professional applications where precise and computationally intensive tasks are required. The integration seamlessly handles dynamic queries and provides real-time, reliable results, enhancing the capabilities of any system that requires computational intelligence.`;

        this.schema = z.object({
            query: z.string().describe("the query to send to WolframAlpha"),
        });
    }


    async _call(input) {
        const url = '/proxy/wolframalpha';

        const body = JSON.stringify({ query: input.query });

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-APP-ID': this.appId,
            },
            body: body
        });

        return res.json();
    }

}