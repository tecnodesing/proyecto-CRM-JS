(function (){
    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        formulario.addEventListener('submit', validarCliente)
    });

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1);
    
        abrirConexion.onerror = function (){
            console.log('Hubo un error');
        };
    
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }

    function validarCliente(e){
        e.preventDefault();

        //leer los campos
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;
        
        //valida campos
        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        //crear objeto con la info del cliente
        const cliente = {
            nombre : nombre,
            email : email,
            telefono : telefono,
            empresa : empresa
        }

        cliente.id = Date.now();

        crearNuevoCliente(cliente);

    }

    function crearNuevoCliente(cliente){
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        const loader = document.querySelector('#loader');
        objectStore.add(cliente);

        transaction.onerror = function(){
            imprimirAlerta('Hubo un error, Correo o empresa ya esta registrado', 'error');
        };

        transaction.oncomplete = function(){
            imprimirAlerta('El cliente se agregó correctamente');
            loader.classList.remove('hidden');

            setTimeout(() => {
                loader.classList.add('hidden');
                window.location.href = 'index.html';
            }, 2000);
        };
    }

    

}) ();
