var contenedor_columnas = document.getElementById('contenedor-columnas');

var boton_agregar_rojo = document.getElementById('agregar-rojo');
var boton_agregar_verde = document.getElementById('agregar-verde');
var boton_reiniciar_monedas = document.getElementById('reiniciar-monedas');

var siguiente_movimiento = document.getElementById('siguiente-movimiento');

var id_monedas = 1;

var porcentajes = [50, 25, 12.5, 6.25, 3.12, 1.56, 0.78, 0.39, 0.19, 0.09, 0.04, 0.02, 0.01];

var porcentajeAcumulado = 0;

function calcularPorcentaje(){
    var cantidad_monedas = contenedor_columnas.getElementsByClassName('col-md-1').length;
    for(var i = 0; i < cantidad_monedas; i++){
        porcentajeAcumulado = (porcentajeAcumulado + porcentajes[i]);
        if(Number.isInteger(porcentajeAcumulado)){
            contenedor_columnas.getElementsByClassName('col-md-1')[i].innerHTML = '<p class="p-0 m-0">' + porcentajeAcumulado + '%</p>';
        } else {
            contenedor_columnas.getElementsByClassName('col-md-1')[i].innerHTML = '<p class="p-0 m-0">' + porcentajeAcumulado.toFixed(2) + '%</p>';
        }
    }
    porcentajeAcumulado = 0;
}

function agregarMoneda(color){
    var cantidad_monedas = contenedor_columnas.getElementsByClassName('col-md-1').length;
    if(cantidad_monedas == 12){
        //BORRAR LA PRIMERA MONEDA
        var moneda_eliminar = document.getElementById('moneda-' + (id_monedas - 12));
        contenedor_columnas.removeChild(moneda_eliminar);
    }
    contenedor_columnas.innerHTML += `
    <div class="col-md-1 ${color} moneda px-0" id="moneda-${id_monedas}"></div>
    `;
    calcularPorcentaje();
    siguienteMovimiento();
    alertador();
    id_monedas++; 
}

boton_reiniciar_monedas.addEventListener('click', reiniciarMonedas);

function reiniciarMonedas(){
    contenedor_columnas.innerHTML = '';
    siguiente_movimiento.innerHTML = '50.00%';
    alertador();
    id_monedas = 1;
}

function siguienteMovimiento(){
    var cantidad_monedas = contenedor_columnas.getElementsByClassName('col-md-1').length;
    var porcentajeSiguiente = 0;
    for(var i = 0; i <= cantidad_monedas; i++){
        porcentajeSiguiente += porcentajes[i];
    }
    siguiente_movimiento.innerHTML = porcentajeSiguiente.toFixed(2) + '%';
}
siguienteMovimiento();

/* MARTINGALA CALCULADORA DE GANANCIAS */
var porcentaje_ganancia = document.getElementById('porcentaje-ganancia');

function aumentarGanancias(numero){
    if(numero > 0 && porcentaje_ganancia.innerText >= 1){
        porcentaje_ganancia.innerHTML = parseInt(porcentaje_ganancia.innerText) + 1;
    } else if(numero < 0 && porcentaje_ganancia.innerText > 1){
        porcentaje_ganancia.innerHTML = parseInt(porcentaje_ganancia.innerText) - 1;
    }
    actualizarGanancias();
    actualizar_Estrategia_Inversion();
}

/* VARIABLES DE LAS INVERSIONES */
var gn_1 = document.getElementById('gn-1');
var gn_2 = document.getElementById('gn-2');
var gn_3 = document.getElementById('gn-3');
var gn_4 = document.getElementById('gn-4');
var gn_5 = document.getElementById('gn-5');

var gm_1 = document.getElementById('gm-1');
var gm_2 = document.getElementById('gm-2');
var gm_3 = document.getElementById('gm-3');
var gm_4 = document.getElementById('gm-4');
var gm_5 = document.getElementById('gm-5');

var inversiones = [1, 3, 6, 15, 38];

