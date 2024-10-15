import { testURL, URLType, parseURLs, get_valid_urls } from '../src/URL';
import * as fs from 'fs';
import { exit } from 'process';

jest.mock('fs');
jest.mock('process', () => ({
    exit: jest.fn(),
    argv: ['node', 'script', 'testFile.txt'],
}));
jest.mock('dotenv', () => ({
    config: jest.fn().mockImplementation(() => {
        process.env.LOG_LEVEL = "debug";
        process.env.LOG_FILE = "log.log";
        return { parsed: { LOG_LEVEL: "debug", LOG_FILE: "log.log" } };
    }),
}));


// Mock global fetch function
global.fetch = jest.fn();

describe('URL Utility Functions', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('testURL', () => {
        it('should return true if the URL is accessible (status 200-299)', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

            const result = await testURL('https://example.com');

            expect(result).toBe(true);
         });

        it('should return false if the URL is not accessible', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

            const result = await testURL('https://example.com');

            expect(result).toBe(false);
        });

        it('should return false and log an error if there is an exception', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

            const result = await testURL('https://example.com');

            expect(result).toBe(false);
        });
    });

    describe('URLType', () => {
        it('should return "github" if the URL contains github.com', () => {
            const result = URLType('https://github.com/user/repo');

            expect(result).toBe('github');
       });

        it('should return "npmjs" if the URL contains npmjs.com', () => {
            const result = URLType('https://www.npmjs.com/package/example');

            expect(result).toBe('npmjs');
        });

        it('should return "other" if the URL does not contain github.com or npmjs.com', () => {
            const result = URLType('https://example.com');

            expect(result).toBe('other');
          });
    });

    describe('parseURLs', () => {
        // it('should return an array of URLs if the file exists and contains URLs', () => {
        //     (fs.existsSync as jest.Mock).mockReturnValue(true);
        //     (fs.readFileSync as jest.Mock).mockReturnValue('https://example.com\nhttps://github.com');

        //     const result = parseURLs('testFile.txt');

        //     expect(result).toEqual(['https://example.com', 'https://github.com']);
        //     expect(logMessage).toHaveBeenCalledWith('parseURLs', ['File exists, reading content.', 'Filename: testFile.txt']);
        //     expect(logMessage).toHaveBeenCalledWith('parseURLs', ['Parsing URLs from file content.', 'Content length: 40']);
        // });

        it('should return an empty array if the file is empty', () => {
            (fs.existsSync as jest.Mock).mockReturnValue(true);
            (fs.readFileSync as jest.Mock).mockReturnValue('');

            const result = parseURLs('testFile.txt');

            expect(result).toEqual([]);
        });

        it('should call exit if the file does not exist', () => {
            (fs.existsSync as jest.Mock).mockReturnValue(false);

            parseURLs('testFile.txt');

            expect(exit).toHaveBeenCalledWith(1);
        });
    });

    describe('get_valid_urls', () => {
        it('should return an array of valid URLs after testing each URL for accessibility', async () => {
            (fs.existsSync as jest.Mock).mockReturnValue(true);
            (fs.readFileSync as jest.Mock).mockReturnValue('https://example.com\nhttps://github.com');
            (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

            const result = await get_valid_urls('testFile.txt');

            expect(result).toEqual(['https://example.com', 'https://github.com']);
        });

        // it('should exit if an error occurs during URL testing', async () => {
        //     (fs.existsSync as jest.Mock).mockReturnValue(true);
        //     (fs.readFileSync as jest.Mock).mockReturnValue('https://example.com');
        //     (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

        //     await get_valid_urls('testFile.txt');

        //     expect(logMessage).toHaveBeenCalledWith('get_valid_urls', ['Error processing URL.', 'Error: Error: Network Error']);
        //     expect(exit).toHaveBeenCalledWith(1);
        // });
    });
});