var boton = document.getElementById('agregar');
var lista = document.getElementById('lista');
var listaDos = document.getElementById('listaDos');

var data = [];
var cant = 0;
var procs = 1;

var memoriaRam = (1024*1024*16);
var numeroBits = 12;
var tamañoSegmentos = Math.pow(2,numeroBits);
var numeroSegmentos = (memoriaRam / tamañoSegmentos);
var tamañoPaginas = 256;
var numeroPaginas = Math.ceil(tamañoSegmentos/tamañoPaginas); 


var rectangle = document.getElementById('rectangle');
var freeSegmentsBody = document.getElementById('freeSegmentsBody');
var totalSegments = (1024*1024*16)/tamañoPaginas;
var paintedSegments = [((1024*1024)/tamañoPaginas)];
//var segmentNames = {1:'SO'};

var segmentNames = {};


for (var i = 1; i <= ((1024*1024)/tamañoPaginas); i++) {
  segmentNames[i] = 'SO';
}


  var stack = 65536;
  var sheap = 131072;
  var SO = 1048575;
  var PintarSO = ((1024*1024)/tamañoPaginas);


boton.addEventListener("click", agregar);
TablaDireccionDeMemoria();
TablaMarcoPagina();
TablaSegmentoPagina();


function agregar() {

  
  

  var nombre = document.getElementById('nombre').value;
  var text = document.getElementById('text').value;
  var dat = document.getElementById('dat').value;
  var bss = document.getElementById('bss').value;
  
  

  data.push({
    "id": nombre,
    "text": text,
    "dat": dat,
    "bss": bss
  });

  var textAux = Math.ceil(parseInt(document.getElementById('text').value) / tamañoPaginas);
  var datAux = Math.ceil(parseInt(document.getElementById('dat').value) / tamañoPaginas);
  var bssAux = Math.ceil(parseInt(document.getElementById('bss').value) / tamañoPaginas);
  var NstackAux = stack/tamañoPaginas;
  var NsheapAux = sheap/tamañoPaginas;



  var id_row = 'row' + cant;

  
  var nombreValor = document.getElementById('nombre').value;
  var fila = '<tr id=' + id_row + '><td>' + nombre + '</td><td>' + text + '</td><td>' + dat + '</td><td>' + bss + '</td><td>' + stack + '</td><td>' + sheap + '</td><td><a href="#" class="btn-eliminar" id="eraseButton" onclick="eliminarItem(\'' + nombreValor + '\', \'' + cant + '\');">Eliminar</a></td></tr>';
  var filaDos = '<tr id=' + id_row + '><td>' + nombre + '</td><td>' + textAux + '</td><td>' + datAux + '</td><td>' + bssAux + '</td><td>' + NstackAux + '</td><td>' + NsheapAux + '</td></tr>';
  lista.insertAdjacentHTML('beforeend', fila);
  listaDos.insertAdjacentHTML('beforeend', filaDos);

  function eliminarItem(nombreItem, cantidad) {
    var tablaNuevaBody = document.getElementById('tablaNuevaBody');
    // Vaciar el contenido de la tabla
    tablaNuevaBody.innerHTML = '';
  
    var comboBox = document.getElementById('comboBox');
  
    for (var i = 0; i < comboBox.options.length; i++) {
      if (comboBox.options[i].text === nombreItem) {
        comboBox.remove(i);
        
        break;
      }
    }
    
    eraseSegments(cantidad);
    
  }



  agregarItem(nombre);
  document.getElementById('nombre').value = '';
  document.getElementById('text').value = '';
  document.getElementById('dat').value = '';
  document.getElementById('bss').value = '';
  document.getElementById('text').focus();
  cant++;
  procs++;
   
  

}

