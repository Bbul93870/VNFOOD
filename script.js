/* CSV LINKS */
const SHEET_PRODUCTS =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTTCtV7qFSDZDCVIDI2vkXzGxI5GbG8Ez8suIyx_TrDEXSS6t23s6QrFn9ttW079TZk6yenfuc5LVt1/pub?gid=0&single=true&output=csv";

const SHEET_HIGHLIGHT =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTTCtV7qFSDZDCVIDI2vkXzGxI5GbG8Ez8suIyx_TrDEXSS6t23s6QrFn9ttW079TZk6yenfuc5LVt1/pub?gid=2032194924&single=true&output=csv";

let allProducts = [];

/* LOAD HIGHLIGHT */
Papa.parse(SHEET_HIGHLIGHT, {
    download: true,
    header: true,
    complete: res => {
        const slider = document.getElementById("highlightSlider");

        res.data.forEach(item => {
            if (!item.name) return;

            slider.innerHTML += `
                <div class="highlight-box">
                    <img src="${item.img_url}?v=${Date.now()}">
                    <div class="highlight-name">${item.name}</div>
                    <div class="highlight-price">${item.price}</div>
                </div>`;
        });
    }
});

/* LOAD PRODUCTS */
Papa.parse(SHEET_PRODUCTS, {
    download: true,
    header: true,
    complete: res => {
        allProducts = res.data.filter(i => i.name);
        generateCategoryFilter(allProducts);
        renderProducts(allProducts);
    }
});

/* CATEGORY BUILD */
function generateCategoryFilter(items) {
    const select = document.getElementById("categoryFilter");
    let cats = ["all"];

    items.forEach(p => {
        if (p.category && !cats.includes(p.category))
            cats.push(p.category);
    });

    cats.forEach(cat => {
        select.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

/* RENDER PRODUCTS */
function renderProducts(list) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    list.forEach(item => {
        grid.innerHTML += `
            <div class="item">
                <img src="${item.img_url}?v=${Date.now()}">
                <div class="name">${item.name}</div>
                <div class="price">${item.price}</div>
            </div>`;
    });
}

/* SEARCH FILTER */
function applyFilters() {
    let search = document.getElementById("searchInput").value.toLowerCase();
    let category = document.getElementById("categoryFilter").value.toLowerCase();
    let words = search.split(" ").filter(w => w.length > 0);

    let filtered = allProducts.filter(item => {
        let matchText = words.every(w => item.name.toLowerCase().includes(w));
        let matchCat = (category === "all" || item.category.toLowerCase() === category);
        return matchText && matchCat;
    });

    renderProducts(filtered);
}

/* OPEN/CLOSE SEARCH PANEL */
function toggleSearch() {
    document.getElementById("searchPanel").classList.toggle("open");
}

/* STICKY LEVEL 2 — COMPACT + AUTO-HIDE */
let lastScroll = 0;
const sticky = document.getElementById("stickyHighlight");

window.addEventListener("scroll", () => {
    let current = window.scrollY;

    if (current > lastScroll + 5) {
        sticky.classList.add("compact");
        sticky.classList.add("hide");
    } else {
        sticky.classList.remove("hide");
    }

    lastScroll = current <= 0 ? 0 : current;
});

/* DRAGGABLE SLIDER */
const slider = document.querySelector('.slider');
let isDown = false, startX, scrollLeft;

slider.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => isDown = false);
slider.addEventListener('mouseup', () => isDown = false);
slider.addEventListener('mousemove', e => {
    if (!isDown) return;
    slider.scrollLeft = scrollLeft - (e.pageX - slider.offsetLeft - startX);
});

/* TOUCH DRAG */
slider.addEventListener('touchstart', e => {
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
}, { passive: true });

slider.addEventListener('touchmove', e => {
    slider.scrollLeft = scrollLeft - (e.touches[0].pageX - slider.offsetLeft - startX);
}, { passive: true });
