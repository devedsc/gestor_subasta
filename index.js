'use strict'
   
   const getCapital = document.querySelector("#input_capital")
   const getIva = document.querySelector("#input_iva")
   const getIMartillo = document.querySelector("#input_imartillo")


// valores de sabasta
   const getProduct = document.querySelector("#input_product");
   const getValue = document.querySelector("#input_value");

//VISTA PREVIA
   const setProduct = document.querySelector("#output_product")
   const setValor = document.querySelector("#output_valor")
   const setIva = document.querySelector("#output_iva")
   const setIMartillo = document.querySelector("#output_imartillo")
   const setTotal = document.querySelector("#output_total")



   const formDatos = document.getElementById("formDatos");
   const form = document.getElementById("form_registro_subasta");

   const export_excel = document.getElementById("exportExcel");
   

   let total =0;

 





//EVENTOS 

document.addEventListener("DOMContentLoaded", () => {
  datosEconomicos();
 
  document.getElementById("section2").style.display = "none";
});


//Click  exportar excel
   export_excel.addEventListener("click", () =>{
     
    exportTableToExcel("transactionTable","reporte");
   })


   formDatos.addEventListener("submit", (e)=> {
    e.preventDefault();
 
    
    if(!isNaN(getCapital.value) && !isNaN(getIMartillo.value) && !isNaN(getIva.value)){
      document.getElementById("section2").style.display = "block";
      document.getElementById("section1").style.display = "none";
      resumenDataForm();
    }else{
      alert("los datos ingresados no son validos");
      getCapital.value = "";
      getIMartillo.value = "";
      getIva.value = "";
    }
   

   })
   
   form.addEventListener("submit", function(event){
    event.preventDefault();

    total+= CargarVistaPrevia();
    CargarTabla(setProduct.textContent, setValor.textContent, setIva.textContent, setIMartillo.textContent, setTotal.textContent);
    resumenDataForm(total);
    Limpiar();
    
 
 


   })



  input_product.addEventListener("keyup", () => {
   CargarVistaPrevia();
   
   
 });
   
  input_value.addEventListener("keyup", () => {
    CargarVistaPrevia();
    
});



 



//FUNCIONES



// CARGAR DATOS ECONOMICOS DESDE API
   const datosEconomicos = () => {
    var  today = new Date();

    var m = today.getMonth() + 1;
    
    var mes = (m < 10) ? '0' + m : m;
    
    
     let contenido = document.querySelector("#contenido");
    fetch('https://mindicador.cl/api')
    .then(res => res.json())
    .then(data =>{
      
      contenido.innerHTML = `
      <p> Valores Economicos al ${today.getDate() + '/' + mes +'/'+today.getFullYear()} Dolar: ${data.dolar.valor} |
       Euro: ${data.euro.valor} |
       UF: ${data.uf.valor}</p>
      
      `   
    });

  }

//CARGAR VISTA PREVIA

const CargarVistaPrevia = () => {

  let  totalAcumulado = 0;
  setProduct.textContent = getProduct.value;
    setValor.textContent = formatNumber.new(getValue.value, "$");
    setIva.textContent = formatNumber.new(Math.round(getValue.value * ((getIva.value)/100)),"$");
    setIMartillo.textContent = formatNumber.new(Math.round(getValue.value * ((getIMartillo.value)/100)),"$");
    setTotal.textContent = formatNumber.new(parseInt(getValue.value) + parseInt(getValue.value * ((getIMartillo.value)/100)) + parseInt(getValue.value * ((getIva.value)/100)),"$");
    totalAcumulado = parseInt(getValue.value) + parseInt(getValue.value * ((getIMartillo.value)/100)) + parseInt(getValue.value * ((getIva.value)/100));
    return totalAcumulado;

}





//CARGAR DATOS A TABLA
  const CargarTabla = (product, value, iva, iMartillo,total) => {



     
     let transactionTableRef = document.getElementById("transactionTable");
     let newTransactionRowRef = transactionTableRef.insertRow(1);
     let newCellProductRef = newTransactionRowRef.insertCell(0);
     newCellProductRef.textContent = product;
     let newCellValueRef = newTransactionRowRef.insertCell(1);
     newCellValueRef.textContent = value;
     let newCellIvaRef = newTransactionRowRef.insertCell(2);
     newCellIvaRef.textContent = iva;
     let newCellIMartilloRef= newTransactionRowRef.insertCell(3);
     newCellIMartilloRef.textContent = iMartillo;
     let newCellTotalRef = newTransactionRowRef.insertCell(4);
    
     newCellTotalRef.textContent = total;
     return total;

  }


//DESCARGAR EN FORMATO EXCEL 

   function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}

//LIMPIAR VISTA PREVIA

const Limpiar = () =>

{
  getProduct.value = null;
  getValue.value = null;
  setProduct.textContent = "";
  setValor.textContent = "";
  setIva.textContent = "";
  setIMartillo.textContent = "";
  setTotal.textContent = "";
  
}



//RESUMEN DE VALORES INGRESADOS EN FORM DATOS

const resumenDataForm = (valorProducto = 0)=> {
  const resumen = document.getElementById("Data-form");
  const valorActual = getCapital.value - valorProducto;
  resumen.innerHTML = `  <p class="resumen">Capital:${formatNumber.new(valorActual,"$")} | Iva:${getIva.value}% | IMartillo:${getIMartillo.value}% <br>
  <a href="./index.html">volver</a></p>
`
}

  //OBJ FORMAT NUMBER

  var formatNumber = {
    separador: ".", // separador para los miles
    sepDecimal: ',', // separador para los decimales
    formatear:function (num){
    num +='';
    var splitStr = num.split('.');
    var splitLeft = splitStr[0];
    var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
    var regx = /(\d+)(\d{3})/;
    while (regx.test(splitLeft)) {
    splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
    }
    return this.simbol + splitLeft +splitRight;
    },
    new:function(num, simbol){
    this.simbol = simbol ||'';
    return this.formatear(num);
    }
   }