function paintSegments() {
  var text = Math.ceil(parseInt(document.getElementById('text').value) / tamañoPaginas);
  var dat = Math.ceil(parseInt(document.getElementById('dat').value) / tamañoPaginas);
  var bss = Math.ceil(parseInt(document.getElementById('bss').value) / tamañoPaginas);
  var Nstack = stack/tamañoPaginas;
  var Nsheap = sheap/tamañoPaginas;
  
  


  if (isNaN(text) || isNaN(dat) || isNaN(bss)) {
    alert('Debe ingresar valores numéricos válidos en los campos.');
    return;
  }

  var segmentsToPaint = text + dat + bss + Nstack + Nsheap;

  if (segmentsToPaint < 1 || segmentsToPaint > totalSegments) {
    alert('La cantidad de segmentos a pintar es inválida.');
    return;
  }

  var remainingSegments = segmentsToPaint;
  var currentSegment = getStartSegment();

  while (remainingSegments > 0 && currentSegment <= totalSegments) {
    
    var nombreSegmento = document.getElementById('nombre').value;
    
    if (!paintedSegments.includes(currentSegment)) {
      paintedSegments.push(currentSegment);
      
      if (!segmentNames[currentSegment]) {
        segmentNames[currentSegment] = nombreSegmento + ' ';
        if (text > 0) {
          segmentNames[currentSegment] += 'text';
          text--;
        }else if (dat > 0) {
          segmentNames[currentSegment] += 'dat';
          dat--;
        } else if (bss > 0) {
          segmentNames[currentSegment] += 'bss';
          bss--;
        } else if (Nstack > 0) {
          segmentNames[currentSegment] += 'stack';
          Nstack--;
        } else if (Nsheap > 0) {
          segmentNames[currentSegment] += 'sheap';
          Nsheap--;
        }
      }
      remainingSegments--;
    }
    currentSegment++;
  }

  if (remainingSegments > 0) {
    currentSegment = getStartSegment();
    while (remainingSegments > 0 && currentSegment <= totalSegments) {
      
      if (!paintedSegments.includes(currentSegment)) {
        paintedSegments.push(currentSegment);
        
        if (!segmentNames[currentSegment]) {
          segmentNames[currentSegment] = nombre;
          
          if (text > 0) {
            segmentNames[currentSegment] += 'text';
            text--;
          } else if (dat > 0) {
            segmentNames[currentSegment] += 'dat';
            dat--;
          } else if (bss > 0) {
            segmentNames[currentSegment] += 'bss';
            bss--;
          } else if (Nstack > 0) {
            segmentNames[currentSegment] += 'stack';
            Nstack--;
          } else if (Nsheap > 0) {
            segmentNames[currentSegment] += 'sheap';
            Nsheap--;
          }
        }
        remainingSegments--;
      }
      currentSegment++;
    }
  }

  updateSegments();
  updateFreeSegmentsTable();
}

function getStartSegment() {
  var startSegment = ((1024*1024)/tamañoPaginas);
  var firstFreeSegment = paintedSegments[0];

  if (firstFreeSegment > startSegment) {
    startSegment = ((1024*1024)/tamañoPaginas);
  } else {
    for (var i = 1; i < paintedSegments.length; i++) {
      if (paintedSegments[i] - paintedSegments[i - 1] > 1) {
        startSegment = paintedSegments[i - 1] + 1;
        break;
      }
    }
  }

  return startSegment;
}



function eraseSegments(row) {


 


  var rowElement = document.getElementById('row' + row);
  var segmentNameCell = rowElement.getElementsByTagName('td')[0];
  var segmentName = segmentNameCell.innerText;

  var segmentsToDelete = [];
  for (var key in segmentNames) {
    if (segmentNames[key].includes(segmentName)) {
      segmentsToDelete.push(parseInt(key));
    }
  }

  $('#row' + row).remove();
  
  var i = 0;
  var pos = 0;
  for (x of data) {
    if (x.id == row) {
      pos = i;
    }
    i++;
  }
  data.splice(pos, 1);

  for (var i = 0; i < segmentsToDelete.length; i++) {
    var segmentToDelete = segmentsToDelete[i];
    var index = paintedSegments.indexOf(segmentToDelete);
    if (index !== -1) {
      paintedSegments.splice(index, 1);
      delete segmentNames[segmentToDelete];
    }
  }

  updateSegments();
  updateFreeSegmentsTable();
  
}


