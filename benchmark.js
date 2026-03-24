const puppeteer = require('puppeteer');

async function runBenchmark(url) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Load local index.html
    await page.goto(url);

    // Give it a moment to initialize
    await new Promise(r => setTimeout(r, 1000));

    // Inject performance observer to measure long tasks or just measure execution time of mousemove
    // Wait, we can evaluate a script that triggers mousemove events and measures the time taken
    const results = await page.evaluate(async () => {
        const ITERATIONS = 1000;
        const start = performance.now();

        for (let i = 0; i < ITERATIONS; i++) {
            const event = new MouseEvent('mousemove', {
                clientX: Math.random() * 1000,
                clientY: Math.random() * 1000,
                bubbles: true
            });
            document.dispatchEvent(event);
        }

        const end = performance.now();
        return {
            totalTimeMs: end - start,
            iterations: ITERATIONS
        };
    });

    console.log(`Benchmark completed in ${results.totalTimeMs.toFixed(2)}ms for ${results.iterations} iterations.`);
    console.log(`Average time per event: ${(results.totalTimeMs / results.iterations).toFixed(4)}ms`);

    await browser.close();
    return results;
}

(async () => {
    const path = 'file://' + __dirname + '/index.html';
    await runBenchmark(path);
})();
const { performance } = require('perf_hooks');

// Mock DOM
const heroStyle = { backgroundPositionY: '' };
const heroElement = { style: heroStyle };

let domQueries = 0;
let styleUpdates = 0;

const document = {
    querySelector: (selector) => {
        domQueries++;
        if (selector === '.hero') return heroElement;
        return null;
    }
};

// We use Proxy to intercept style updates if we want to count them, or we can just count them.
let styleObj = {};
heroElement.style = new Proxy(styleObj, {
    set: function(target, prop, value) {
        if (prop === 'backgroundPositionY') styleUpdates++;
        target[prop] = value;
        return true;
    }
});


let callbacks = [];
let frameCallbacks = [];

const window = {
    innerHeight: 1000,
    pageYOffset: 0,
    addEventListener: (event, cb) => {
        if (event === 'scroll') callbacks.push(cb);
    },
    requestAnimationFrame: (cb) => {
        frameCallbacks.push(cb);
    }
};

// Original implementation
function originalInit() {
    callbacks = [];
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');

        if (hero && scrolled < window.innerHeight) {
            const rate = scrolled * 0.3;
            hero.style.backgroundPositionY = rate + 'px';
        }
    });
}

// Optimized implementation
function optimizedInit() {
    callbacks = [];
    const hero = document.querySelector('.hero');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                if (hero && scrolled < window.innerHeight) {
                    const rate = scrolled * 0.3;
                    hero.style.backgroundPositionY = rate + 'px';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

function runBenchmark(initFunc, name) {
    domQueries = 0;
    styleUpdates = 0;
    callbacks = [];
    frameCallbacks = [];

    initFunc();

    // Simulate scrolling over time
    const totalFrames = 600; // e.g. 10 seconds at 60fps
    const scrollEventsPerFrame = 20; // wheel/touchpad fires many events between frames

    const startTime = performance.now();

    for (let f = 0; f < totalFrames; f++) {
        // Fire scroll events
        for (let s = 0; s < scrollEventsPerFrame; s++) {
            window.pageYOffset = Math.floor(Math.random() * 800);
            callbacks.forEach(cb => cb());
        }

        // Process frame
        const currentFrames = [...frameCallbacks];
        frameCallbacks = [];
        currentFrames.forEach(cb => cb());
    }

    const endTime = performance.now();

    console.log(`\n--- ${name} ---`);
    console.log(`Time: ${(endTime - startTime).toFixed(2)} ms`);
    console.log(`DOM Queries (.querySelector): ${domQueries}`);
    console.log(`Style Updates (backgroundPositionY): ${styleUpdates}`);

    return endTime - startTime;
}

console.log("Starting Benchmark...");
const originalTime = runBenchmark(originalInit, 'Original Code');
const optimizedTime = runBenchmark(optimizedInit, 'Optimized Code');

console.log(`\nTime Improvement: ${((originalTime - optimizedTime) / originalTime * 100).toFixed(2)}%`);
