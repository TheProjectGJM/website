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
