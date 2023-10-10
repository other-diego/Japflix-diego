document.addEventListener('DOMContentLoaded', function () {
  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
      localStorage.setItem("Peli", JSON.stringify(data));
      mostrarPeliculas(data);
    })
    .catch(error => console.error('Error:', error));
});

function mostrarPeliculas(peliculas) {
  const resultadoContainer = document.getElementById('lista');
  resultadoContainer.innerHTML = '';

  peliculas.forEach(pelicula => {
    const estrellas = '⭐'.repeat(Math.round(pelicula.vote_average / 2));
    const peliculaItem = document.createElement('li');
    peliculaItem.classList.add('list-group-item');
    peliculaItem.dataset.id = pelicula.id;
    peliculaItem.innerHTML = `
        <h3>${pelicula.title}</h3>
        <p>${pelicula.tagline}</p>
        <p>Voto: ${estrellas}</p>
    `;
    resultadoContainer.appendChild(peliculaItem);

    peliculaItem.addEventListener('click', () => mostrarDetallePelicula(pelicula));
  });
}

function mostrarDetallePelicula(pelicula) {
  const detalleTitle = document.getElementById('detalleTitle');
  const detalleOverview = document.getElementById('detalleOverview');
  const detalleGenres = document.getElementById('detalleGenres');
  const detalleInfoAdicional = document.getElementById('detalleInfoAdicional');

  detalleTitle.textContent = pelicula.title;
  detalleOverview.textContent = pelicula.overview;
  detalleGenres.textContent = `Géneros: ${pelicula.genres.map(genre => genre.name).join(', ')}`;

  const botonDesplegable = document.createElement('button');
  botonDesplegable.textContent = 'Ver información adicional';
  botonDesplegable.className = 'btn btn-secondary mt-3';
  botonDesplegable.setAttribute('data-bs-toggle', 'collapse');
  botonDesplegable.setAttribute('data-bs-target', '#detalleAdicional');
  detalleInfoAdicional.innerHTML = '';
  detalleInfoAdicional.appendChild(botonDesplegable);

  const contenidoDesplegable = document.createElement('div');
  contenidoDesplegable.className = 'collapse';
  contenidoDesplegable.id = 'detalleAdicional';
  
  const infoAnio = document.createElement('p');
  infoAnio.textContent = `Año de lanzamiento: ${pelicula.release_date.split('-')[0]}`;
  
  const infoDuracion = document.createElement('p');
  infoDuracion.textContent = `Duración: ${pelicula.runtime} minutos`;
  
  const infoPresupuesto = document.createElement('p');
  infoPresupuesto.textContent = `Presupuesto: $${pelicula.budget}`;
  
  const infoGanancias = document.createElement('p');
  infoGanancias.textContent = `Ganancias: $${pelicula.revenue}`;
  
  contenidoDesplegable.appendChild(infoAnio);
  contenidoDesplegable.appendChild(infoDuracion);
  contenidoDesplegable.appendChild(infoPresupuesto);
  contenidoDesplegable.appendChild(infoGanancias);
  
  detalleInfoAdicional.appendChild(contenidoDesplegable);

  const offcanvasTop = new bootstrap.Offcanvas(document.getElementById('offcanvasTop'));
  offcanvasTop.show();
}

const btnBuscar = document.getElementById("btnBuscar");
btnBuscar.addEventListener("click", function () {
  const buscador = document.getElementById("inputBuscar").value.toLowerCase();
  const resultadoContainer = document.getElementById('lista');
  const peliculas = JSON.parse(localStorage.getItem("Peli"));
  resultadoContainer.innerHTML = '';

  const resultados = peliculas.filter(pelicula =>
    pelicula.title.toLowerCase().includes(buscador) ||
    pelicula.tagline.toLowerCase().includes(buscador) ||
    (pelicula.genres && pelicula.genres.some(genre => typeof genre.name === 'string' && genre.name.toLowerCase().includes(buscador))) ||
    pelicula.overview.toLowerCase().includes(buscador)
  );

  if (resultados.length === 0) {
    resultadoContainer.innerHTML = '<p>No se encontraron resultados.</p>';
  } else {
    mostrarPeliculas(resultados);
  }
});