function actualizarGanancias(){
    gn_1.innerHTML =  (inversiones[0] * (parseInt(porcentaje_ganancia.innerHTML) / 100)).toFixed(2);
    gn_2.innerHTML =  (inversiones[1] * (parseInt(porcentaje_ganancia.innerHTML) / 100)).toFixed(2);
    gn_3.innerHTML =  (inversiones[2] * (parseInt(porcentaje_ganancia.innerHTML) / 100)).toFixed(2);
    gn_4.innerHTML =  (inversiones[3] * (parseInt(porcentaje_ganancia.innerHTML) / 100)).toFixed(2);
    gn_5.innerHTML =  (inversiones[4] * (parseInt(porcentaje_ganancia.innerHTML) / 100)).toFixed(2);

    gm_1.innerHTML =  ((inversiones[0] * (parseInt(porcentaje_ganancia.innerHTML) / 100)) - parseFloat(gn_1.innerText)).toFixed(2);
    gm_2.innerHTML =  ((inversiones[1] * (parseInt(porcentaje_ganancia.innerHTML) / 100)) - inversiones[0]).toFixed(2);
    gm_3.innerHTML =  ((inversiones[2] * (parseInt(porcentaje_ganancia.innerHTML) / 100)) - (inversiones[1] + inversiones[0])).toFixed(2);
    gm_4.innerHTML =  ((inversiones[3] * (parseInt(porcentaje_ganancia.innerHTML) / 100)) - (inversiones[2] + inversiones[1] + inversiones[0])).toFixed(2);
    gm_5.innerHTML =  ((inversiones[4] * (parseInt(porcentaje_ganancia.innerHTML) / 100)) - (inversiones[3] + inversiones[2] + inversiones[1] + inversiones[0])).toFixed(2);
}

actualizarGanancias();

/* ESTRATEGIA DE INVERSION PARA LLEGAR A LA META */
var capital_inicial_requerido;
var meta_capital = 500;
var porcentaje_inversion = document.getElementById('porcentaje-inversion');
var tabla_estrategia_inversion = document.getElementById('tabla-estrategia');
var cantidad_aciertos;
var cantidad_iteraciones = meta_capital / 100;
var inversion_por_capital;

function actualizar_Estrategia_Inversion(){
    tabla_estrategia_inversion.innerHTML = '';
    capital_inicial_requerido = 100;
    for(var i = 1; i <= cantidad_iteraciones; i++){
        inversion_por_capital = ((parseInt(porcentaje_inversion.innerText) / 100) * capital_inicial_requerido).toFixed(0);
        cantidad_aciertos = Math.ceil(100 / (inversion_por_capital * (parseInt(porcentaje_ganancia.innerText) / 100)));
        tabla_estrategia_inversion.innerHTML += `
        <tr>
            <th scope="row">${i}</th>
            <td><span class="badge badged-pill badge-warning">$<span>${capital_inicial_requerido}</span> USD</span></td>
            <td><span class="badge badged-pill badge-primary">$<span>${inversion_por_capital}</span> USD</span></td>
            <td>${cantidad_aciertos}</td>
            <td><span class="badge badged-pill badge-success">$<span>100</span> USD</span></td>
        </tr>
        `;
        capital_inicial_requerido += 100; 
    }
}

actualizar_Estrategia_Inversion();

/* ACTUALIZAR EL PORCENTAJE DE INVERSIÓN EN LA TABLA*/

function actualizarInversion(numero){
    if(numero > 0 && porcentaje_inversion.innerText >= 1){
        porcentaje_inversion.innerText = parseInt(porcentaje_inversion.innerText) + Math.abs(numero);
    } else if (numero < 0 && porcentaje_inversion.innerText > 1){
        porcentaje_inversion.innerText = parseInt(porcentaje_inversion.innerText) - Math.abs(numero);
    }
    actualizar_Estrategia_Inversion();
}


/* NOTIFICADOR */

var mensajes = ['Debes formar una secuencia del mismo color', 'Todavía no es momento de cambiar el color', 'Es un buen momento para considerar cambiar el color', '¡Cambia de color! el margen de fallar es casi nulo'];
var tipo_mensaje = ['alert-info', 'alert-danger', 'alert-warning', 'alert-success'];

var alertador_contenedor = document.getElementById('alertador');

function alertador(){
    var cantidad_monedas = contenedor_columnas.getElementsByClassName('col-md-1').length;
    var id_mensaje = 0;
    var id_tipo_mensaje = 0;
    if(cantidad_monedas == 0){
        id_mensaje = 0;
        id_tipo_mensaje = 0;
    } else if (cantidad_monedas <= 3){
        id_mensaje = 1;
        id_tipo_mensaje = 1;
    } else if(cantidad_monedas == 4){
        id_mensaje = 2;
        id_tipo_mensaje = 2;
    } else if(cantidad_monedas > 4){
        id_mensaje = 3;
        id_tipo_mensaje = 3;
    }
    alertador_contenedor.innerHTML = `
        <div class="alert ${tipo_mensaje[id_tipo_mensaje]}" role="alert">
            ${mensajes[id_mensaje]}
        </div>
    `;
}

