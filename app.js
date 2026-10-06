const APY_KEY = 'bbe5b1a42479aeb0abba2f9303117e67';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// 1. Elementos del DOM
const moviesgrid = document.getElementById('movie-grid');
const loadingDiv = document.getElementById('loading');
const erroDiv = document.getElementById('error');
const errorMessage = document.getElementById('error-message');

// 2. Funciones de interfaz (Loading y Errores)
const mostrarLoading = () => {
    loadingDiv.style.display = 'flex';
    erroDiv.style.display = 'none';
    moviesgrid.innerHTML = '';
};

const ocultarLoading = () => {
    loadingDiv.style.display = 'none';
};

const mostrarError = (mensaje) => {
    ocultarLoading();
    errorMessage.textContent = mensaje; // Modifica el texto del HTML, sin romper la constante
    erroDiv.style.display = 'flex';
    moviesgrid.innerHTML = '';
};

// 3. Petición a la API
const obtenerPeliculas = async () => {
    const url = `${BASE_URL}/movie/popular?api_key=${APY_KEY}&language=es-ES`;
    const respuesta = await fetch(url);

    // Valida si la respuesta HTTP tuvo éxito (200 OK)
    if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    return datos.results;
};

// 4. Plantilla de tarjeta de película
const crearTarjeta = (pelicula) => {
    const { title, release_date, vote_average, poster_path } = pelicula;
    const año = release_date ? release_date.split('-')[0] : 'N/A';
    const imagen = poster_path ? `${IMAGE_URL}${poster_path}` : '';
    const rating = vote_average ? vote_average.toFixed(1) : 'N/A';

    return `
        <article class="movie-card">
            <div class="movie-card__poster">
                <img class="movie-card__image" src="${imagen}" alt="${title}">
                <span class="movie-card__rating">${rating}</span>
            </div>
            <div class="movie-card__content">
                <h3 class="movie-card__title">${title}</h3>
                <p class="movie-card__year">${año}</p>
            </div>
        </article>
    `;
};

// 5. Función principal de inicio
const iniciar = async () => {
    console.log('Mostrar pelicula');
    mostrarLoading();

    try {
        const peliculas = await obtenerPeliculas();
        console.log(`${peliculas.length} peliculas obtenidas`);
        ocultarLoading();

        // Renderiza usando crearTarjeta en lugar de primera
        moviesgrid.innerHTML = peliculas.map(crearTarjeta).join('');
        console.log('Películas renderizadas correctamente');  

    } catch (error) {
        console.log('Error', error);
        let mensaje = 'No se pudo cargar peliculas';

        if (error.message.includes('401')) {
            mensaje = 'API Key invalida, verifica tu clave';
        } else if (error.message.includes('429')) {
            mensaje = 'Existen demasiadas peticiones. Espera un momento';
        } else if (error.message.includes('Fetch') || error.name === 'TypeError') {
            mensaje = 'Error de red';
        }

        mostrarError(mensaje); // Pasa el mensaje formateado a la función
    }
};

// 6. Ejecución
iniciar();