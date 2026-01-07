

/*************************************
 * 
 * Dynamically including header and
 * Footer in every html page of this
 * website
 * 
 ************************************/

async function loadHeader() {
    let res = await fetch('../html/header.html');
    let data = await res.text();
    document.getElementById('header').innerHTML = data;

    setActiveNavLink(); // 👈 highlight current page
}

loadHeader();

fetch('../html/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);


/*************************************
 * 
 * Sorting list injection +
 * Feedback form submission  - to be added later on 
 * 
 ************************************/

document.addEventListener("DOMContentLoaded", function () {
    // ========== Sorting Algorithms List ==========
    const sortingAlgorithms = [
        { name: "Quick Sort", link: "quick-sort.html" },
        { name: "Merge Sort", link: "merge-sort.html" },
        { name: "Bubble Sort", link: "bubble-sort.html" },
        { name: "Heap Sort", link: "heap-sort.html" },
        { name: "Insertion Sort", link: "insertion-sort.html" },
        { name: "Radix Sort", link: "radix-sort.html" },
        { name: "Counting Sort", link: "counting-sort.html" },
        { name: "Shell Sort", link: "shell-sort.html" },
        { name: "Bucket Sort", link: "bucket-sort.html" }
    ];

    let shuffled = sortingAlgorithms.sort(() => 0.5 - Math.random()).slice(0, 3);
    let ul = document.getElementById("sorting-list");
    ul.innerHTML = "";

    shuffled.forEach(algo => {
        let li = document.createElement("li");
        li.className = "list-group-item flex-fill bg-light";
        li.innerHTML = `<a href="${algo.link}" class="text-decoration-none text-primary fw-bold">${algo.name}</a>`;
        ul.appendChild(li);
    });

    console.log("script.js loaded");

    
});


/*************************************
 * 
 * Dynamically highlighting active page
 * In Nav Bar in the header 
 * 
 ************************************/


function setActiveNavLink() {
    const links = document.querySelectorAll('.custom-nav a');
    const currentPage = window.location.pathname.split('/').pop();

    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}
