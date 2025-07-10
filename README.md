# 🔥 Extractor de YouTube Shorts Virales

Una aplicación web moderna que analiza canales de YouTube para encontrar y extraer URLs de shorts con más de 1 millón de visualizaciones, ordenados por popularidad.

![Extractor de Shorts Virales](https://img.shields.io/badge/YouTube-Shorts%20Extractor-red?style=for-the-badge&logo=youtube)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Características

- **🎯 Análisis Completo**: Escanea hasta 200 videos de cualquier canal de YouTube
- **📊 Filtrado Inteligente**: Identifica automáticamente shorts (≤60 segundos) con +1M de vistas
- **📈 Ordenamiento por Popularidad**: Organiza los resultados por número de visualizaciones
- **💾 Exportación de Datos**: Descarga la lista completa en formato `.txt`
- **📱 Diseño Responsivo**: Interfaz moderna que funciona en todos los dispositivos
- **⚡ Progreso en Tiempo Real**: Seguimiento visual del análisis con barras de progreso
- **🎨 UI Moderna**: Diseño glassmorphism con animaciones fluidas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Estilos**: Tailwind CSS
- **API**: YouTube Data API v3
- **Fuentes**: Google Fonts (Inter)
- **Animaciones**: CSS3 Keyframes

## 📋 Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet
- API Key de YouTube Data API v3

## ⚙️ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/youtube-shorts-extractor.git
cd youtube-shorts-extractor
```

### 2. Obtener API Key de YouTube
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la YouTube Data API v3
4. Crea credenciales (API Key)
5. Restringe la API Key solo a YouTube Data API v3

### 3. Configurar la API Key
Abre `index.html` y reemplaza la API Key en la línea 261:
```javascript
const API_KEY = 'TU_API_KEY_AQUI'; 
```

### 4. Ejecutar la Aplicación
- Opción 1: Abrir `index.html` directamente en el navegador
- Opción 2: Usar un servidor local:
```bash
# Con Python
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Con Live Server (VS Code Extension)
```

## 🎯 Uso

### Paso 1: Ingresar URL del Canal
```
https://www.youtube.com/@BuenosMemes
https://www.youtube.com/@MrBeast
https://www.youtube.com/@usuario
```

### Paso 2: Análisis Automático
La aplicación realizará automáticamente:
1. ✅ Búsqueda del canal
2. ✅ Extracción de información del canal
3. ✅ Obtención de lista de videos (hasta 200)
4. ✅ Análisis de duración y estadísticas
5. ✅ Filtrado de shorts virales (+1M vistas)
6. ✅ Ordenamiento por popularidad

### Paso 3: Resultados
- **📊 Estadísticas**: Total de shorts virales encontrados
- **🔗 Lista de URLs**: URLs directas a cada short viral
- **📄 Descarga**: Archivo `youtube.txt` con todas las URLs

## 📊 Métricas y Estadísticas

La aplicación muestra:
- **🚀 Shorts Virales**: Cantidad de videos con +1M de vistas
- **📹 Videos Analizados**: Total de videos procesados
- **⏱️ Tiempo**: Duración del análisis
- **👥 Información del Canal**: Suscriptores y videos totales

## 🎨 Características de la UI

- **Glassmorphism Design**: Efectos de cristal moderno
- **Animaciones Fluidas**: Transiciones suaves y micro-interacciones
- **Gradientes Dinámicos**: Fondos degradados vibrantes
- **Indicadores de Progreso**: Barras de progreso con efectos shimmer
- **Responsive Design**: Adaptable a móviles, tablets y desktop
- **Copy to Clipboard**: Función para copiar URLs individualmente

## 🔧 Estructura del Proyecto

```
youtube-shorts-extractor/
│
├── index.html              # Aplicación principal
├── README.md              # Documentación
└── assets/                # (Opcional) Recursos adicionales
    ├── images/
    └── icons/
```

## 📝 Limitaciones de la API

- **Cuota diaria**: 10,000 unidades por día (gratuita)
- **Costo por búsqueda**: ~100 unidades por análisis completo
- **Límite de resultados**: Máximo 200 videos por canal
- **Rate limiting**: Delays automáticos para evitar límites

## 🔍 Filtros Aplicados

Los shorts virales deben cumplir:
- ✅ **Duración**: ≤ 60 segundos
- ✅ **Visualizaciones**: ≥ 1,000,000 vistas
- ✅ **Tipo**: Video (no transmisiones en vivo)
- ✅ **Ordenamiento**: Por número de vistas (descendente)

## 🚨 Solución de Problemas

### Error: "Canal no encontrado"
- Verificar que la URL sea correcta
- Usar el formato: `https://www.youtube.com/@username`
- Comprobar que el canal sea público

### Error: "Error de API"
- Verificar que la API Key sea válida
- Comprobar que YouTube Data API v3 esté habilitada
- Revisar la cuota de la API

### Sin resultados
- El canal puede no tener shorts con +1M de vistas
- Probar con canales más populares
- Verificar que los videos sean públicos

## 🤝 Contribuciones

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**ArtMichel**
- Website: [artmichel.com.mx](https://www.artmichel.com.mx)
- GitHub: [@artmichel-dev](https://github.com/artmichel-dev)

## 🙏 Agradecimientos

- YouTube Data API v3 por proporcionar los datos
- Tailwind CSS por el framework de estilos
- Google Fonts por la tipografía Inter
- Comunidad de desarrolladores por el feedback

## 📈 Roadmap

- [ ] Soporte para múltiples canales simultáneos
- [ ] Filtros personalizables de visualizaciones
- [ ] Exportación en múltiples formatos (CSV, JSON)
- [ ] Análisis de tendencias temporales
- [ ] Dashboard con métricas avanzadas
- [ ] API REST para integración externa

---

⭐ **¡No olvides dar una estrella si este proyecto te fue útil!** ⭐
