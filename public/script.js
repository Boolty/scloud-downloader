document.addEventListener('DOMContentLoaded', function() {
    // Dark mode management
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const body = document.body;
    
    // Load dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        body.setAttribute('data-theme', 'dark');
        darkModeIcon.textContent = '☀️';
    }
    
    // Dark mode toggle
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            darkModeIcon.textContent = '🌙';
            localStorage.setItem('darkMode', 'false');
        } else {
            body.setAttribute('data-theme', 'dark');
            darkModeIcon.textContent = '☀️';
            localStorage.setItem('darkMode', 'true');
        }
    });

    // Queue management
    let downloadQueue = JSON.parse(localStorage.getItem('downloadQueue') || '[]');
    let queueIdCounter = parseInt(localStorage.getItem('queueIdCounter') || '0');

    // DOM elements
    const addToQueueForm = document.getElementById('addToQueueForm');
    const urlInput = document.getElementById('urlInput');
    const addToQueueBtn = document.getElementById('addToQueueBtn');
    const queueList = document.getElementById('queueList');
    const queueCount = document.getElementById('queueCount');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const downloadAllText = document.getElementById('downloadAllText');
    const downloadAllSpinner = document.getElementById('downloadAllSpinner');
    const downloadCompletedBtn = document.getElementById('downloadCompletedBtn');
    const downloadCompletedText = document.getElementById('downloadCompletedText');
    const clearQueueBtn = document.getElementById('clearQueueBtn');
    const status = document.getElementById('status');
    const downloadLinks = document.getElementById('downloadLinks');

    // Initialize
    updateQueueDisplay();
    updateDownloadAllButton();
    updateDownloadCompletedButton();

    // Add to queue form
    addToQueueForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const url = urlInput.value.trim();
        if (!url) {
            showStatus('Bitte gib eine gültige SoundCloud URL ein.', 'error');
            return;
        }

        if (!url.includes('soundcloud.com')) {
            showStatus('Bitte gib eine gültige SoundCloud URL ein.', 'error');
            return;
        }

        // Check for duplicates
        if (downloadQueue.some(item => item.url === url)) {
            showStatus('Diese URL ist bereits in der Warteschlange.', 'error');
            return;
        }

        // Show loading state
        showStatus('📡 Lade Track-Informationen...', 'info');
        
        // Get track info first
        let trackInfo = null;
        try {
            const infoResponse = await fetch('/api/track-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            });
            
            if (infoResponse.ok) {
                trackInfo = await infoResponse.json();
            }
        } catch (error) {
            console.log('Could not fetch track info:', error);
        }

        // Add to queue
        const queueItem = {
            id: ++queueIdCounter,
            url: url,
            status: 'pending',
            title: trackInfo ? trackInfo.fullTitle : null,
            artist: trackInfo ? trackInfo.uploader : null,
            songTitle: trackInfo ? trackInfo.title : null,
            duration: trackInfo ? trackInfo.duration : null,
            filename: null,
            error: null
        };

        downloadQueue.push(queueItem);
        saveQueue();
        updateQueueDisplay();
        updateDownloadAllButton();
        updateDownloadCompletedButton();
        
        urlInput.value = '';
        const trackName = trackInfo ? trackInfo.fullTitle : 'Track';
        showStatus(`✅ "${trackName}" zur Warteschlange hinzugefügt!`, 'success');
    });

    // Download all button
    downloadAllBtn.addEventListener('click', async function() {
        const pendingItems = downloadQueue.filter(item => item.status === 'pending');
        if (pendingItems.length === 0) return;

        setDownloadAllLoading(true);
        hideStatus();

        for (const item of pendingItems) {
            await downloadSingleItem(item);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay between downloads
        }

        setDownloadAllLoading(false);
        showStatus(`✅ Alle Downloads abgeschlossen!`, 'success');
        updateDownloadCompletedButton();
    });

    // Clear queue button
    clearQueueBtn.addEventListener('click', function() {
        if (confirm('Möchtest du wirklich alle Items aus der Warteschlange entfernen?')) {
            downloadQueue = [];
            saveQueue();
            updateQueueDisplay();
            updateDownloadAllButton();
            updateDownloadCompletedButton();
            downloadLinks.innerHTML = '';
            showStatus('Warteschlange geleert.', 'info');
        }
    });

    // Download single item with progress
    async function downloadSingleItem(item) {
        item.status = 'downloading';
        item.progress = 0;
        item.progressMessage = 'Starte Download...';
        updateQueueDisplay();

        try {
            const encodedUrl = encodeURIComponent(item.url);
            const eventSource = new EventSource(`/api/download-progress/${encodedUrl}`);

            eventSource.onmessage = function(event) {
                const data = JSON.parse(event.data);
                
                if (data.progress !== undefined) {
                    item.progress = data.progress;
                    item.progressMessage = data.message;
                    updateQueueDisplay();
                }

                if (data.success !== undefined) {
                    eventSource.close();
                    
                    if (data.success) {
                        item.status = 'completed';
                        item.title = data.title;
                        item.filename = data.filename;
                        item.progress = 100;
                        item.progressMessage = 'Abgeschlossen!';
                        addDownloadLink(data.filename, data.title);
                    } else {
                        item.status = 'error';
                        item.error = data.error;
                        item.progress = 0;
                        item.progressMessage = 'Fehler beim Download';
                    }
                    
                    saveQueue();
                    updateQueueDisplay();
                    updateDownloadAllButton();
                    updateDownloadCompletedButton();
                }
            };

            eventSource.onerror = function() {
                eventSource.close();
                item.status = 'error';
                item.error = 'Verbindungsfehler';
                item.progress = 0;
                item.progressMessage = 'Verbindung unterbrochen';
                saveQueue();
                updateQueueDisplay();
                updateDownloadAllButton();
                updateDownloadCompletedButton();
            };

        } catch (error) {
            item.status = 'error';
            item.error = 'Netzwerkfehler';
            item.progress = 0;
            item.progressMessage = 'Fehler beim Download';
            saveQueue();
            updateQueueDisplay();
            updateDownloadAllButton();
            updateDownloadCompletedButton();
        }
    }

    // Remove item from queue
    function removeFromQueue(itemId) {
        downloadQueue = downloadQueue.filter(item => item.id !== itemId);
        saveQueue();
        updateQueueDisplay();
        updateDownloadAllButton();
        updateDownloadCompletedButton();
    }

    // Update queue display
    function updateQueueDisplay() {
        queueCount.textContent = downloadQueue.length;

        if (downloadQueue.length === 0) {
            queueList.innerHTML = '<div class="empty-queue">Keine URLs in der Warteschlange</div>';
            return;
        }

        queueList.innerHTML = downloadQueue.map(item => `
            <div class="queue-item ${item.status}" data-id="${item.id}">
                <div class="queue-item-info">
                    ${item.title ? `
                        <div class="queue-item-title">${item.title}</div>
                        <div class="queue-item-url">${item.url}</div>
                    ` : `
                        <div class="queue-item-url">${item.url}</div>
                    `}
                    <div class="queue-item-status ${item.status}">
                        ${getStatusText(item)}
                    </div>
                    ${item.status === 'downloading' && item.progress !== undefined ? `
                        <div class="progress-bar">
                            <div class="progress-bar-fill" style="width: ${item.progress}%"></div>
                        </div>
                        <div class="progress-text">${item.progress}% - ${item.progressMessage || ''}</div>
                    ` : ''}
                </div>
                <div class="queue-item-actions">
                    ${item.status === 'pending' ? `
                        <button class="download-single-btn" onclick="downloadSingle(${item.id})">
                            Download
                        </button>
                    ` : ''}
                    <button class="remove-btn" onclick="removeItem(${item.id})">
                        Entfernen
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Get status text
    function getStatusText(item) {
        switch (item.status) {
            case 'pending':
                return 'Wartend';
            case 'downloading':
                return item.progressMessage || '📥 Wird heruntergeladen...';
            case 'completed':
                return `✅ Abgeschlossen: ${item.title}`;
            case 'error':
                return `❌ Fehler: ${item.error}`;
            default:
                return 'Unbekannt';
        }
    }

    // Update download all button
    function updateDownloadAllButton() {
        const pendingCount = downloadQueue.filter(item => item.status === 'pending').length;
        downloadAllBtn.disabled = pendingCount === 0;
        downloadAllText.textContent = pendingCount > 0 ? `Alle herunterladen (${pendingCount})` : 'Alle herunterladen';
    }

    // Set download all loading state
    function setDownloadAllLoading(loading) {
        downloadAllBtn.disabled = loading;
        if (loading) {
            downloadAllText.textContent = 'Wird heruntergeladen...';
            downloadAllSpinner.classList.remove('hidden');
        } else {
            downloadAllSpinner.classList.add('hidden');
            updateDownloadAllButton();
        }
    }

    // Show status message
    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        status.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            status.classList.add('hidden');
        }, 5000);
    }

    // Hide status
    function hideStatus() {
        status.classList.add('hidden');
    }

    // Add download link
    function addDownloadLink(filename, title) {
        const linkElement = document.createElement('a');
        linkElement.href = `/api/download/${filename}`;
        linkElement.download = `${title}.mp3`;
        linkElement.className = 'download-link';
        linkElement.textContent = `📥 ${title}.mp3`;
        downloadLinks.appendChild(linkElement);
    }

    // Download completed files button
    downloadCompletedBtn.addEventListener('click', function() {
        const completedItems = downloadQueue.filter(item => item.status === 'completed' && item.filename);
        
        completedItems.forEach(item => {
            const link = document.createElement('a');
            link.href = `/api/download/${item.filename}`;
            link.download = `${item.title}.mp3`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        
        showStatus(`${completedItems.length} Dateien werden heruntergeladen!`, 'success');
    });

    // Update download completed button
    function updateDownloadCompletedButton() {
        const completedCount = downloadQueue.filter(item => item.status === 'completed').length;
        downloadCompletedBtn.disabled = completedCount === 0;
        downloadCompletedText.textContent = completedCount > 0 ? `Fertige downloaden (${completedCount})` : 'Fertige downloaden';
    }

    // Save queue to localStorage
    function saveQueue() {
        localStorage.setItem('downloadQueue', JSON.stringify(downloadQueue));
        localStorage.setItem('queueIdCounter', queueIdCounter.toString());
    }

    // Global functions for onclick handlers
    window.downloadSingle = async function(itemId) {
        const item = downloadQueue.find(i => i.id === itemId);
        if (item) {
            await downloadSingleItem(item);
        }
    };

    window.removeItem = function(itemId) {
        removeFromQueue(itemId);
    };
});