function deleteRowFromListaDos(rowNumber) {
  var table = document.getElementById("listaDos");
  var row = table.rows[rowNumber];

  if (row) {
    $('#row' + rowNumber).remove();
  }
}



function updateSegments() {
  rectangle.innerHTML = '';
  var divsLlenos = 0;

  for (var j = 1; j <= totalSegments; j++) {
    var segment = document.createElement('div');
    segment.style.height = '20px';

    if (segmentNames[j] === 'SO') {
      segment.style.backgroundColor = 'yellow';
      segment.style.fontSize = '15px';
      segment.innerText = segmentNames[j];
    } else {
      segment.style.backgroundColor = paintedSegments.includes(j) ? 'green' : 'transparent';
      if (paintedSegments.includes(j)) {
        segment.innerText = segmentNames[j] ? segmentNames[j] + ' ' + tamañoPaginas : tamañoPaginas;
        segment.style.fontSize = '15px';
        divsLlenos++;
      }
    }
    rectangle.appendChild(segment);
  }

  alert('Número de divs llenos: ' + divsLlenos);
}

function TablaDireccionDeMemoria() {
  var tablaBody = document.getElementById('tablaBody');
  
  var direcionDecimal = -tamañoPaginas;
  for (var i = 0; i < (totalSegments); i++) {
    
    var fila = document.createElement('tr');
    var decimalCell = document.createElement('td');
    var hexadecimalCell = document.createElement('td');
    direcionDecimal = direcionDecimal + tamañoPaginas;
    decimalCell.textContent = direcionDecimal;
    hexadecimalCell.textContent = direcionDecimal.toString(16).toUpperCase();
    fila.appendChild(decimalCell);
    fila.appendChild(hexadecimalCell);
    tablaBody.appendChild(fila);
  }

}

function TablaMarcoPagina() {
  var tablaBodyDos = document.getElementById('tablaBodyDos');
  for (var i = 0; i < totalSegments; i++) {
    
    var fila = document.createElement('tr');
    var decimalCell = document.createElement('td');
    var hexadecimalCell = document.createElement('td');
    decimalCell.textContent = i;
    hexadecimalCell.textContent = i.toString(16).toUpperCase();
    fila.appendChild(decimalCell);
    fila.appendChild(hexadecimalCell);
    tablaBodyDos.appendChild(fila);
  }

}

function TablaSegmentoPagina() {
  var tablaBodySegmento = document.getElementById('tablaBodySegmento');
  
  for (var i = 0; i < totalSegments; i++) {
    
    var fila = document.createElement('tr');
    var decimalCell = document.createElement('td');
    var hexadecimalCell = document.createElement('td');
    decimalCell.textContent = i;
    hexadecimalCell.textContent = i.toString(16).toUpperCase();
    fila.appendChild(decimalCell);
    fila.appendChild(hexadecimalCell);
    tablaBodySegmento.appendChild(fila);
  }
}

