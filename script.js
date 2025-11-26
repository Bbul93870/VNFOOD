const SHEET_PRODUCTS =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTTCtV7qFSDZDCVIDI2vkXzGxI5GbG8Ez8suIyx_TrDEXSS6t23s6QrFn9ttW079TZk6yenfuc5LVt1/pub?gid=0&single=true&output=csv";

const SHEET_HIGHLIGHT =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTTCtV7qFSDZDCVIDI2vkXzGxI5GbG8Ez8suIyx_TrDEXSS6t23s6QrFn9ttW079TZk6yenfuc5LVt1/pub?gid=2032194924&single=true&output=csv";

let allProducts = [];

Papa.parse(SHEET_HIGHLIGHT, {
    download: true,
    header: true,
    complete: res => {
        const box = document.getElementById("highlightSlider");

        res.data.forEach(item => {
            if (!item.img_url) return;

            box.innerHTML += `
                <div class="highlight-item">
                    <img src="${item.img_url}">
                    <div class="highlight-info">
                        <div class="h-title">${item.name}</div>
                        <div class="h-price">${item.price || ""}</div>
                    </div>
                </div>`;
        });
    }
});

Papa.parse(SHEET_PRODUCTS, {
    download: true,
    header: true,
    complete: res => {
        allProducts = res.data.filter(p => p.name);
        renderProducts(allProducts);
    }
});

function renderProducts(list) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    list.forEach(p => {
        grid.innerHTML += `
            <div class="item">
                <img src="${p.img_url}">
                <div class="name">${p.name}</div>
                <div class="price">${p.price}</div>
            </div>`;
    });
}

function applyFilters() {
    let q = document.getElementById("searchInput").value.toLowerCase();
    renderProducts(allProducts.filter(p => p.name.toLowerCase().includes(q)));
}

function closeSearch() {
    document.getElementById("searchInput").value = "";
    renderProducts(allProducts);
}

function toggleHighlightMenu() {
    document.getElementById("highlightMenu").classList.toggle("open");
}
