const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const scriptPath = path.resolve(__dirname, 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

describe('initParticles', () => {
    let dom;
    let window;
    let document;

    beforeEach(() => {
        // Create a new JSDOM instance with dangerously enabled scripts
        dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { runScripts: "dangerously" });
        window = dom.window;
        document = window.document;

        // Append the script to the DOM
        const scriptElement = document.createElement("script");
        scriptElement.textContent = scriptContent;
        document.body.appendChild(scriptElement);
    });

    test('should do nothing if particles-container does not exist', () => {
        // Mock createParticle to ensure it isn't called
        window.createParticle = jest.fn();

        window.initParticles();

        expect(window.createParticle).not.toHaveBeenCalled();
    });

    test('should call createParticle 60 times if particles-container exists', () => {
        // Add container
        const container = document.createElement('div');
        container.id = 'particles-container';
        document.body.appendChild(container);

        // Mock createParticle
        window.createParticle = jest.fn();

        // Call initParticles
        window.initParticles();

        // Verify mock was called 60 times
        expect(window.createParticle).toHaveBeenCalledTimes(60);

        // The real function is now passed a DocumentFragment, not the container itself directly.
        // We can check if it was called with any DocumentFragment
        expect(window.createParticle).toHaveBeenCalledWith(expect.any(window.DocumentFragment));
    });
});