function capturarValores(n,Proceso,x) {

  var tablaSegmentos = document.getElementById('tablaDeSegmentos');
  var tablaMarcos = document.getElementById('tablaDeMarcos');
  var tablaDirecciones = document.getElementById('TablaDirecciones');
  var tablaNuevaBody = document.getElementById('tablaNuevaBody');
  
  var Segmento = '';
  var Marco = '';
  var Direccion = '';
  var Procesos = Proceso;
  var NumeroSegmentos = x;
  
  if (n >= 0 && n < tablaDeSegmentos.rows.length) {
    var filaSegmento = tablaDeSegmentos.rows[n+1];
    var celdaSegmento = filaSegmento.cells[1];
    Segmento = celdaSegmento.textContent;
  }
  
  if (n >= 0 && n < tablaDeMarcos.rows.length) {
    var filaMarco = tablaDeMarcos.rows[n+1];
    var celdaMarco = filaMarco.cells[1];
    Marco = celdaMarco.textContent;
  }
  
  if (n >= 0 && n < TablaDirecciones.rows.length) {
    var filaDireccion = TablaDirecciones.rows[n+1];
    var celdaDireccion = filaDireccion.cells[1];
    Direccion = celdaDireccion.textContent;
  }
  
  function reemplazarColumnaTres() {
    var tablaNuevaBody = document.getElementById('tablaNuevaBody');
    var filas = tablaNuevaBody.rows;
  
    for (var i = 0; i < filas.length - 1; i++) {
      var filaActual = filas[i];
      var celdaActual = filaActual.cells[5]; // Obtener la sexta celda (índice 5)
      
      var ultimaFila = filas[filas.length - 1];
      var ultimaCeldaColumnaDos = ultimaFila.cells[2]; // Obtener la tercera celda (índice 2)
      
      var celdaColumnaDos = filaActual.cells[2]; // Obtener la tercera celda (índice 2)
  
      var filaSiguiente = filas[i + 1];
      var celdaSiguiente = filaSiguiente.cells[5]; // Obtener la sexta celda de la siguiente fila
  
      //(capturarTextoHastaEspacio(compararCeldas(celdaActual, celdaSiguiente)));
              

      if (capturarTextoHastaEspacio(compararCeldas(celdaActual, celdaSiguiente)) === "OK") {
        celdaColumnaDos.textContent = tamañoPaginas;
        
      } else {
        var auxd = capturarIdRow(capturarTextoHastaEspacio(compararCeldas(celdaActual, celdaSiguiente)));
        if(((capturarValorPorNombre(capturarTextoHastaEspacio(compararCeldas(celdaActual, celdaSiguiente)),compararCeldas(celdaActual, celdaSiguiente))) % tamañoPaginas) === 0){
          celdaColumnaDos.textContent = tamañoPaginas;
        }else{
          celdaColumnaDos.textContent = ((capturarValorPorNombre(capturarTextoHastaEspacio(compararCeldas(celdaActual, celdaSiguiente)),compararCeldas(celdaActual, celdaSiguiente))) % tamañoPaginas);
        }
      } 
    }
    agregarNumeroUltimaFila();

  }
  

  function agregarNumeroUltimaFila() {
    var tabla = document.getElementById('tablaNuevaBody');
    var rowCount = tabla.rows.length;
  
    if (rowCount > 0) {
      var ultimaFila = tabla.rows[rowCount - 1];
      var celdaColumnaDos = ultimaFila.cells[2]; // Obtener la segunda celda (índice 1)
      var numero = tamañoPaginas; // El número que deseas agregar
  
      celdaColumnaDos.textContent = numero;
    }
  }
  

  function compararCeldas(celda1, celda2) {
    if (celda1.textContent !== celda2.textContent) {
      return celda1.textContent; // Devuelve el contenido de la celda si son diferentes
    }
  
    return "OK"; // Devuelve 1 si las celdas son iguales
  }

  


  var botonVerificar = document.getElementById('botonVerificar');
  botonVerificar.addEventListener('click', reemplazarColumnaTres);  


  var nuevaFila = document.createElement('tr');
  var celdaValorNoSegmento = document.createElement('td');
  var celdaValorSegmento = document.createElement('td');
  var celdaValorLiSegmento = document.createElement('td');
  var celdaValorMarco = document.createElement('td');
  var celdaValorDireccion = document.createElement('td');
  var celdaValorProceso = document.createElement('td');

  celdaValorNoSegmento.textContent = x.toString(16).toUpperCase();
  celdaValorSegmento.textContent = Marco;
  
  celdaValorLiSegmento.textContent = 0;
  

  celdaValorMarco.textContent = Marco;
  celdaValorDireccion.textContent = Direccion;
  celdaValorProceso.textContent = Procesos;
  
  nuevaFila.appendChild(celdaValorNoSegmento);
  nuevaFila.appendChild(celdaValorSegmento);
  nuevaFila.appendChild(celdaValorLiSegmento);
  nuevaFila.appendChild(celdaValorMarco);
  nuevaFila.appendChild(celdaValorDireccion);
  nuevaFila.appendChild(celdaValorProceso);
  tablaNuevaBody.appendChild(nuevaFila);
}


