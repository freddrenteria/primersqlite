// JavaScript Document
/* 
* variables de la aplicación
*/
	var existe_db
	var db
/* 
* carga inicial de la app
*/
function onBodyLoad() {    
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady(){
	
   navigator.notification.alert("PhoneGap is working");
	
	existe_db = window.localStorage.getItem("existe_db");
	db = window.openDatabase("agenda_curso", "1.0", "DB del curso Phonegap", 200000);
	if(existe_db == null){
		creaDB();
	}else{
		cargaDatos();
	}	
	
	$("#b_guardar").click(function(e){
		
			navigator.notification.alert("entra a guardar");
			saveNewForm();
		
	 });
}


/* 
* creación de ña base de datos
*/
function creaDB(){
	db.transaction(creaNuevaDB, errorDB, creaSuccess);
	
}

function creaNuevaDB(tx){
		
	tx.executeSql('DROP TABLE IF EXISTS agenda_curso');
	
	var sql = "CREATE TABLE IF NOT EXISTS agenda_curso ( "+
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"nombre VARCHAR(50), " +
		"apellidos VARCHAR(50), " +
		"telefono VARCHAR(30), " +
		"categoria VARCHAR(30), " +
		"email VARCHAR(30) )";
		
	tx.executeSql(sql);
	
	tx.executeSql("INSERT INTO agenda_curso (id,nombre,apellidos,telefono,categoria,email) VALUES (1,'José','Pérez','+34566222666','amigo','paco@paco.com')");
	tx.executeSql("INSERT INTO agenda_curso (id,nombre,apellidos,telefono,categoria,email) VALUES (2,'Siro','González','+34555434567','familia','siro@test.com')");
	tx.executeSql("INSERT INTO agenda_curso (id,nombre,apellidos,telefono,categoria,email) VALUES (3,'Julio','Rodríguez','+34756222666','trabajo','julio@test.com')");
	
}


function creaSuccess(){
	window.localStorage.setItem("existe_db", 1);
	cargaDatos();
}

function errorDB(err){
	
	navigator.notification.alert("Error procesando SQL " + err.code);
}



/* 
* carga de datos desde la base de datos
*/
function cargaDatos(){
	db.transaction(cargaRegistros, errorDB);
}

function cargaRegistros(tx){
	tx.executeSql('SELECT * FROM agenda_curso', [], cargaDatosSuccess, errorDB);
}

function cargaDatosSuccess(tx, results){
	initForm();
	if(results.rows.length == 0){
		navigator.notification.alert("No hay contactos en la base de datos");
	}
	
	for(var i=0; i<results.rows.length; i++){
		var persona = results.rows.item(i);
		var selector = $("#lista_" + persona.categoria + " ul");
		
		selector.append('<li id="li_'+persona.id+'"><a href="#detalle" data-uid='+persona.id+' class="linkDetalles"><div class="interior_lista"><span>' + persona.nombre + ' ' + persona.apellidos+ '</span></div></a><a href="#form"  data-theme="a" data-uid='+persona.id+'  class="linkForm">Predet.</a></li>').listview('refresh');
	}
	
	$(".linkDetalles").click(function(e){
		$.id = $(this).data("uid");
		navigator.notification.alert($.id);
	});
	
	$(".linkForm").click(function(e){
		$.id = $(this).data("uid");
		navigator.notification.alert($.id);
		if(db != null){
		db.transaction(queryDBFindByID, errorDB);
	    }
	});
}

function queryDBFindByID(tx) {
    tx.executeSql('SELECT * FROM agenda_curso WHERE id='+$.id, [], queryDetalleSuccess, errorDB);
}


function queryDetalleSuccess(tx, results) {
	if(results.rows.length == 0){
		navigator.notification.alert("No hay detalles para ese elemento");
	}
	
	$.registro = results.rows.item(0);
		navigator.notification.alert($.registro.nombre + " " + $.registro.apellidos );
		$("#ti_nombre").val($.registro.nombre);
		$("#ti_apellidos").val($.registro.apellidos);
		$("#ti_telefono").val($.registro.telefono);
		$("#ti_mail").val($.registro.email);
}

function saveNewForm(){
	db.transaction(creaNuevaReg, errorDB, newFormSuccess);
}

function creaNuevaReg(tx){
	var cat = $("#cajaCategorias").find("input:checked").val();
	tx.executeSql("INSERT INTO agenda_curso (nombre,apellidos,telefono,categoria,email) VALUES ('"+$("#ti_nombre").val()+"','"+$("#ti_apellidos").val()+"','"+$("#ti_telefono").val()+"','"+cat+"','"+$("#ti_mail").val()+"')", [], cargaDatos, errorDB);
}

function newFormSuccess(tx, results) {
	var cat = $("#cajaCategorias").find("input:checked").val();
	var lista = $("#lista_" + cat + " ul")
	
	
	var obj = $('<li id="li_'+results.insertId+'"><a href="#detalle" data-uid='+results.insertId+' class="linkDetalles"><div class="interior_lista"><span>' + $("#ti_nombre").val() + " " + $("#ti_apellidos").val()+ '</span></div></a><a href="#form"  data-theme="a" data-uid='+results.insertId+'  class="linkForm">Predet.</a></li>');
	obj.find('.linkDetalles').bind('click', function(e){
		$.id = $(this).data('uid');
	});
	
	obj.find('.linkForm').bind('click', function(e){
		$.id = $(this).data('uid');
	});
	lista.append(obj).listview('refresh');
	
	$.mobile.changePage("#home");
	
}


function initForm(){
	$("#ti_nombre").val("");
	$("#ti_apellidos").val("");
	$("#ti_telefono").val("");
	$("#ti_mail").val("");
		
	$("#cat_familia").trigger("click").trigger("click")
}

