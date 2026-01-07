





document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const logsTableBody = document.querySelector('tbody');
    const algorithmCardsContainer = document.querySelector('.row-cols-1');
    const lastUpdatedSpan = document.getElementById('last-updated');
    const searchInput = document.querySelector('input[type="text"]');
    const algorithmFilter = document.querySelector('select');
    const pagination = document.querySelector('.pagination');
    
    // Current page state
    let currentPage = 1;
    let totalPages = 1;
    let currentFilter = 'all';
    let currentSearch = '';
    
    // Initialize the page
    updateLastUpdated();
    fetchAlgorithmCounts();
    fetchLogs();
    
    // Set up event listeners
    searchInput.addEventListener('input', debounce(() => {
        currentSearch = searchInput.value;
        currentPage = 1;
        fetchLogs();
    }, 300));
    
    algorithmFilter.addEventListener('change', () => {
        currentFilter = algorithmFilter.value;
        currentPage = 1;
        fetchLogs();
    });
    
    // Function to fetch algorithm counts
    async function fetchAlgorithmCounts() {
        try {
            const response = await fetch('../logs.php?action=counts');
            if (!response.ok) throw new Error('Network response was not ok');
            const counts = await response.json();
            
            // Update algorithm cards with real data
            algorithmCardsContainer.innerHTML = counts.map(alg => `
                <div class="col">
                    <div class="card algorithm-card h-100">
                        <div class="card-body">
                            <h5 class="card-title d-flex justify-content-between align-items-center">
                                <span><i class="bi ${getAlgorithmIcon(alg.algorithm)}"></i> ${alg.algorithm}</span>
                                <span class="badge bg-primary rounded-pill">${alg.count}</span>
                            </h5>
                            <p class="card-text text-muted">${getAlgorithmDescription(alg.algorithm)}</p>
                        </div>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error fetching algorithm counts:', error);
            showError('Failed to load algorithm statistics');
        }
    }
    
    // Function to fetch logs
    async function fetchLogs() {
        try {
            let url = `../logs.php?page=${currentPage}`;
            if (currentFilter !== 'all') url += `&algorithm=${encodeURIComponent(currentFilter)}`;
            if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            // Update logs table
            logsTableBody.innerHTML = data.logs.map(log => `
                <tr class="log-entry">
                    <td>${log.resultID}</td>
                    <td><span class="badge ${getAlgorithmBadgeClass(log.algorithmUsed)}">${log.algorithmUsed}</span></td>
                    <td>${JSON.parse(log.inputArray).length}</td>
                    <td><div class="array-display">${formatArray(log.inputArray)}</div></td>
                    <td><div class="array-display">${formatArray(log.sortedArray)}</div></td>
                    <td>${formatDateTime(log.startTime)}</td>
                    <td>${formatDateTime(log.endTime)}</td>
                    <td class="execution-time">${log.executionTime.toFixed(2)}s</td>
                </tr>
            `).join('');
            
            // Update pagination
            totalPages = data.pages;
            updatePagination();
            
        } catch (error) {
            console.error('Error fetching logs:', error);
            showError('Failed to load sorting logs');
        }
    }
    
    // Helper functions
    function getAlgorithmIcon(algorithm) {
        const icons = {
            'Bubble Sort': 'bi-sort-down text-info',
            'Counting Sort': 'bi-123 text-primary',
            'Heap Sort': 'bi-diagram-3-fill text-warning',
            'Insertion Sort': 'bi-arrow-down-up text-secondary',
            'Merge Sort': 'bi-arrow-merge text-success',
            'quick sort': 'bi-lightning-fill text-danger',
            'Radix Sort': 'bi-sort-numeric-down text-info',
            'Selection Sort': 'bi-funnel-fill text-dark',
            'Bucket Sort': 'bi-collection text-primary',
            'Shell Sort': 'bi-layers-half text-success',
            'Tim Sort': 'bi-clock-history text-warning'
        };
        return icons[algorithm] || 'bi-question-circle';
    }
    
    function getAlgorithmDescription(algorithm) {
        const descriptions = {
            'Bubble Sort': 'Simple comparison-based algorithm with O(n²) time complexity.',
            'Counting Sort': 'Integer sorting algorithm with O(n+k) time complexity (k is the range of input).',
            'Heap Sort': 'Comparison-based algorithm that uses a binary heap data structure with O(n log n) time complexity.',
            'Insertion Sort': 'Builds the final sorted array one item at a time with O(n²) time complexity.',
            'Merge Sort': 'Stable, comparison-based, divide and conquer algorithm with O(n log n) time complexity.',
            'quick sort': 'Efficient divide-and-conquer algorithm with O(n log n) average performance.',
            'Radix Sort': 'Non-comparative integer sorting algorithm with O(nk) time complexity (k is the number of digits).',
            'Selection Sort': 'In-place comparison-based algorithm with O(n²) time complexity.',
            'Bucket Sort': 'Distribution sort that works by distributing elements into buckets and sorting them individually.',
            'Shell Sort': 'Generalization of insertion sort with improved average-case time complexity.',
            'Tim Sort': 'Hybrid stable sorting algorithm derived from merge sort and insertion sort.'
        };
        return descriptions[algorithm] || 'A sorting algorithm.';
    }
    
    function getAlgorithmBadgeClass(algorithm) {

        const classes = {
            'Bubble Sort': 'bg-info',
            'Counting Sort': 'bg-primary',
            'Heap Sort': 'bg-warning text-dark',
            'Insertion Sort': 'bg-secondary',
            'Merge Sort': 'bg-success',
            'quick-sort': 'bg-danger',
            'Radix Sort': 'bg-info text-dark',
            'Selection Sort': 'bg-dark text-white',
            'Bucket Sort': 'bg-primary text-white',
            'shell sort': 'bg-success text-white',
            'Tim Sort': 'bg-warning text-dark'
        };
        return classes[algorithm] || 'bg-dark';
    }
    
    function formatDateTime(datetime) {
        if (!datetime) return 'N/A';
        const date = new Date(datetime);
        return date.toLocaleString();
    }
    
    function formatArray(arrayJson) {
        try {
            const arr = JSON.parse(arrayJson);
            return `[${arr.join(', ')}]`;
        } catch (e) {
            return arrayJson; // Return as-is if not valid JSON
        }
    }
    
    function updatePagination() {
        pagination.innerHTML = `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Previous</a>
            </li>
            ${generatePaginationItems()}
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Next</a>
            </li>
        `;
    }
    
    function generatePaginationItems() {
        let items = '';
        const maxVisiblePages = 5;
        let startPage, endPage;
        
        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
            const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
            
            if (currentPage <= maxPagesBeforeCurrent) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - maxPagesBeforeCurrent;
                endPage = currentPage + maxPagesAfterCurrent;
            }
        }
        
        // Add first page and ellipsis if needed
        if (startPage > 1) {
            items += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="changePage(1); return false;">1</a>
                </li>
                ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            `;
        }
        
        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            items += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `;
        }
        
        // Add last page and ellipsis if needed
        if (endPage < totalPages) {
            items += `
                ${endPage < totalPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
                <li class="page-item">
                    <a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a>
                </li>
            `;
        }
        
        return items;
    }
    
    function changePage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        fetchLogs();
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
    
    function updateLastUpdated() {
        lastUpdatedSpan.textContent = new Date().toLocaleString();
        setTimeout(updateLastUpdated, 60000); // Update every minute
    }
    
    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }
    
    function showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.role = 'alert';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('main.container');
        container.insertBefore(alert, container.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    }
    
    // Make changePage available globally
    window.changePage = changePage;
    
    // Initialize real-time updates if needed
    initializeRealTimeUpdates();
    
    function initializeRealTimeUpdates() {
        // You can implement WebSocket or SSE here when needed
        // For now, we'll just refresh every 30 seconds
        setInterval(() => {
            fetchAlgorithmCounts();
            fetchLogs();
        }, 30000);
    }




    
});