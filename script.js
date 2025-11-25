/* GOOGLE SHEETS */
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
        const div = document.getElementById("highlightSlider");
        res.data.slice(0, 10).forEach(item => {
            if (!item.img_url) return;
            div.innerHTML += `<img src="${item.img_url}">`;
        });
    }
});

/* LOAD PRODUCTS */
Papa.parse(SHEET_PRODUCTS, {
    download: true,
    header: true,
    complete: res => {
        allProducts = res.data.filter(p => p.name);
        renderProducts(allProducts);
    }
});

/* RENDER GRID */
function renderProducts(list) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";
    list.forEach(p => {
        grid.innerHTML += `
            <div class="item">
                <img src="${p.img_url}">
                <div class="name">${p.name}</div>
                <div class="price">${p.price}</div>
            </div>
        `;
    });
}

/* SEARCH */
function applyFilters() {
    let q = document.getElementById("searchInput").value
        .toLowerCase()
        .trim();

    let result = allProducts.filter(p =>
        p.name.toLowerCase().includes(q)
    );

    renderProducts(result);
}

/* CLOSE SEARCH */
function closeSearch() {
    document.getElementById("searchInput").value = "";
    renderProducts(allProducts);
}

/* HIGHLIGHT MENU TOGGLE */
function toggleHighlightMenu() {
    const menu = document.getElementById("highlightMenu");
    menu.classList.toggle("open");
}
