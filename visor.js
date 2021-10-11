'use strict'
const API_KEY = 'bALoegUEYRZ5xuWuUIijNtm0uRzLjAWChvEM24rW'
const SOL_MARTE = '1'
const SOL_TIERRA = '2'

registrarEventos()

function registrarEventos(){
    let but = document.getElementById('filtrar')
    let sig = document.getElementById('sig')
    let ant = document.getElementById('ant')

    but.addEventListener('click',procesarDatos)
    sig.addEventListener('click',paginar)
    ant.addEventListener('click',paginar)
}

function procesarDatos(evt) {
    evt.preventDefault()
    cargarDatos(1)
}

function paginar(){
    let pagina = new Number(this.getAttribute('pag'))
    cargarDatos(pagina)
}

function cargarDatos(pagina){
    let rover = document.getElementById('cmbrover').value
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`
    let parametros = null
    mostrarMensaje('')
    if(validarDatos()){
        parametros = procesarSeleccion(pagina)
        agregaPaginas(pagina)
        url += '?' + parametros.toString()
        mostrarCarga()
        loadDatosApi(url, 'GET', okFunction,errorFunction)
    }
}

function validarDatos(){
    let rover = document.getElementById('cmbrover').value
    let sol = document.getElementById('cmbsol').value
    let fechaTierra = document.getElementById('txtfecha').value
    let fechaMarte = document.getElementById('txtSolMar').value

    if ('' === rover) {
        mostrarMensaje('Seleccione Rover !!!')
        return false
    }

    if ('0' != sol) {
        if (sol === SOL_MARTE){
            if('' === fechaMarte){
                mostrarMensaje('Ingrese día solar de marte !!!')
                return false;
            }
        }
        if (sol === SOL_TIERRA){
            if('' === fechaTierra){
                mostrarMensaje('Ingrese fecha de la tierra !!!')
                return false;
            }
        }
    }else {
        mostrarMensaje('Seleccione Sol !!!')
        return false  
    }

    return true
}

function mostrarCarga(){
    let load = document.getElementById('load')
    let img = document.createElement('img')
    img.setAttribute('src','./image/load.gif')
    img.setAttribute('width',25)
    load.appendChild(img)
}

function removerCarga(){
    let elemento = document.getElementById('load')
    let tagExists = document.querySelector('#load img')
    elemento.removeChild(tagExists)
}

function procesarSeleccion(pagina) {
    let sol = document.getElementById('cmbsol').value
    let fechaTierra = document.getElementById('txtfecha').value
    let fechaMarte = document.getElementById('txtSolMar').value
    let camara = document.getElementById('cmbcamara').value

    let parametros = new URLSearchParams()

    if ('0' != sol) {
        if (sol === SOL_MARTE)
            parametros.append('sol', fechaMarte)
        if (sol === SOL_TIERRA)
            parametros.append('earth_date', fechaTierra)
    }

    if ('' != camara){
        parametros.append('camera',camara)
    }
    
    parametros.append('page',pagina)
    parametros.append('API_KEY', API_KEY)

    return parametros
}

function agregaPaginas(pagActual){
    let sig = document.getElementById('sig')
    let ant = document.getElementById('ant')

    sig.removeAttribute('disabled')
    sig.setAttribute('pag',pagActual+1)
    if(pagActual-1 > 0){
        ant.setAttribute('pag',pagActual-1)
        ant.removeAttribute('disabled')
    }else{
        ant.setAttribute('disabled','')
    } 
}

function seleccionarTiempo() {

    let tiempo = document.getElementById('cmbsol').value
    let tiempoTierra = document.getElementById('txtfecha')
    let tiempoMarte = document.getElementById('txtSolMar')

    tiempoTierra.setAttribute('disabled', '')
    tiempoMarte.setAttribute('disabled', '')

    if (tiempo === SOL_MARTE) {
        tiempoTierra.setAttribute('disabled', '')
        tiempoMarte.removeAttribute('disabled')
    }
    if (tiempo === SOL_TIERRA) {
        tiempoMarte.setAttribute('disabled', '')
        tiempoTierra.removeAttribute('disabled')
    }

}

async function loadDatosApi(url, metodo, okFunction,errorFunction) {
    let parametros = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    await fetch(url, parametros)
        .then(response => okFunction(response.json()))
        .catch(error => errorFunction(error))
}

async function okFunction(datos) {
    await datos
        .then(rpta => mostrarDatos(rpta))
        .catch(error => console.log(error))
}

function errorFunction(error){
    mostrarMensaje(error)
    removerCarga()
}

function mostrarDatos(datos) {

    let elemento = document.querySelector('table')
    let tag = document.createElement('tbody')
    let tagExists = document.querySelector('table tbody')

    if (null != tagExists)
        elemento.removeChild(tagExists)

    if(datos.photos.length != 0){
        datos.photos.forEach(object => {
            agregarRegitro(object,tag)
        });
        elemento.appendChild(tag)
    }
    else
        mostrarMensaje('No hay elementos para mostrar!')
    
    removerCarga()
}

function mostrarMensaje(msg){
    let p_old = document.querySelector('p')
    let p_new = document.createElement('p')
    let parent = p_old.parentNode;
    p_new.setAttribute('class','error')
    p_new.appendChild(document.createTextNode(msg))
    
    parent.replaceChild(p_new,p_old)
}

function agregarRegitro(element,body) {
    let tr = null
    let td = null
    let a = null

    tr = document.createElement('tr')

    td = document.createElement('td')
    a = document.createElement('a')
    a.setAttribute('img', element.img_src)
    a.setAttribute('href', '#')
    a.addEventListener('click', loadImage, false)
    a.appendChild(document.createTextNode(element.id))
    td.appendChild(a)
    tr.appendChild(td)

    td = document.createElement('td')
    td.appendChild(document.createTextNode(`${element.rover.id}-${element.rover.name}`))
    tr.appendChild(td)

    td = document.createElement('td')
    td.appendChild(document.createTextNode(element.rover.launch_date))
    tr.appendChild(td)

    td = document.createElement('td')
    td.appendChild(document.createTextNode(element.rover.landing_date))
    tr.appendChild(td)

    td = document.createElement('td')
    td.appendChild(document.createTextNode(element.earth_date))
    tr.appendChild(td)

    td = document.createElement('td')
    td.appendChild(document.createTextNode(element.sol))
    tr.appendChild(td)

    body.appendChild(tr)
}

function loadImage(evt) {

    let divImg = document.querySelector('#imagen img')
    divImg.setAttribute('src',this.getAttribute('img'))

}