alertador();

/* CREACION DEL RELOJ Y MOSTRANDO LA HORA */

var hora_actual = document.getElementById('hora');
var hora_cet = document.getElementById('hora-cet');

var minutos_actual = document.getElementById('minutos');
var minutos_cet = document.getElementById('minutos-cet');

var segundos_actual = document.getElementById('segundos');
var segundos_cet = document.getElementById('segundos-cet');

var estado_actual = document.getElementById('estado');
var estado_cet = document.getElementById('estado-cet');

var dia_actual = document.getElementById('dia');
var dia_cet = document.getElementById('dia-cet');

var actualizarHorario = setInterval(function(){
    var fecha = new Date;
    var horas = fecha.getHours();
    var minutos = fecha.getMinutes();
    var segundos = fecha.getSeconds();
    var dia = fecha.getDay();

    /* Hora actual y CET */
    if(horas < 10){
        hora_actual.innerHTML = '0' + horas;
    } else {
        hora_actual.innerHTML = horas;
    }
    if((horas + 5) < 10){ // SI ES MENOR A 10 SE LE AGREGA UN CERO
        hora_cet.innerHTML = '0' + (horas + 5);
    } else if((horas + 5 ) > 23){ // SI ES MAYOR A 23 SE REINICIA
        hora_cet.innerHTML = '0' + ((horas + 5) % 12);
    } else { // SE PONE LA HORA TAL CUAL SI NO SE CUMPLEN LOS CASOS ANTERIORES
        hora_cet.innerHTML = (horas + 5);
    }
    
    /* Minutos actuales y CET */
    if(minutos < 10){
        minutos_actual.innerHTML = '0' + minutos;
        minutos_cet.innerHTML = '0' + minutos;
    } else {
        minutos_actual.innerHTML = minutos;
        minutos_cet.innerHTML = minutos;
    }
    
    /* Segundos actuales y CET */
    if(segundos < 10){
        segundos_actual.innerHTML = '0' + segundos;
        segundos_cet.innerHTML = '0' + segundos;
    } else {
        segundos_actual.innerHTML = segundos;
        segundos_cet.innerHTML = segundos;
    }

    /* Calculando los dias de la semana segun la zona horaria */
    calcularDia(dia, horas);
}, 1000);

function calcularDia(dia, horas){
    switch (dia){
        case 0:
            dia_actual.innerHTML = 'Domingo';
            if((horas + 5) < 24){
                dia_cet.innerHTML = 'Domingo';
            } else {
                dia_cet.innerHTML = 'Lunes';
            }
            break;
        case 1:
            dia_actual.innerHTML = 'Lunes';
            if((horas + 5) < 24){
                dia_cet.innerHTML = 'Lunes';
            } else {
                dia_cet.innerHTML = 'Martes';
            }
            break;
        case 2:
            dia_actual.innerHTML = 'Martes';
            if((horas + 5) < 24){
                dia_cet.innerHTML = 'Martes';
            } else {
                dia_cet.innerHTML = 'Miércoles';
            }
            break;
        case 3:
            dia_actual.innerHTML = 'Miércoles';
            if((horas + 5) < 24){
                dia_cet.innerHTML = 'Miércoles';
            } else {
                dia_cet.innerHTML = 'Jueves';
            }
            break;
        case 4:
            dia_actual.innerHTML = 'Jueves';
            if((horas + 5) < 24){
                dia_cet.innerHTML = 'Jueves';
            } else {
                dia_cet.innerHTML = 'Viernes';
            }
            break;
        case 5:
            dia_actual.innerHTML = 'Viernes';
            if((horas + 5) < 24){
                dia_cet.innerHTML = 'Viernes';
            } else {
                dia_cet.innerHTML = 'Sábado';
            }
            break;
        case 6:
            dia_actual.innerHTML = 'Sábado';
            if((horas + 5) < 24){
                dia_cet.innerHTML = 'Sábado';
            } else {
                dia_cet.innerHTML = 'Domingo';
            }
            break;
        default:
            dia_actual.innerHTML = 'No disponible';
            dia_cet.innerHTML = 'No disponible';
            break;
    } 
}