

/******************************************

ALGORITHM.JS FILE FOR THE ALGORITHM.HTML PAGE OF MY SIMULATOR - WEB-BASED SIMULATOR FOR SORTING ALGORITHMS
BY
JAVED ULLAH - BC210405541

THIS FILE CAN CAN...
* Fetch the stored array from the session storage
* Load the details of the algorithm, once selected from the drop down list
* Dynamically change the description etc once and when the user change his/her selection
* Ensure that the algorithm is selected before moving forward

******************************************/


document.addEventListener("DOMContentLoaded", function () {

    // Try to retrieve both types of arrays from sessionStorage
    let userArray = sessionStorage.getItem("userArray");
    let sortingArray = sessionStorage.getItem("generatedArray");

    let arrayToUse;

    // Prefer userArray if it exists; else use sortingArray
    if (userArray) {
        arrayToUse = JSON.parse(userArray);
    } else if (sortingArray) {
        arrayToUse = JSON.parse(sortingArray);
    } else {
        alert("No array found! Please go back and input an array or generate a random array.");
        window.location.href = "../html/index.html"; // Redirect back
        return;
    }

    // Show the selected array on the page
    console.log("Retrieved Array:", arrayToUse); // Debugging
    document.getElementById("selected-array").textContent = `Input Array: ${arrayToUse.join(", ")}`;

    // Algorithm Selection Logic
    const algorithmSelect = document.getElementById("algorithm-select");
    const selectedAlgorithmSpan = document.getElementById("selected-algorithm");
    const descriptionDiv = document.getElementById("algorithm-description");
    const descriptionText = descriptionDiv.querySelector("p");

    // Algorithm Descriptions
    const descriptions = {
        "bubble-sort": "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the list is sorted. It has a time complexity of O(n²) in the worst and average cases, making it inefficient for large datasets.",
        
        "counting-sort": "Counting Sort is a non-comparative sorting algorithm that works well when sorting integers within a known range. It counts the occurrences of each unique element and uses this information to place the elements in the correct order. It runs in O(n + k) time, where k is the range of numbers, making it efficient for small or limited-value datasets.",
        
        "heap-sort": "Heap Sort is a comparison-based sorting algorithm that leverages the properties of a binary heap. It first builds a max heap from the input data and then repeatedly extracts the largest element, restructuring the heap each time. With a time complexity of O(n log n), it is suitable for large datasets and does not require additional memory.",
        
        "insertion-sort": "Insertion Sort is a simple yet efficient algorithm for small datasets. It builds a sorted list by taking one element at a time and inserting it into its correct position. It has a worst-case time complexity of O(n²), but it performs well on nearly sorted data due to its O(n) best-case time complexity.",
        
        "merge-sort": "Merge Sort is a divide-and-conquer algorithm that splits an array into smaller subarrays, sorts them individually, and then merges them back together. It consistently performs in O(n log n) time complexity, making it one of the most efficient sorting algorithms for large datasets, though it requires additional memory for merging.",
        
        "quick-sort": "Quick Sort is a highly efficient sorting algorithm that uses the divide-and-conquer approach. It picks a pivot element, partitions the array around the pivot, and recursively sorts the subarrays. With an average-case time complexity of O(n log n), it is one of the fastest sorting algorithms but can degrade to O(n²) in the worst case.",
        
        "radix-sort": "Radix Sort is a non-comparative sorting algorithm that sorts numbers by processing individual digits. It works well for sorting large integers or fixed-length strings. With a time complexity of O(nk), where k is the number of digits, it is efficient for specialized use cases but is not suitable for all sorting problems.",
        
        "selection-sort": "Selection Sort is an in-place comparison-based sorting algorithm that repeatedly selects the smallest element and swaps it with the first unsorted element. Though simple to implement, its O(n²) time complexity makes it inefficient for large datasets.",
        
        "bucket-sort": "Bucket Sort distributes elements into multiple buckets, sorts each bucket individually (using another sorting algorithm), and then combines the sorted buckets. With an average time complexity of O(n + k), it is useful when data is uniformly distributed but requires extra memory for buckets.",
        
        "shell-sort": "Shell Sort is an optimized version of Insertion Sort that allows exchanges of elements that are far apart. It uses a diminishing gap sequence to improve performance, reducing the number of swaps. Its time complexity depends on the gap sequence, but it can be as good as O(n log n).",
        
        "tim-sort": "Tim Sort is a hybrid sorting algorithm combining Merge Sort and Insertion Sort. It is used in Python’s built-in sorting functions and is optimized for real-world data. It has a time complexity of O(n log n) and performs well on large datasets with partially sorted sequences."
    };
    
    // Time Complexity  (for specific algorithms) - When an user select any algorithm, data will be extracted from here
    const timeComplexity = {
        "bubble-sort": `
            <h4 class="border-bottom border-3 border-primary pb-1 my-3">Time Complexity</h4>
            <div class="row mb-3">
                <div class="col-md-4">
                    <div class="card bg-light mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Best Case</h5>
                            <p class="card-text"><code>O(n)</code> - Already sorted array</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-light mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Average Case</h5>
                            <p class="card-text"><code>O(n²)</code> - Random order</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-light mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Worst Case</h5>
                            <p class="card-text"><code>O(n²)</code> - Reverse Order</p>
                        </div>
                    </div>
                </div>    
            </div>
        `,

        "bucket-sort": `
        <h4 class="border-bottom border-3 border-primary pb-1 my-3">Time Complexity</h4>
        <div class="row mb-3">
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Best Case</h5>
                        <p class="card-text"><code>O(n + k)</code> (If elements are evenly distributed)</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Average Case</h5>
                        <p class="card-text"><code>O(n + k)</code></p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Worst Case</h5>
                        <p class="card-text"><code>O(n²)</code> (If all elements fall into the same bucket, behaving like Insertion Sort)</p>
                    </div>
                </div>
            </div>    
        </div>`,

        "counting-sort": `
        <h4 class="border-bottom border-3 border-primary pb-1 my-3">Time Complexity</h4>
        <div class="row mb-3">
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Best Case</h5>
                        <p class="card-text"><code>O(n + k)</code> (when <code>k</code> is small)</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Average Case</h5>
                        <p class="card-text"><code>O(n + k)</code></p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Worst Case</h5>
                        <p class="card-text"><code>O(n + k)</code> (large <code>k</code> increases memory usage)</p>
                    </div>
                </div>
            </div>
        </div>`,

        "heap-sort": `
        <h4 class="border-bottom border-3 border-primary pb-1 my-3">Time Complexity</h4>
        <div class="row mb-3">
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Best Case</h5>
                        <p class="card-text"><code>O(n log n)</code> - Balanced input</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Average Case</h5>
                        <p class="card-text"><code>O(n log n)</code> - Random order</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Worst Case</h5>
                        <p class="card-text"><code>O(n log n)</code> - Reverse order</p>
                    </div>
                </div>
            </div>    
        </div>`,

        "insertion-sort": `
        <h4 class="border-bottom border-3 border-primary pb-1 my-3">Time Complexity</h4>
        <div class="row mb-3">
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Best Case</h5>
                        <p class="card-text"><code>O(n)</code> (Already sorted)</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Average Case</h5>
                        <p class="card-text"><code>O(n²)</code></p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Worst Case</h5>
                        <p class="card-text"><code>O(n²)</code> (Reverse order)</p>
                    </div>
                </div>
            </div>    
        </div>`,

        "merge-sort": `
        <h4 class="border-bottom border-3 border-primary pb-1 my-3">Time Complexity</h4>
        <div class="row mb-3">
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Best Case</h5>
                        <p class="card-text"><code>O(n log n)</code></p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Average Case</h5>
                        <p class="card-text"><code>O(n log n)</code></p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Worst Case</h5>
                        <p class="card-text"><code>O(n log n)</code></p>
                    </div>
                </div>
            </div>    
        </div>`,

        "quick-sort": `
        <h4 class="border-bottom border-3 border-primary pb-1 my-3">Time Complexity</h4>
        <div class="row mb-3">
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Best Case</h5>
                        <p class="card-text"><code>O(n log n)</code> (when the pivot divides the array into balanced halves).</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Average Case</h5>
                        <p class="card-text"><code>O(n log n)</code>.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Worst Case</h5>
                        <p class="card-text"><code>O(n²)</code> (when the pivot is the smallest or largest element in an already sorted or reverse-sorted array).</p>
                    </div>
                </div>
            </div>    
        </div>`,

        "radix-sort": `
        <h4 class="border-bottom border-3 border-primary pb-1 my-3">Time Complexity</h4>
        <div class="row mb-3">
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Best Case</h5>
                        <p class="card-text"><code>O(nk)</code></p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Average Case</h5>
                        <p class="card-text"><code>O(nk)</code></p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Worst Case</h5>
                        <p class="card-text"><code>O(nk)</code>.</p>
                        <ul>
                            <li><code>n</code> = Number of elements</li>
                            <li><code>k</code> = Number of digits in the largest number</li>
                        </ul>
                        <p>Radix Sort performs well when k (the number of digits) is small but may become inefficient when k is large.</p>
                    </div>
                </div>
            </div>    
        </div>`,

        "selection-sort": `
        <h4 class="border-bottom border-3 border-primary pb-1 my-3">Time Complexity</h4>
        <div class="row mb-3">
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Best Case</h5>
                        <p class="card-text"><code>O(n²)</code> (Even if the array is sorted, it still performs comparisons)</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Average Case</h5>
                        <p class="card-text"><code>O(n²)</code></p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Worst Case</h5>
                        <p class="card-text"><code>O(n²)</code></p>
                    </div>
                </div>
            </div>    
        </div>`,

        "shell-sort": `
        <h4 class="border-bottom border-3 border-primary pb-1 my-3">Time Complexity</h4>
        <div class="row mb-3">
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Best Case</h5>
                        <p class="card-text"><code>O(n log n)</code> (Using optimal gap sequence)</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Average Case</h5>
                        <p class="card-text"><code>O(n log n)</code></p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Worst Case</h5>
                        <p class="card-text"><code>O(n²)</code></p>
                    </div>
                </div>
            </div>    
        </div>`,

        "tim-sort": `
        <h4 class="border-bottom border-3 border-primary pb-1 my-3">Time Complexity</h4>
        <div class="row mb-3">
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Best Case</h5>
                        <p class="card-text"><code>O(n)</code> (If data is nearly sorted)</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Average Case</h5>
                        <p class="card-text"><code>O(n log n)</code></p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-light mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Worst Case</h5>
                        <p class="card-text"><code>O(n log n)</code></p>
                    </div>
                </div>
            </div>    
        </div>`
    };

    // When user selects an algorithm
    algorithmSelect.addEventListener("change", function () {
        const selectedValue = algorithmSelect.value;

        if (selectedValue) {
            selectedAlgorithmSpan.textContent = algorithmSelect.options[algorithmSelect.selectedIndex].text;
            descriptionText.textContent = descriptions[selectedValue];

            // Clear previous time complexity before adding new one
            descriptionDiv.innerHTML = "";  
            descriptionDiv.appendChild(descriptionText); // Re-add description

            // Creating div container for time complexity
            const timeComplexityBox = document.createElement("div");
            timeComplexityBox.innerHTML = timeComplexity[selectedValue];
            descriptionDiv.appendChild(timeComplexityBox);

            // removing the non-display property of the div
            descriptionDiv.classList.remove("d-none");
        } else {
            selectedAlgorithmSpan.textContent = "";
            descriptionDiv.classList.add("d-none");
        }
    });
});

document.getElementById("apply-algorithm").addEventListener("click", function () {
    let selectedAlgorithm = document.getElementById("algorithm-select").value;

    if (!selectedAlgorithm) {
        alert("Please select an algorithm first!");
        return;
    }

    // Store the selected algorithm in sessionStorage
    sessionStorage.setItem("selectedAlgorithm", selectedAlgorithm);

    // Redirect to simulation page
    window.location.href = "../html/simulation.html";
});