function verificarProcesoAgregado(n) {
  var tablaNuevaBody = document.getElementById('tablaNuevaBody');
  var celdaValorProcesoColumna = tablaNuevaBody.querySelectorAll('tr td:nth-child(6)');

  for (var i = 0; i < celdaValorProcesoColumna.length; i++) {
    var celdaValorProceso = celdaValorProcesoColumna[i];
    if (celdaValorProceso.textContent === n.toString()) {
      return 1; // Ya ha sido agregado el proceso "n"
    }
  }

  return 0; // No ha sido agregado el proceso "n"
}


function updateFreeSegmentsTable() {
  freeSegmentsBody.innerHTML = '';

  var start = 1;
  var end = 0;
  var isSegmentFree = false;

  for (var i = 1; i <= totalSegments; i++) {
    if (!paintedSegments.includes(i)) {
      if (!isSegmentFree) {
        start = i;
        isSegmentFree = true;
      }
      end = i;
    } else {
      if (isSegmentFree) {
        var row = document.createElement('tr');
        var startCell = document.createElement('td');
        var endCell = document.createElement('td');
        startCell.textContent = start;
        endCell.textContent = end;
        row.appendChild(startCell);
        row.appendChild(endCell);
        freeSegmentsBody.appendChild(row);
      }
      isSegmentFree = false;
    }
  }

  if (isSegmentFree) {
    var row = document.createElement('tr');
    var startCell = document.createElement('td');
    var endCell = document.createElement('td');
    startCell.textContent = start;
    endCell.textContent = end;
    row.appendChild(startCell);
    row.appendChild(endCell);
    freeSegmentsBody.appendChild(row);
  }
}

function obtenerContenidoEnArray(NombreProceso) {
  var contenidoArray = [];

  // Vaciar el array
  contenidoArray = [];

  var rectangleDivs = document.getElementById('rectangle').getElementsByTagName('div');

  for (var i = 0; i < rectangleDivs.length; i++) {
    var texto = rectangleDivs[i].innerText;
    if (texto === NombreProceso+" text "+tamañoPaginas || texto ===  NombreProceso+" dat "+tamañoPaginas || texto ===  NombreProceso+" bss "+tamañoPaginas || texto ===  NombreProceso+" stack "+tamañoPaginas || texto ===  NombreProceso+" sheap "+tamañoPaginas) {
      contenidoArray.push(texto);
    } else {
      contenidoArray.push("0");
    }
  }

  return contenidoArray;
}


function guardarContenidoEnTabla(selectedItem) {

  var tablaNuevaBody = document.getElementById('tablaNuevaBody');
  // Vaciar el contenido de la tabla
  tablaNuevaBody.innerHTML = '';
  
  var contenidoArray = obtenerContenidoEnArray(selectedItem);
  var valores = [];
  // Obtener referencia a la tabla
  var tabla = document.getElementById('tabla');

  // Vaciar el contenido existente de la tabla
  tabla.innerHTML = '';

  // Encontrar el índice del último valor diferente de cero
  var ultimoIndice = contenidoArray.length - 1;
  while (ultimoIndice >= 0 && contenidoArray[ultimoIndice] === "0") {
    ultimoIndice--;
  }

  // Crear un nuevo array para almacenar las posiciones de los valores diferentes de cero
  var posicionesArray = [];
  for (var i = 0; i <= ultimoIndice; i++) {
    if (contenidoArray[i] !== "0") {
      posicionesArray.push(i);
      valores.push(contenidoArray[i]);
    }
  }
  for (var i = 0; i < posicionesArray.length; i++) {
    capturarValores(posicionesArray[i],valores[i],i);
  }
  /*
  // Crear una columna para el nuevo array de posiciones
  var columnaPosiciones = document.createElement('td');
  for (var i = 0; i < posicionesArray.length; i++) {
    var posicion = posicionesArray[i];
    var posicionTexto = document.createTextNode(posicion);
    columnaPosiciones.appendChild(posicionTexto);
    columnaPosiciones.appendChild(document.createElement('br'));
  }

  // Crear una columna para los valores diferentes de cero
  var columnaValores = document.createElement('td');
  for (var i = 0; i <= ultimoIndice; i++) {
    if (contenidoArray[i] !== "0") {
      var valorTexto = document.createTextNode(contenidoArray[i]);
      columnaValores.appendChild(valorTexto);
      columnaValores.appendChild(document.createElement('br'));
    }
  }

  // Crear una fila y agregar las columnas
  var fila = document.createElement('tr');
  fila.appendChild(columnaPosiciones);
  fila.appendChild(columnaValores);

  Agregar la fila a la tabla
  tabla.appendChild(fila);*/
}


