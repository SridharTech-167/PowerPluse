document.addEventListener('DOMContentLoaded', () => {

    const outageGrid = document.getElementById('outageGrid');
    const searchForm = document.getElementById('searchForm');
    const areaSearchInput = document.getElementById('areaSearchInput');
    const logoutBtn = document.getElementById('logoutBtn');

    let outages = [];

    // Format database date/time
    function formatDateTime(dateTime) {
        if (!dateTime) {
            return "Restored";
        }

        const date = new Date(dateTime);

        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    // Render outage cards
    function renderOutages(data) {
        outageGrid.innerHTML = '';

        if (data.length === 0) {
            outageGrid.innerHTML = `
                <div class="no-results">
                    <h4>No outage updates found for this search.</h4>
                    <p>Try searching for another area name.</p>
                </div>
            `;
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'outage-card';

            // Determine Status CSS Class
            let statusClass = '';

            if (item.status === 'Power Outage') {
                statusClass = 'status-outage';
            } else if (item.status === 'Work in Progress') {
                statusClass = 'status-progress';
            } else if (item.status === 'Power Restored') {
                statusClass = 'status-restored';
            }

            card.innerHTML = `
                <div class="card-header">
                    <span class="area-name">${item.area_name}</span>
                    <span class="status-badge ${statusClass}">
                        ${item.status}
                    </span>
                </div>

                <div class="card-body">
                    <p>
                        <strong>Reason:</strong>
                        ${item.reason}
                    </p>

                    <p>
                        <strong>Start Time:</strong>
                        ${formatDateTime(item.start_time)}
                    </p>

                    <p>
                        <strong>Estimated Restoration:</strong>
                        ${formatDateTime(item.estimated_restore_time)}
                    </p>
                </div>
            `;

            outageGrid.appendChild(card);
        });
    }

    // Get outage data from Flask
    async function loadOutages() {
        try {
            const response = await fetch('http://127.0.0.1:5000/outages');

            if (!response.ok) {
                throw new Error('Failed to fetch outage data');
            }

            outages = await response.json();

            renderOutages(outages);

        } catch (error) {
            console.error('Error loading outages:', error);

            outageGrid.innerHTML = `
                <div class="no-results">
                    <h4>Unable to load outage updates.</h4>
                    <p>Please make sure the PowerPulse server is running.</p>
                </div>
            `;
        }
    }

    // Load outage data when dashboard opens
    loadOutages();

    // Search Interaction
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const query = areaSearchInput.value.trim().toLowerCase();

        const filteredData = outages.filter(item =>
            item.area_name.toLowerCase().includes(query)
        );

        renderOutages(filteredData);
    });

    // Reset list when search input is cleared
    areaSearchInput.addEventListener('input', (e) => {
        if (e.target.value.trim() === '') {
            renderOutages(outages);
        }
    });

    // Logout Interaction
    logoutBtn.addEventListener('click', () => {
        const confirmLogout = confirm(
            "Are you sure you want to log out of PowerPulse?"
        );

        if (confirmLogout) {
            window.location.href = "index.html";
        }
    });

});