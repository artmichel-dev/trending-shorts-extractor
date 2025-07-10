// main.js
const API_KEY = 'YOUR-API-KEY'; 
let startTime;
let timeInterval;

// Función para extraer el ID del canal desde la URL
function extractChannelId(url) {
    // Para URLs como: https://www.youtube.com/@username
    const match = url.match(/@([^\/\?]+)/);
    return match ? match[1] : null;
}

// Función para obtener el ID del canal usando el handle/username
async function getChannelIdFromUsername(apiKey, username) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${username}&key=${apiKey}`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            return data.items[0].id;
        }
        
        // Si no funciona con forHandle, intentar con búsqueda
        const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${username}&key=${apiKey}`);
        const searchData = await searchResponse.json();
        
        if (searchData.items && searchData.items.length > 0) {
            return searchData.items[0].snippet.channelId;
        }
        
        throw new Error('Canal no encontrado');
    } catch (error) {
        throw new Error(`Error buscando canal: ${error.message}`);
    }
}

// Función para obtener información del canal
async function getChannelInfo(apiKey, channelId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`);
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
        throw new Error('Canal no encontrado');
    }
    
    return data.items[0];
}

// Función para obtener videos del canal
async function getChannelVideos(apiKey, channelId, maxResults = 50) {
    let allVideos = [];
    let nextPageToken = '';
    let totalFetched = 0;
    
    updateProgress(0, 'Obteniendo lista de videos...');
    
    while (totalFetched < 200 && nextPageToken !== null) { // Límite de 200 videos
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&maxResults=${maxResults}&order=viewCount&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(`Error de API: ${data.error.message}`);
        }
        
        if (!data.items) break;
        
        allVideos = allVideos.concat(data.items);
        totalFetched += data.items.length;
        
        updateProgress(Math.min(30, (totalFetched / 200) * 30), `Videos obtenidos: ${totalFetched}`);
        
        nextPageToken = data.nextPageToken || null;
        
        // Pequeño delay para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return allVideos;
}

// Función para obtener detalles de los videos (incluyendo duración y estadísticas)
async function getVideoDetails(apiKey, videoIds) {
    const videos = [];
    const batchSize = 50; // YouTube API permite hasta 50 IDs por request
    
    for (let i = 0; i < videoIds.length; i += batchSize) {
        const batch = videoIds.slice(i, i + batchSize);
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${batch.join(',')}&key=${apiKey}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(`Error obteniendo detalles: ${data.error.message}`);
        }
        
        if (data.items) {
            videos.push(...data.items);
        }
        
        updateProgress(30 + ((i + batchSize) / videoIds.length) * 40, `Analizando detalles: ${i + batchSize}/${videoIds.length}`);
        
        // Delay para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return videos;
}

// Función para convertir duración ISO 8601 a segundos
function parseDuration(isoDuration) {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
}

// Función para filtrar Shorts (videos <= 60 segundos) con más de 1M de vistas
function filterViralShorts(videos) {
    return videos.filter(video => {
        const duration = parseDuration(video.contentDetails.duration);
        const views = parseInt(video.statistics.viewCount);
        return duration <= 60 && views >= 1000000;
    }).sort((a, b) => parseInt(b.statistics.viewCount) - parseInt(a.statistics.viewCount));
}

function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
}

function updateProgress(percentage, status) {
    document.getElementById('progressBar').style.width = `${percentage}%`;
    document.getElementById('progressText').textContent = `${Math.round(percentage)}%`;
    document.getElementById('progressStatus').innerHTML = `
        <svg class="loading w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        ${status}
    `;
}

function createUrlListItem(video, index) {
    const views = parseInt(video.statistics.viewCount);
    const url = `https://www.youtube.com/shorts/${video.id}`;
    
    return `
        <div class="bg-gray-800/40 border border-gray-700/50 rounded-lg p-4 md:p-5 hover:bg-gray-800/60 hover:border-gray-600/50 transition-all duration-300 backdrop-blur-sm">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                        <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            ${index + 1}
                        </div>
                        <div class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-3 py-1 rounded-full">
                            <span class="text-green-300 text-sm font-semibold">${formatViews(views)} vistas</span>
                        </div>
                    </div>
                    <div class="text-sm text-gray-300 line-clamp-2 leading-relaxed">${video.snippet.title}</div>
                </div>
                <div class="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-3">
                    <div class="bg-gray-900/50 border border-gray-600/50 px-3 py-2 rounded-lg">
                        <code class="text-xs text-gray-300 font-mono break-all">${url}</code>
                    </div>
                    <button 
                        onclick="copyUrl('${url}')" 
                        class="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap"
                    >
                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                        Copiar
                    </button>
                </div>
            </div>
        </div>
    `;
}

function copyUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        const button = event.target;
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            ¡Copiado!
        `;
        button.className = 'bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.className = 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap';
        }, 2000);
    });
}

function downloadListFile(videos, channelName) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const urls = videos.map(video => `https://www.youtube.com/shorts/${video.id}`);
    
    const header = `# Lista de YouTube Shorts Virales (+1M vistas)\n# Canal: ${channelName}\n# Generado: ${timestamp}\n# Total: ${urls.length} videos\n\n`;
    const content = header + urls.join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youtube.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timeElapsed').textContent = `${elapsed}s`;
}

function showError(message) {
    document.getElementById('errorSection').classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('progressSection').classList.add('hidden');
}

function hideError() {
    document.getElementById('errorSection').classList.add('hidden');
}

async function analyzeChannel() {
    const channelUrl = document.getElementById('channelInput').value.trim();
    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const loadingText = document.getElementById('loadingText');

    // Validaciones
    if (!channelUrl) {
        showError('Por favor, ingresa la URL del canal.');
        return;
    }

    const username = extractChannelId(channelUrl);
    if (!username) {
        showError('URL del canal inválida. Usa el formato: https://www.youtube.com/@username');
        return;
    }

    hideError();

    // UI Loading
    generateBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    document.getElementById('progressSection').classList.remove('hidden');
    
    startTime = Date.now();
    timeInterval = setInterval(updateTimer, 1000);

    try {
        // 1. Obtener Channel ID
        loadingText.textContent = 'Buscando canal...';
        updateProgress(5, 'Buscando canal...');
        const channelId = await getChannelIdFromUsername(API_KEY, username);

        // 2. Obtener info del canal
        loadingText.textContent = 'Obteniendo información...';
        updateProgress(10, 'Obteniendo información del canal...');
        const channelInfo = await getChannelInfo(API_KEY, channelId);

        // 3. Obtener videos
        loadingText.textContent = 'Obteniendo videos...';
        const videos = await getChannelVideos(API_KEY, channelId);
        
        document.getElementById('totalAnalyzed').textContent = videos.length;

        // 4. Obtener detalles de videos
        loadingText.textContent = 'Analizando detalles...';
        const videoIds = videos.map(video => video.id.videoId);
        const videoDetails = await getVideoDetails(API_KEY, videoIds);

        // 5. Filtrar shorts virales
        loadingText.textContent = 'Filtrando shorts virales...';
        updateProgress(80, 'Filtrando shorts virales...');
        const viralShorts = filterViralShorts(videoDetails);

        updateProgress(100, 'Análisis completado ✨');

        // Mostrar resultados
        document.getElementById('channelInfo').innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div class="flex items-center mb-2 md:mb-0">
                    <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-lg mr-3">
                        🎬
                    </div>
                    <div>
                        <div class="font-bold text-white text-lg">${channelInfo.snippet.title}</div>
                        <div class="text-sm text-gray-400">${formatViews(parseInt(channelInfo.statistics.subscriberCount))} suscriptores</div>
                    </div>
                </div>
                <div class="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 px-4 py-2 rounded-lg">
                    <div class="text-xs text-purple-300">Videos totales</div>
                    <div class="text-lg font-bold text-purple-200">${formatViews(parseInt(channelInfo.statistics.videoCount))}</div>
                </div>
            </div>
        `;

        document.getElementById('viralCount').textContent = viralShorts.length;

        // Crear lista de URLs
        const urlsList = document.getElementById('urlsList');
        if (viralShorts.length > 0) {
            urlsList.innerHTML = viralShorts.map((video, index) => 
                createUrlListItem(video, index)
            ).join('');
        } else {
            urlsList.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center text-2xl mx-auto mb-4">
                        😔
                    </div>
                    <h3 class="text-xl font-semibold text-gray-300 mb-2">No se encontraron shorts virales</h3>
                    <p class="text-gray-400">Este canal no tiene videos cortos con más de 1 millón de visualizaciones.</p>
                </div>
            `;
        }

        // Botón de descarga
        const downloadBtn = document.getElementById('downloadBtn');
        if (viralShorts.length > 0) {
            downloadBtn.classList.remove('hidden');
            downloadBtn.onclick = () => downloadListFile(viralShorts, channelInfo.snippet.title);
        }

        // Mostrar resultados
        document.getElementById('resultsSection').classList.remove('hidden');
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        showError(`Error: ${error.message}`);
        console.error(error);
    } finally {
        clearInterval(timeInterval);
        generateBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        document.getElementById('progressSection').classList.add('hidden');
    }
}

// Event listeners
document.getElementById('generateBtn').addEventListener('click', analyzeChannel);

document.getElementById('channelInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        analyzeChannel();
    }
});

// Auto-focus
document.getElementById('channelInput').focus(); 