function agregarItem(Item) {
  var comboBox = document.getElementById('comboBox');
  var nuevoItem = Item;

  if (nuevoItem) {
    var option = document.createElement('option');
    option.text = nuevoItem;
    comboBox.add(option);
  }
}

function realizarAccion() {
  var comboBox = document.getElementById('comboBox');
  var selectedItem = comboBox.value;

  if (selectedItem === "Seleccionar") {
    var tablaNuevaBody = document.getElementById('tablaNuevaBody');
    tablaNuevaBody.innerHTML = '';
  } else {
    guardarContenidoEnTabla(selectedItem);
    // Verificar si la tabla se pintó en pantalla
   
  }
}



function eliminarItem(nombreItem, cantidad) {
  deleteRowFromListaDos(cantidad);
  var tablaNuevaBody = document.getElementById('tablaNuevaBody');
  // Vaciar el contenido de la tabla
  tablaNuevaBody.innerHTML = '';

  var comboBox = document.getElementById('comboBox');

  for (var i = 0; i < comboBox.options.length; i++) {
    if (comboBox.options[i].text === nombreItem) {
      comboBox.remove(i);
      break;
    }
  }

  eraseSegments(cantidad);
  
}


function capturarIdRow(nombre) {
  var lista = document.getElementById('lista');
  var filas = lista.getElementsByTagName('tr');
  for (var i = 0; i < filas.length; i++) {
    var nombreCelda = filas[i].getElementsByTagName('td')[0].innerText;
    if (nombreCelda === nombre) {
      return filas[i].id;
    }
  }
  return null; // Retorna null si no se encuentra el nombre en ninguna fila
}

function capturarValorPorNombre(nombre,tipoDato) {
  var lista = document.getElementById('lista');
  var filas = lista.getElementsByTagName('tr');
  for (var i = 0; i < filas.length; i++) {
    var nombreCelda = filas[i].getElementsByTagName('td')[0].innerText;
    if (nombreCelda === nombre) {

      if (tipoDato.includes("text")) {
        var valorCelda = filas[i].getElementsByTagName('td')[1].innerText;
        return valorCelda;
      } else if (tipoDato.includes("dat")) {
        var valorCelda = filas[i].getElementsByTagName('td')[2].innerText;
        return valorCelda;
      } else if (tipoDato.includes("bss")) {
        var valorCelda = filas[i].getElementsByTagName('td')[3].innerText;
        return valorCelda;
      } else if (tipoDato.includes("stack")) {
        var valorCelda = filas[i].getElementsByTagName('td')[4].innerText;
        return valorCelda;
      } else if (tipoDato.includes("sheap")) {
        var valorCelda = filas[i].getElementsByTagName('td')[5].innerText;
        return valorCelda;
      }

      return valorCelda;
    }
  }
  return null; // Retorna null si no se encuentra el nombre en ninguna fila
}

function capturarTextoHastaEspacio(textos) {
  var texto = textos;
  var primerEspacio = texto.indexOf(' ');
  if (primerEspacio !== -1) {
    texto = texto.substring(0, primerEspacio);
  }
  //capturarIdRow(capturarValorPorNombre(texto));

  return texto;
}

 
