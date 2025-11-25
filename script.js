/* CSV LINKS */
const SHEET_PRODUCTS =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTTCtV7qFSDZDCVIDI2vkXzGxI5GbG8Ez8suIyx_TrDEXSS6t23s6QrFn9ttW079TZk6yenfuc5LVt1/pub?gid=0&single=true&output=csv";

const SHEET_HIGHLIGHT =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTTCtV7qFSDZDCVIDI2vkXzGxI5GbG8Ez8suIyx_TrDEXSS6t23s6QrFn9ttW079TZk6yenfuc5LVt1/pub?gid=2032194924&single=true&output=csv";

let allProducts = [];

/* LOAD HIGHLIGHT (LIMIT 3 ITEMS ONLY) */
Papa.parse(SHEET_HIGHLIGHT, {
    download: true,
    header: true,
    complete: res => {
        const slider = document.getElementById("highlightSlider");
        const limited = res.data.filter(i => i.name).slice(0, 3);

        limited.forEach(item => {
            slider.innerHTML += `
                <div class="highlight-box">
                    <img src="${item.img_url}">
                </div>`;
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
    list.forEach(item => {
        grid.innerHTML += `
            <div class="item">
                <img src="${item.img_url}">
                <div class="name">${item.name}</div>
                <div class="price">${item.price}</div>
            </div>`;
    });
}

/* OPEN SEARCH */
function openSearch() {
    document.getElementById("searchBar").style.display = "block";
    document.querySelector(".hero").style.display = "none";
    document.getElementById("stickyHighlight").style.display = "none";
    document.getElementById("searchInput").focus();
}

/* CLOSE SEARCH */
function closeSearch() {
    document.getElementById("searchBar").style.display = "none";
    document.querySelector(".hero").style.display = "block";
    document.getElementById("stickyHighlight").style.display = "block";

    document.getElementById("searchInput").value = "";
    renderProducts(allProducts);
}

/* LIVE SEARCH */
function applyFilters() {
    let q = document.getElementById("searchInput").value.toLowerCase().trim();
    let terms = q.split(" ").filter(a => a);

    let filtered = allProducts.filter(p =>
        terms.every(t => p.name.toLowerCase().includes(t))
    );

    renderProducts(filtered);
}

/* STICKY LOGIC */
let lastY = 0;
const sticky = document.getElementById("stickyHighlight");

window.addEventListener("scroll", () => {
    let y = window.scrollY;

    if (y > lastY + 5) {
        sticky.classList.add("hide");
    } else {
        sticky.classList.remove("hide");
    }

    lastY = y <= 0 ? 0 : y;
});

/* SLIDER DRAG */
const slider = document.querySelector(".slider");
let down = false, startX, scrollLeft;

slider.addEventListener("mousedown", e => {
    down = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener("mouseup", () => down = false);
slider.addEventListener("mouseleave", () => down = false);

slider.addEventListener("mousemove", e => {
    if (!down) return;
    slider.scrollLeft = scrollLeft - ((e.pageX - slider.offsetLeft) - startX);
});
