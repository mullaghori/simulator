
/*
/******************************************

SIMULATION.JS FILE FOR THE SIMULATION.HTML PAGE OF MY SIMULATOR - WEB-BASED SIMULATOR FOR SORTING ALGORITHMS
BY
JAVED ULLAH - BC210405541

THIS FILE CAN CAN...
* Load Entered Array and Selected Algorithm from the session storage
* Create bars for the elements of the array
* Make the buttons workable
* Make the speed bar workable
* Populate the info on the completion of the simulation
* Logic for the Bubble Sort Algorithm
* Save Sorting result on completion of the simulation


******************************************/

// Color scheme constants for bars coloring
const COLOR_DEFAULT = "#6c757d";    // Gray (initial state)
const COLOR_COMPARE = "#ffc107";    // Yellow (comparing)
const COLOR_SWAP = "#dc3545";       // Red (swapping)
const COLOR_SORTED = "#28a745";     // Green (sorted)
const COLOR_PIVOT = "#6f42c1";      // Purple (pivot in QuickSort)
const COLOR_BUCKET = "#17a2b8";     // Teal (bucket assignment)

document.addEventListener("DOMContentLoaded", function () {

    // Try to retrieve both types of arrays from sessionStorage
    let userArray = sessionStorage.getItem("userArray");
    let sortingArray = sessionStorage.getItem("generatedArray");

    let storedArray;

    // Checking if there is an array to be sorted
    if (userArray) {
        storedArray = JSON.parse(userArray);
    } else if (sortingArray) {
        storedArray = JSON.parse(sortingArray);
    } else {
        alert("Missing data! Please go back and enter the array again.");
        window.location.href = "../html/index.html"; // Redirect back to the home page
        return;
    }

    let selectedAlgorithm = sessionStorage.getItem("selectedAlgorithm");

    // Data validation - checking if the user selected an algorithm
    if (!selectedAlgorithm) {
        alert("Missing data! Please go back and select any algorithm for selection.");
        window.location.href = "../html/algorithm.html";
        return;
    }

    // Display selected values
    document.getElementById("selected-array").textContent = storedArray.join(", ");
    document.getElementById("selected-algorithm").textContent = selectedAlgorithm;
    document.getElementById("entered-array").textContent = storedArray.join(", ");
    document.getElementById("used-algorithm").textContent = selectedAlgorithm;

    let arrayContainer = document.getElementById("array-container");
    let speedSlider = document.getElementById("speed-range");
    let startButton = document.querySelector(".btn-success");
    let pauseButton = document.querySelector(".btn-warning");
    let resetButton = document.querySelector(".btn-danger");

    let sortingPaused = false;
    let animationSpeed = 300 - speedSlider.value * 25;
    let sortingStarted = false;
    let startTime, endTime;
    let scaleFactor;
    let bars; // Global reference to bars

    // Creating bars with proper label visibility
    // Updated createBars function with proper label positioning
    function createBars(array) {
        arrayContainer.innerHTML = "";
        let maxValue = Math.max(...array);
        let containerHeight = arrayContainer.clientHeight;
        scaleFactor = (containerHeight - 30) / maxValue; // Reserve space for labels

        bars = [];

        const showLabels = array.length <= 60; // Only show labels for 60 or fewer elements

        // for auto adjustment of bar width
        let barWidth = array.length <= 60 ? 40 : Math.max(10, Math.floor(2400 / array.length));

        array.forEach((value, index) => {
            let bar = document.createElement("div");
            bar.classList.add("bar");
            bar.style.height = `${value * scaleFactor}px`;
            bar.style.width = `${barWidth}px`;
            bar.style.margin = "2px";
            bar.style.backgroundColor = COLOR_DEFAULT;
            bar.style.display = "flex";
            bar.style.alignItems = "end";
            bar.style.justifyContent = "center";
            bar.style.borderRadius = "5px";
            bar.style.position = "relative";
            bar.style.transition = "background-color 0.3s";

            if (showLabels) {
                let label = document.createElement("span");
                label.textContent = value;
                label.style.position = "absolute";
                label.style.top = "-25px";
                label.style.fontSize = "12px";
                label.style.color = "#333";
                label.style.backgroundColor = "white";
                label.style.padding = "1px 2px";
                label.style.borderRadius = "2px";
                label.style.zIndex = "10";

                bar.appendChild(label);
            }
            
            arrayContainer.appendChild(bar);
            bars.push(bar);
        });
    }

    createBars(storedArray);

    speedSlider.addEventListener("input", function () {
        animationSpeed = 300 - speedSlider.value * 25;
    });

    
    // ================== SORTING ALGORITHMS ================== //

    async function bubbleSortWithAnimation(arr) {
        let n = arr.length;
    
        if (!sortingStarted) {
            startTime = new Date();
            document.getElementById("start-time").textContent = startTime.toLocaleTimeString();
            sortingStarted = true;
        }
    
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - 1 - i; j++) {
                await delay();
    
                // Highlight comparison
                await updateBarColor(j, COLOR_COMPARE);
                await updateBarColor(j + 1, COLOR_COMPARE);
    
                if (arr[j] > arr[j + 1]) {
                    // Highlight swap
                    await updateBarColor(j, COLOR_SWAP);
                    await updateBarColor(j + 1, COLOR_SWAP);
    
                    // Swap values
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    
                    // Update bar visuals
                    await updateBarHeight(j, arr[j]);
                    await updateBarHeight(j + 1, arr[j + 1]);
                }
    
                // Reset colors if not final comparison
                if (j !== n - 2 - i) {
                    await updateBarColor(j, COLOR_DEFAULT);
                    await updateBarColor(j + 1, COLOR_DEFAULT);
                }
            }
    
            // Mark sorted bar
            await updateBarColor(n - 1 - i, COLOR_SORTED);
        }
    
        // Mark the first element as sorted
        await updateBarColor(0, COLOR_SORTED);
    
        endSort(arr);
    }
    
    async function selectionSortWithAnimation(arr) {
        let n = arr.length;
    
        if (!sortingStarted) {
            startTime = new Date();
            document.getElementById("start-time").textContent = startTime.toLocaleTimeString();
            sortingStarted = true;
        }
    
        for (let i = 0; i < n; i++) {
            let minIndex = i;
            await updateBarColor(minIndex, COLOR_COMPARE);
    
            for (let j = i + 1; j < n; j++) {
                await delay();
                await updateBarColor(j, COLOR_COMPARE);
    
                if (arr[j] < arr[minIndex]) {
                    await updateBarColor(minIndex, COLOR_DEFAULT);
                    minIndex = j;
                    await updateBarColor(minIndex, COLOR_COMPARE);
                } else {
                    await updateBarColor(j, COLOR_DEFAULT);
                }
            }
    
            if (minIndex !== i) {
                await updateBarColor(i, COLOR_SWAP);
                await updateBarColor(minIndex, COLOR_SWAP);
                await delay();
    
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                await updateBarHeight(i, arr[i]);
                await updateBarHeight(minIndex, arr[minIndex]);
            }
    
            await updateBarColor(i, COLOR_SORTED);
        }
    
        endSort(arr);
    }
    
    async function insertionSortWithAnimation(arr) {
        let n = arr.length;
    
        if (!sortingStarted) {
            startTime = new Date();
            document.getElementById("start-time").textContent = startTime.toLocaleTimeString();
            sortingStarted = true;
        }
    
        await updateBarColor(0, COLOR_SORTED); // First element is already sorted
    
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
    
            await updateBarColor(i, COLOR_COMPARE);
            await delay();
    
            while (j >= 0 && arr[j] > key) {
                await delay();
    
                arr[j + 1] = arr[j];
                await updateBarHeight(j + 1, arr[j + 1]);
    
                await updateBarColor(j, COLOR_SWAP);
                await updateBarColor(j + 1, COLOR_SWAP);
                await delay();
    
                await updateBarColor(j, COLOR_DEFAULT);
                if (j > 0) await updateBarColor(j - 1, COLOR_DEFAULT);
    
                j--;
            }
    
            arr[j + 1] = key;
            await updateBarHeight(j + 1, key);
            await updateBarColor(j + 1, COLOR_SORTED);
        }
    
        endSort(arr);
    }
    
    async function heapSortWithAnimation(arr) {
        let n = arr.length;
    
        if (!sortingStarted) {
            startTime = new Date();
            document.getElementById("start-time").textContent = startTime.toLocaleTimeString();
            sortingStarted = true;
        }
    
        async function heapify(n, i) {
            let largest = i;
            let l = 2 * i + 1;
            let r = 2 * i + 2;
    
            await updateBarColor(i, COLOR_PIVOT);
            if (l < n) await updateBarColor(l, COLOR_COMPARE);
            if (r < n) await updateBarColor(r, COLOR_COMPARE);
            await delay();
    
            if (l < n && arr[l] > arr[largest]) largest = l;
            if (r < n && arr[r] > arr[largest]) largest = r;
    
            if (largest !== i) {
                await updateBarColor(i, COLOR_SWAP);
                await updateBarColor(largest, COLOR_SWAP);
                await delay();
    
                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                await updateBarHeight(i, arr[i]);
                await updateBarHeight(largest, arr[largest]);
    
                await heapify(n, largest);
            }
    
            await updateBarColor(i, COLOR_DEFAULT);
            if (l < n) await updateBarColor(l, COLOR_DEFAULT);
            if (r < n) await updateBarColor(r, COLOR_DEFAULT);
        }
    
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await heapify(n, i);
        }
    
        for (let i = n - 1; i > 0; i--) {
            await updateBarColor(0, COLOR_SWAP);
            await updateBarColor(i, COLOR_SWAP);
            await delay();
    
            [arr[0], arr[i]] = [arr[i], arr[0]];
            await updateBarHeight(0, arr[0]);
            await updateBarHeight(i, arr[i]);
    
            await updateBarColor(i, COLOR_SORTED);
            await heapify(i, 0);
        }
    
        await updateBarColor(0, COLOR_SORTED);
        endSort(arr);
    }
    
    async function mergeSortWithAnimation(arr) {
        if (!sortingStarted) {
            startTime = new Date();
            document.getElementById("start-time").textContent = startTime.toLocaleTimeString();
            sortingStarted = true;
        }
    
        async function merge(l, m, r) {
            let left = arr.slice(l, m + 1);
            let right = arr.slice(m + 1, r + 1);
            let i = 0, j = 0, k = l;
    
            await highlightRange(l, r, COLOR_COMPARE);
            await delay();
    
            while (i < left.length && j < right.length) {
                if (left[i] <= right[j]) {
                    arr[k] = left[i++];
                } else {
                    arr[k] = right[j++];
                }
    
                await updateBarHeight(k, arr[k]);
                await updateBarColor(k, COLOR_SWAP);
                k++;
            }
    
            while (i < left.length) {
                arr[k] = left[i++];
                await updateBarHeight(k, arr[k]);
                await updateBarColor(k, COLOR_SWAP);
                k++;
            }
    
            while (j < right.length) {
                arr[k] = right[j++];
                await updateBarHeight(k, arr[k]);
                await updateBarColor(k, COLOR_SWAP);
                k++;
            }
    
            await highlightRange(l, r, COLOR_SORTED);
        }
    
        async function mergeSortHelper(l, r) {
            if (l < r) {
                let m = Math.floor((l + r) / 2);
                await mergeSortHelper(l, m);
                await mergeSortHelper(m + 1, r);
                await merge(l, m, r);
            }
        }
    
        await mergeSortHelper(0, arr.length - 1);
        endSort(arr);
    }
      
    async function timSortWithAnimation(arr) {
        const MIN_MERGE = 32;  // Minimum size of a run (can be adjusted)
        let n = arr.length;
    
        // Initialize sorting timer if not already started
        if (!sortingStarted) {
            startTime = new Date();
            document.getElementById("start-time").textContent = startTime.toLocaleTimeString();
            sortingStarted = true;
        }
    
        /**
         * Modified insertion sort that sorts a specific range of the array with animation
         * @param {Array} arr - The array to sort
         * @param {number} left - Starting index of the range to sort
         * @param {number} right - Ending index of the range to sort
         */
        async function insertionSortWithAnimation(arr, left, right) {
            for (let i = left + 1; i <= right; i++) {
                let key = arr[i];
                let j = i - 1;
    
                // Highlight current element being inserted
                await updateBarColor(i, COLOR_COMPARE);
                while (sortingPaused) await new Promise(resolve => setTimeout(resolve, 100));
                await delay();
    
                while (j >= left && arr[j] > key) {
                    // Highlight comparison
                    await updateBarColor(j, COLOR_COMPARE);
                    await delay();
    
                    // Perform shift
                    arr[j + 1] = arr[j];
                    await updateBarHeight(j + 1, arr[j + 1]);
    
                    // Highlight swap
                    await updateBarColor(j + 1, COLOR_SWAP);
                    await delay();
    
                    // Reset left element color
                    await updateBarColor(j, j === left ? COLOR_SORTED : COLOR_DEFAULT);
                    j--;
                }
    
                arr[j + 1] = key;
                await updateBarHeight(j + 1, arr[j + 1]);
    
                // Mark new position as sorted
                await updateBarColor(j + 1, COLOR_SORTED);
    
                // Reset original position's color if not the same
                if (j + 1 !== i) {
                    await updateBarColor(i, COLOR_DEFAULT);
                }
            }
    
            // Mark entire run as sorted
            await highlightRange(left, right, COLOR_SORTED);
        }
    
        /**
         * Merges two sorted subarrays of arr[] with animation
         * First subarray is arr[left..mid]
         * Second subarray is arr[mid+1..right]
         */
        async function merge(arr, left, mid, right) {
            let leftArr = arr.slice(left, mid + 1);
            let rightArr = arr.slice(mid + 1, right + 1);
            let i = 0, j = 0, k = left;
    
            // Highlight sections being merged
            await highlightRange(left, right, COLOR_COMPARE);
            while (sortingPaused) await new Promise(resolve => setTimeout(resolve, 100));
            await delay();
    
            while (i < leftArr.length && j < rightArr.length) {
                if (leftArr[i] <= rightArr[j]) {
                    arr[k] = leftArr[i++];
                } else {
                    arr[k] = rightArr[j++];
                }
    
                // Update visuals
                await updateBarHeight(k, arr[k]);
                await updateBarColor(k, COLOR_SWAP);
                await delay();
                k++;
            }
    
            // Copy remaining elements of leftArr[] if any
            while (i < leftArr.length) {
                arr[k] = leftArr[i++];
                await updateBarHeight(k, arr[k]);
                await updateBarColor(k, COLOR_SWAP);
                await delay();
                k++;
            }
    
            // Copy remaining elements of rightArr[] if any
            while (j < rightArr.length) {
                arr[k] = rightArr[j++];
                await updateBarHeight(k, arr[k]);
                await updateBarColor(k, COLOR_SWAP);
                await delay();
                k++;
            }
    
            // Mark merged range as sorted
            await highlightRange(left, right, COLOR_SORTED);
        }
    
        // Sort individual subarrays of size MIN_MERGE
        for (let i = 0; i < n; i += MIN_MERGE) {
            await insertionSortWithAnimation(arr, i, Math.min(i + MIN_MERGE - 1, n - 1));
        }
    
        // Start merging from size MIN_MERGE and double the size each iteration
        for (let size = MIN_MERGE; size < n; size *= 2) {
            for (let left = 0; left < n; left += 2 * size) {
                let mid = left + size - 1;
                let right = Math.min(left + 2 * size - 1, n - 1);
    
                if (mid < right) {
                    await merge(arr, left, mid, right);
                }
            }
        }
    
        // Finalize the sorting process
        endSort(arr);
    }
    
    async function shellSortWithAnimation(arr) {
        let n = arr.length;
    
        if (!sortingStarted) {
            startTime = new Date();
            document.getElementById("start-time").textContent = startTime.toLocaleTimeString();
            sortingStarted = true;
        }
    
        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            for (let i = gap; i < n; i++) {
                let temp = arr[i];
                let j;
    
                await updateBarColor(i, COLOR_COMPARE);
                await handlePauseAndDelay();
    
                for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                    await handlePause();
    
                    arr[j] = arr[j - gap];
                    await updateBarHeight(j, arr[j]);
                    await updateBarColor(j, COLOR_SWAP);
                    await handlePauseAndDelay();
                    await updateBarColor(j, COLOR_DEFAULT);
                }
    
                arr[j] = temp;
                await updateBarHeight(j, arr[j]);
                await updateBarColor(j, COLOR_SORTED);
            }
        }
    
        for (let i = 0; i < n; i++) {
            await updateBarColor(i, COLOR_SORTED);
        }
    
        endSort(arr);
    
        async function handlePauseAndDelay() {
            while (sortingPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return new Promise(resolve => setTimeout(resolve, animationSpeed));
        }
    
        async function handlePause() {
            while (sortingPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }
    
    async function radixSortWithAnimation(arr) {
        if (!sortingStarted) {
            startTime = new Date();
            document.getElementById("start-time").textContent = startTime.toLocaleTimeString();
            sortingStarted = true;
        }
    
        let max = Math.max(...arr);
    
        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            let output = new Array(arr.length).fill(0);
            let count = new Array(10).fill(0);
            let digitBuckets = Array(10).fill().map(() => []);
    
            for (let i = 0; i < arr.length; i++) {
                await updateBarColor(i, COLOR_COMPARE);
            }
            await handleDelay();
    
            for (let i = 0; i < arr.length; i++) {
                await handlePause();
                const digit = Math.floor(arr[i] / exp) % 10;
                count[digit]++;
                digitBuckets[digit].push(arr[i]);
                await updateBarColor(i, getBucketColor(digit));
                await handleDelay();
            }
    
            for (let i = 1; i < 10; i++) {
                count[i] += count[i - 1];
            }
    
            for (let i = arr.length - 1; i >= 0; i--) {
                await handlePause();
                const digit = Math.floor(arr[i] / exp) % 10;
                output[count[digit] - 1] = arr[i];
                count[digit]--;
            }
    
            for (let i = 0; i < arr.length; i++) {
                await handlePause();
    
                if (arr[i] !== output[i]) {
                    arr[i] = output[i];
                    await updateBarHeight(i, arr[i]);
                    await updateBarColor(i, COLOR_SWAP);
                    await handleDelay();
                }
    
                await updateBarColor(i, COLOR_DEFAULT);
            }
    
            await handleDelay();
        }
    
        for (let i = 0; i < arr.length; i++) {
            await updateBarColor(i, COLOR_SORTED);
            await handleDelay(animationSpeed / 2);
        }
    
        endSort(arr);
    
        function getBucketColor(digit) {
            const colors = [
                '#FF5733', '#33FF57', '#3357FF', '#F333FF',
                '#33FFF5', '#FF33F5', '#B833FF', '#33FFBD',
                '#FFBD33', '#33B8FF'
            ];
            return colors[digit % colors.length];
        }
    
        async function handlePause() {
            while (sortingPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    
        async function handleDelay(customDelay = animationSpeed) {
            await handlePause();
            return new Promise(resolve => setTimeout(resolve, customDelay));
        }
    }
    
    async function bucketSortWithAnimation(arr) {
        // Initialize sorting timer if not already started
        if (!sortingStarted) {
            startTime = new Date();
            document.getElementById("start-time").textContent = startTime.toLocaleTimeString();
            sortingStarted = true;
        }
    
        // Calculate range and create buckets
        let max = Math.max(...arr);
        let min = Math.min(...arr);
        const range = max - min;
        let bucketCount = Math.min(arr.length, 20); // Limit bucket count for better visualization
        let buckets = Array(bucketCount).fill().map(() => []);
    
        // Create a color gradient for buckets
        const bucketColors = [];
        for (let i = 0; i < bucketCount; i++) {
            const hue = (i * 360 / bucketCount) % 360;
            bucketColors.push(`hsl(${hue}, 80%, 60%)`);
        }
    
        // Set initial heights of the bars based on the values in the array
        for (let i = 0; i < arr.length; i++) {
            bars[i].style.height = `${arr[i] * scaleFactor}px`;
        }
    
        // Distribute elements into buckets with animation
        for (let i = 0; i < arr.length; i++) {
            await handlePause();
    
            // Calculate bucket index
            const normalizedValue = (arr[i] - min) / range;
            let bucketIndex = Math.floor(normalizedValue * (bucketCount - 1));
    
            // Handle edge case for max value
            if (arr[i] === max) bucketIndex = bucketCount - 1;
    
            buckets[bucketIndex].push(arr[i]);
    
            // Visualize bucket assignment (only color change, no width change)
            await updateBarColor(i, bucketColors[bucketIndex]);
    
            await handleDelay();
        }
    
        // Sort individual buckets and rebuild array
        let index = 0;
        for (let b = 0; b < buckets.length; b++) {
            // Highlight current bucket being processed
            for (let i = 0; i < arr.length; i++) {
                const normalizedValue = (arr[i] - min) / range;
                let bucketIdx = Math.floor(normalizedValue * (bucketCount - 1));
                if (arr[i] === max) bucketIdx = bucketCount - 1;
    
                if (bucketIdx === b) {
                    await updateBarColor(i, COLOR_COMPARE);
                }
            }
            await handleDelay();
    
            // Sort current bucket
            buckets[b].sort((a, b) => a - b);
    
            // Place sorted elements back into array
            for (let value of buckets[b]) {
                await handlePause();
    
                // Only update if value changed position
                if (arr[index] !== value) {
                    arr[index] = value;
    
                    // Update visual representation (height only, no width change)
                    await updateBarHeight(index, value);
                    await updateBarColor(index, COLOR_SWAP);
    
                    await handleDelay();
                }
    
                // Mark as sorted
                await updateBarColor(index, COLOR_SORTED);
                index++;
            }
        }
    
        // Final pass to ensure all are marked sorted
        for (let i = 0; i < arr.length; i++) {
            await updateBarColor(i, COLOR_SORTED);
        }
    
        endSort(arr);
    
        // Helper functions
        async function handlePause() {
            while (sortingPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    
        async function handleDelay(customDelay = animationSpeed) {
            await handlePause();
            return new Promise(resolve => setTimeout(resolve, customDelay));
        }
    }
    
    async function quickSortWithAnimation(arr) {
        // Initialize sorting timer if not already started
        if (!sortingStarted) {
            startTime = new Date();
            document.getElementById("start-time").textContent = startTime.toLocaleTimeString();
            sortingStarted = true;
        }
    
        /**
         * Partitions the array and returns the pivot index
         * @param {number} low - Starting index
         * @param {number} high - Ending index
         * @returns {Promise<number>} - The pivot index
         */
        async function partition(low, high) {
            let pivot = arr[high];
            
            // Highlight pivot element
            await updateBarColor(high, COLOR_PIVOT);
    
            let i = low - 1;
    
            // Traverse through all elements
            for (let j = low; j < high; j++) {
                await updateBarColor(j, COLOR_COMPARE);
    
                if (arr[j] < pivot) {
                    i++;
                    
                    // Swap elements if needed
                    await updateBarColor(i, COLOR_SWAP);
                    await updateBarColor(j, COLOR_SWAP);
    
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    await updateBarHeight(i, arr[i]);
                    await updateBarHeight(j, arr[j]);
                }
    
                await updateBarColor(j, COLOR_DEFAULT);
                if (i >= 0) await updateBarColor(i, COLOR_DEFAULT);
            }
    
            // Swap pivot into correct position
            await updateBarColor(high, COLOR_SWAP);
            await updateBarColor(i + 1, COLOR_SWAP);
    
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            await updateBarHeight(i + 1, arr[i + 1]);
            await updateBarHeight(high, arr[high]);
    
            await updateBarColor(high, COLOR_DEFAULT);
            await updateBarColor(i + 1, COLOR_SORTED);
    
            return i + 1;
        }
    
        /**
         * Recursive quick sort function
         * @param {number} low - Starting index
         * @param {number} high - Ending index
         */
        async function quickSortHelper(low, high) {
            if (low < high) {
                let pi = await partition(low, high);
                await quickSortHelper(low, pi - 1);
                await quickSortHelper(pi + 1, high);
    
                // Mark entire section as sorted
                for (let i = low; i <= high; i++) {
                    await updateBarColor(i, COLOR_SORTED);
                }
            } else if (low === high) {
                // Single element is always sorted
                await updateBarColor(low, COLOR_SORTED);
            }
        }
    
        // Start quicksort
        await quickSortHelper(0, arr.length - 1);
        
        // Finalize the sorting process
        endSort(arr);
    }
    
    async function countingSortWithAnimation(arr) {
        // Initialize sorting timer if not already started
        if (!sortingStarted) {
            startTime = new Date();
            document.getElementById("start-time").textContent = startTime.toLocaleTimeString();
            sortingStarted = true;
        }
    
        // Find range of values
        let min = Math.min(...arr);
        let max = Math.max(...arr);
        let range = max - min + 1;
        let count = Array(range).fill(0);
        let output = Array(arr.length).fill(0);
    
        // Phase 1: Count frequencies with visualization
        for (let i = 0; i < arr.length; i++) {
            await handlePause();
            
            // Highlight current element being counted
            await updateBarColor(i, COLOR_COMPARE);
            await handleDelay(animationSpeed / 2);
    
            const value = arr[i];
            count[value - min]++;
    
            // Visualize count update
            await updateBarColor(i, getCountColor(value, min, max));
            await handleDelay(animationSpeed);
    
            // Reset color
            await updateBarColor(i, COLOR_DEFAULT);
        }
    
        // Visualize count array (optional - could show a separate visualization)
        await visualizeCountArray(count, min, max);
    
        // Phase 2: Calculate cumulative counts
        for (let i = 1; i < range; i++) {
            count[i] += count[i - 1];
            await visualizeCountUpdate(count, i, min); // Optional visualization
        }
    
        // Phase 3: Build output array
        for (let i = arr.length - 1; i >= 0; i--) {
            await handlePause();
    
            const value = arr[i];
            const outputPos = count[value - min] - 1;
    
            // Highlight element being placed
            await updateBarColor(i, COLOR_PIVOT);
            await handleDelay();
    
            output[outputPos] = value;
            count[value - min]--;
    
            // Visualize placement in output
            if (bars[outputPos]) {
                await updateBarColor(outputPos, COLOR_SWAP);
                await handleDelay();
            }
        }
    
        // Phase 4: Animate final sorted array
        for (let i = 0; i < arr.length; i++) {
            await handlePause();
    
            // Only update if value changed
            if (arr[i] !== output[i]) {
                arr[i] = output[i];
    
                // Update visual representation
                await updateBarHeight(i, arr[i]);
                await updateBarColor(i, COLOR_SWAP);
                await handleDelay();
            }
    
            // Mark as sorted
            await updateBarColor(i, COLOR_SORTED);
        }
    
        endSort(arr);
    
        // Helper functions (using global ones)
        function getCountColor(value, min, max) {
            const ratio = (value - min) / (max - min);
            const hue = Math.floor(120 * ratio); // Green to blue gradient
            return `hsl(${hue}, 80%, 60%)`;
        }
    
        async function visualizeCountArray(count, min, max) {
            await handleDelay();
        }
    
        async function visualizeCountUpdate(count, index, min) {
            await handleDelay(animationSpeed / 3);
        }
    
        async function handlePause() {
            while (sortingPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    
        async function handleDelay(customDelay = animationSpeed) {
            await handlePause();
            return new Promise(resolve => setTimeout(resolve, customDelay));
        }
    }
    


    // ================== HELPER FUNCTIONS ================== //

    // ========== Function Called at the End of Sorting ========== //
    function endSort(arr) {
        endTime = new Date();
        document.getElementById("end-time").textContent = endTime.toLocaleTimeString();

        let executionTime = (endTime - startTime) / 1000;
        document.getElementById("time-taken").textContent = executionTime.toFixed(2) + " seconds";

        document.getElementById("sorted-array").textContent = arr.join(", ");

        // Save result to database
        saveSortingResult(storedArray, arr, startTime, endTime, executionTime);
    }

    // Helper function for animation delay
    async function delay() {
        while (sortingPaused) await new Promise(resolve => setTimeout(resolve, 100));
        return new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
    
    // Helper function to update bar color
    async function updateBarColor(index, color) {
        bars[index].style.backgroundColor = color;
        await delay();
    }
    
    // Helper function to update bar height and label
    async function updateBarHeight(index, value) {
        bars[index].style.height = `${value * scaleFactor}px`;
        // Only update label if it exists (for large arrays where labels might be hidden)
        if (bars[index].firstChild) {
            bars[index].firstChild.textContent = value;
        }
        await delay();
    }

    async function highlightRange(start, end, color) {
        for (let x = start; x <= end; x++) {
            await updateBarColor(x, color);
        }
    }
      
    // ========== Save Sorting Result to Backend ========== //

    function saveSortingResult(inputArray, sortedArray, startTime, endTime, executionTime) {
        // Format JS date into MySQL DATETIME format
        const formatTime = (date) => {
            return date.toISOString().slice(0, 19).replace('T', ' ');
        };

        // Prepare data payload - matches the new database schema
        const data = {
            inputArray: JSON.stringify(inputArray),
            sortedArray: JSON.stringify(sortedArray),
            startTime: formatTime(startTime),
            endTime: formatTime(endTime),
            executionTime: executionTime,
            algorithmUsed: selectedAlgorithm.replace('-', ' ')  // e.g. "bubble sort"
        };

        // Send data to server
        fetch("http://localhost/simulator/save_result.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(async response => {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Expected JSON but got: ${text}`);
            }
            return response.json();
        })
        .then(responseData => {
            if (!responseData.success) {
                console.error("Server reported error:", responseData.message);
            }
        })
        .catch(error => {
            console.error("Error saving data:", error.message);
        });
    }
    

    // start button functionality
    startButton.addEventListener("click", function () {
        sortingPaused = false;
        pauseButton.textContent = "Pause";

        if (selectedAlgorithm === "bubble-sort") {
            bubbleSortWithAnimation([...storedArray]);
        }
        else if (selectedAlgorithm === "selection-sort") {
            selectionSortWithAnimation([...storedArray]);
        }
        else if (selectedAlgorithm === "insertion-sort") {
            insertionSortWithAnimation([...storedArray]);
        }
        else if (selectedAlgorithm === "heap-sort") {
            heapSortWithAnimation([...storedArray]);
        }
        else if (selectedAlgorithm === "merge-sort") {
            mergeSortWithAnimation([...storedArray]);
        }
        else if (selectedAlgorithm === "quick-sort") {
            quickSortWithAnimation([...storedArray]);
        }
        else if (selectedAlgorithm === "shell-sort") {
            shellSortWithAnimation([...storedArray]);
        }
        else if (selectedAlgorithm === "tim-sort") {
            timSortWithAnimation([...storedArray]);
        }
        else if (selectedAlgorithm === "counting-sort") {
            countingSortWithAnimation([...storedArray]);
        }
        else if (selectedAlgorithm === "radix-sort") {
            radixSortWithAnimation([...storedArray]);
        }
        else if (selectedAlgorithm === "bucket-sort") {
            bucketSortWithAnimation([...storedArray]);
        }
    });

    // pause button functionality
    pauseButton.addEventListener("click", function () {
        sortingPaused = !sortingPaused;
        pauseButton.textContent = sortingPaused ? "Resume" : "Pause";
    });

    // reset button functionality
    resetButton.addEventListener("click", function () {
        sortingPaused = true;
        sortingStarted = false;
        createBars(storedArray);
        document.getElementById("sorted-array").textContent = "";
        document.getElementById("start-time").textContent = "";
        document.getElementById("end-time").textContent = "";
        document.getElementById("time-taken").textContent = "";
        pauseButton.textContent = "Pause";
    });
});