const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto('https://krishakbandhu.wb.gov.in/agricultural-labour/', { waitUntil: 'networkidle' });

        const metrics = await page.evaluate(() => {
            const getStyle = (el, prop) => window.getComputedStyle(el).getPropertyValue(prop);

            // Selectors based on the structure (needs to be robust)
            const header = document.querySelector('header') || document.querySelector('.navbar') || document.querySelector('div[class*="header"]');
            const banner = document.querySelector('div[class*="banner"] img') || document.querySelector('img[src*="banner"]');
            const cards = Array.from(document.querySelectorAll('.card, .box, div[class*="col-"]')).filter(el => el.innerText.includes("About Project"));

            // Specific selectors from observed HTML/CSS if available
            // .header-wrapper, .banner-section, .service-box etc. 
            // Based on previous CSS dump: .fullwidthbanner-container for banner?

            return {
                header: header ? {
                    height: header.getBoundingClientRect().height,
                    bgColor: getStyle(header, 'background-color'),
                    padding: getStyle(header, 'padding')
                } : null,
                banner: banner ? {
                    height: banner.getBoundingClientRect().height,
                    width: banner.getBoundingClientRect().width
                } : null,
                card: cards.length > 0 ? {
                    height: cards[0].getBoundingClientRect().height,
                    padding: getStyle(cards[0], 'padding'),
                    margin: getStyle(cards[0], 'margin'),
                    bgColor: getStyle(cards[0], 'background-color'),
                    titleColor: getStyle(cards[0].querySelector('h1, h2, h3, h4, h5, h6'), 'color'),
                    titleSize: getStyle(cards[0].querySelector('h1, h2, h3, h4, h5, h6'), 'font-size')
                } : null,
                footer: {
                    bgColor: getStyle(document.querySelector('footer'), 'background-color'),
                    height: document.querySelector('footer').getBoundingClientRect().height
                }
            };
        });

        console.log(JSON.stringify(metrics, null, 2));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await browser.close();
    }
})();
