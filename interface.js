/*                      INICIAR                             */
criarTabelaOs()
criarTabelaClientes()
criarTabelaColaboradores();
var caixaClientes = [];
var caixaColaboradores = [];



/*                 SEÇÃO ORDENS DE SERVIÇO               */

async function criarTabelaOs() {

  $("#tabelaOs").empty();

  let dados = await regrasGerais.lerColecao("os");

  if(dados === false){
    reportarErro("Problema ao coletar dados! Reinicie a página", 5000);
  }else {
    dados.forEach(element => {
    let numero = element.numero;
    let cliente = element.cliente;
    let nivel = element.nivel;
    let problema = element.problema;
    let abertura = formatarData(element.abertura.seconds*1000);
    if(element.fechamento){
     fechamento = formatarData(element.fechamento.seconds*1000);
    }else {fechamento = "";};
    let responsavel = element.responsavel;
    let status = element.status;
    let elementoDaTabela =  `<tr id="${element.id}"
    data-toggle="modal" data-target="#dadosOs" onclick="criarModalOs(this)">
    <td>${numero}</td>
    <td>${cliente}</td> 
    <td>${nivel}</td>
    <td>${problema}</td>
    <td>${abertura}</td>
    <td>${fechamento}</td>
    <td>${responsavel}</td>
    <td>${status}</td>
  </tr>`;
    $("#tabelaOs").append(elementoDaTabela);

  });
  }

}

async function criarModalOs(elemento) {
  limparModalOs();
  let id = elemento.id;
  let doc = await regrasGerais.lerDoc("os", id)
  if(doc === false) {
    reportarErro("Problema ao coletar dados da ordem de serviço! Reinicie a página", 5000);
  }else {
    $("#modalOsNumero").val(doc.numero);
    criarOpcao("#modalOsCliente", caixaClientes, doc.cliente);
    $("#modalOsNivel").val(doc.nivel)
    criarOpcao("#modalOsResponsavel", caixaColaboradores, doc.responsavel);
    $("#modalOsProblema").val(doc.problema);
    $("#modalOsStatus").val(doc.status)
    $("#modalOsAbertura").val(dataBootstrap(doc.abertura.seconds*1000))
    if(doc.fechamento){
      $("#modalOsFechamento").val(dataBootstrap(doc.fechamento.seconds*1000));
     }
    $("#modalOsRelato").val(doc.relato);
    $("#modalOsSolucao").val(doc.solucao)
    $("#dadosOs").attr("key", doc.id)
  }

}


async function criarOs() {

  let cliente = $("#addOsCliente").val();
  let nivel = $("#addOsNivel").val();
  let responsavel = $("#addOsResponsavel").val();
  let problema = $("#addOsProblema").val();
  let relato = $("#addOsRelato").val();
  let numero = await regrasOs.lerContador();
  let atualizarNumero = numero + 1;
  let atualizacao = await regrasOs.atualizarContador(atualizarNumero);

  if(relato !== "" && numero != false &&  atualizacao !== false) {
  
    let resultado = await regrasOs.criarDoc("os", cliente, nivel, responsavel, problema, relato, numero);

      if(resultado === false) {
        reportarErro("Problema ao salvar os dados! Tente novamente!", 5000)
      } else{
            $("#addOsRelato").val("");
            criarTabelaOs();
            reportarSucesso("Cadastro realizado com sucesso!", 4000)
      }

  } else {
    reportarErro("Todos os campos devem ser preenchidos", 4000)
  }


}

async function filtrarOs() {

  let numero = parseInt($("#numerodaos").val());
  let status = $("#status").val();
  let cliente = $("#filtroClienteOs").val();
  let data = $("#filtroData").val();
  let dataInicio= dataEmSegundos($("#dataInicio").val());
  let dataFim = dataEmSegundos($("#dataFim").val());

  if(numero){
    let dados = await regrasOs.pesquisarOs("os", "numero", numero);
    if(dados.length === 0){
      criarTabelaOs();
      reportarErro("Não encontramos nenhuma OS com esse número!", 4000);
    }else {
      $("#tabelaOs").empty();
      criarElementosOs(dados);
    }
  }else {
    if(status && !cliente && data == "Todos"){
      let dados = await regrasOs.pesquisarOs("os", "status", status);
      if(dados.length === 0){
        criarTabelaOs();
        reportarErro("Não encontramos nenhuma OS com esse status!", 4000);
      }else {
        $("#tabelaOs").empty();
        criarElementosOs(dados);
      }   
    }else if(status && cliente && data == "Todos"){
      let resultado = [];
      let dados = await regrasOs.pesquisarOs("os", "status", status);
      if(dados.length === 0){
        criarTabelaOs();
        reportarErro("Não encontramos nenhuma OS com esse status!", 4000);
      };
      $("#tabelaOs").empty();
      dados.forEach(obj => {
        if(obj.status == status && obj.cliente == cliente) {
          resultado.push(obj);
        }
      })
      if(resultado.length != 0) {
        $("#tabelaOs").empty();
        criarElementosOs(resultado);
      }else{
        criarTabelaOs();
        reportarErro("Não encontramos nenhuma OS com esse status e cliente!", 5000);
      }
    }else if(!status && cliente && data == "Todos"){
      let dados = await regrasOs.pesquisarOs("os", "cliente", cliente);
      if(dados.length === 0){
        criarTabelaOs();
        reportarErro("Não encontramos nenhuma OS com esse status!", 4000);
      }else {
        $("#tabelaOs").empty();
        criarElementosOs(dados);
      } 
    }else if(data != "Todos" && !status && !cliente){
      let dados = await regrasOs.pesquisarOsData(data, dataInicio, dataFim);
      if(dados.length === 0){
        criarTabelaOs();
        reportarErro("Não encontramos nenhuma OS entre as datas determinadas!", 5000);
      }else {
        $("#tabelaOs").empty();
        criarElementosOs(dados);
      } 
    }else if(data != "Todos" && status && !cliente){
      let dados = await regrasOs.pesquisarOsData(data, dataInicio, dataFim);
      let resultado = [];
      if(dados.length === 0){
        criarTabelaOs();
        reportarErro("Não encontramos nenhuma OS com esse status!", 4000);
      }else {
        $("#tabelaOs").empty();
        dados.forEach(obj => {
          if(obj.status == status) {
            resultado.push(obj);
          }
        })
        if(resultado.length != 0) {
          $("#tabelaOs").empty();
          criarElementosOs(resultado);
        }else{
          criarTabelaOs();
          reportarErro("Não encontramos nenhuma OS com esse status no período determinado!", 4000);
        }
      } 
    }else if(data != "Todos" && !status && cliente){
      let dados = await regrasOs.pesquisarOsData(data, dataInicio, dataFim);
      let resultado = [];
      if(dados.length === 0){
        criarTabelaOs();
        reportarErro("Não encontramos nenhuma OS com esse status!", 4000);
      }else {
        $("#tabelaOs").empty();
        dados.forEach(obj => {
          if(obj.cliente == cliente) {
            resultado.push(obj);
          }
        })
        if(resultado.length != 0) {
          $("#tabelaOs").empty();
          criarElementosOs(resultado);
        }else{
          criarTabelaOs();
          reportarErro("Não encontramos nenhuma OS com esse cliente no período determinado!", 4000);
        }
      } 
    }else if(data != "Todos" && status && cliente){
      let dados = await regrasOs.pesquisarOsData(data, dataInicio, dataFim);
      let resultado = [];
      if(dados.length === 0){
        criarTabelaOs();
        reportarErro("Não encontramos nenhuma OS com esse status!", 4000);
      }else {
        dados.forEach(obj => {
          if(obj.status == status && obj.cliente == responsavel) {
            resultado.push(obj);
          }
        });
        if(resultado.length != 0) {
          $("#tabelaOs").empty();
          criarElementosOs(resultado);
        }else{
          criarTabelaOs();
          reportarErro("Não encontramos nenhuma OS com esse status e cliente no período determinado!", 4000);
        }
        
      } 
    }

  }

  

}

function editarOs() {
  let finalizar = $("#botaoFinalizarOs").attr("onclick");
  let status = $("#modalOsStatus").val();

  if(status != "Fechada") {
    if(finalizar == "finalizarOs()") {
    $("#mudancaOs").removeAttr("disabled");
  
    $("#botaoEditarOs").remove();
    $("#botoesDadosOs").prepend(`<button id='botaoSalvarOs' type='button' class='btn btn-success mx-1' role='button' data-dismiss="modal"
    onclick='salvarAlteracaoOs()'>Salvar</button>`);
    }else {
    reportarErro("Não é possível editar e finalizar ao mesmo tempo!", 5000);
    }
  }else {
    reportarErro("Não é possivel editar uma ordem de serviço que já foi fechada!", 5000);
  }

}

async function salvarAlteracaoOs() {

  let id = $("#dadosOs").attr("key");
  let cliente = $("#modalOsCliente").val();
  let nivel = $("#modalOsNivel").val();
  let responsavel = $("#modalOsResponsavel").val();
  let problema = $("#modalOsProblema").val();
  let status = $("#modalOsStatus").val();
  let relato = $("#modalOsRelato").val();
  let solucao = $("#modalOsSolucao").val();

  if(relato !== "") {
    
    let resultado = await regrasOs.alterarDoc("os", id, cliente, nivel, responsavel, problema, status, relato, solucao);
  
    if(resultado === false) {
    reportarErro("Problema ao salvar os dados! Tente novamente!", 5000);
    }else{
    $("#mudancaOs").attr("disabled", "disabled");
    $("#botaoSalvarOs").remove();
    $("#botoesDadosOs").prepend(`<button id="botaoEditarOs" type="button" class="btn btn-info mx-1" role="button"
    onclick="editarOs()">Editar</button>`);
    criarTabelaOs();
    reportarSucesso("Alteração salva com sucesso", 4000);
    }
  } else {
    reportarErro("O relato deve estar preenchido!", 4000)
  }

}


function finalizarOs() {
  let salvar = $("#botaoEditarOs").attr("onclick");
  let status = $("#modalOsStatus").val();

  if(status != "Fechada") {
    if(salvar == "editarOs()") {
    $("#mudancaOsSolucao").removeAttr("disabled");
  
    $("#botaoFinalizarOs").replaceWith(`<button id="botaoFinalizarOs" type="button" class="btn btn-success mx-1"  data-dismiss="modal" role="button"
     onclick="salvarFinalizacao()">Finalizar</button>`);
    }else {
    reportarErro("Não é possível editar e finalizar ao mesmo tempo!", 5000);
    }
  }else {
  reportarErro("Não é possivel finalizar uma ordem de serviço que já foi fechada!", 5000);
  }

}

async function salvarFinalizacao() {

  let id = $("#dadosOs").attr("key");
  let solucao = $("#modalOsSolucao").val();

  if(solucao !== "") {
    
    let resultado = await regrasOs.fecharOs("os", id,  solucao);
  
    if(resultado === false) {
    reportarErro("Problema ao salvar os dados! Tente novamente!", 5000);
    }else{
    $("#mudancaOsSolucao").attr("disabled", "disabled");
    $("#botaoFinalizarOs").replaceWith(`<button id="botaoFinalizarOs" type="button" class="btn btn-info mx-1" role="button"
    onclick="finalizarOs()">Finalizar</button>`);
    criarTabelaOs();
    reportarSucesso("Alteração salva com sucesso", 4000);
    }
  } else {
    reportarErro("A solução deve estar preenchida!", 4000)
  }

}



function limparModalOs() {
  $("#mudancaOs").attr("disabled", "disabled");
  $("#botaoSalvarOs").remove();
  $("#botaoEditarOs").remove();
  $("#botoesDadosOs").prepend(`<button id="botaoEditarOs" type="button" class="btn btn-info mx-1" role="button"
  onclick="editarOs()">Editar</button>`);
  $("#mudancaOsSolucao").attr("disabled", "disabled");
  $("#botaoFinalizarOs").replaceWith(`<button id="botaoFinalizarOs" type="button" class="btn btn-info mx-1" role="button"
  onclick="finalizarOs()">Finalizar</button>`);
}

async function deletarOs() {

let id = $("#dadosOs").attr("key");
let resultado = await regrasGerais.deletarDoc("os", id);
if(resultado === false) {
  reportarErro("Problema ao excluir os dados! Tente novamente!", 5000);
}else {
  criarTabelaOs();
  reportarSucesso("OS excluida com sucesso!", 4000)
}

}


function liberarCampos(elemento) {

  if(elemento.value == "Todos") {
    $("#dataInicio").val("");
    $("#dataFim").val("");
    $("#campoDatas").attr("disabled", "disabled");
    $("#corDatas").toggleClass("text-secondary");
  }else{
    $("#corDatas").toggleClass("text-secondary");
    $("#campoDatas").removeAttr("disabled");
  }

}


function criarElementosOs(dadosSelecionados) {
  dadosSelecionados.forEach(element => {
    let numero = element.numero;
    let cliente = element.cliente;
    let nivel = element.nivel;
    let problema = element.problema;
    let abertura = formatarData(element.abertura.seconds*1000);
    if(element.fechamento){
     fechamento = formatarData(element.fechamento.seconds*1000);
    }else {fechamento = "";};
    let responsavel = element.responsavel;
    let status = element.status;
    let elementoDaTabela =  `<tr id="${element.id}"
    data-toggle="modal" data-target="#dadosOs" onclick="criarModalOs(this)">
    <td>${numero}</td>
    <td>${cliente}</td> 
    <td>${nivel}</td>
    <td>${problema}</td>
    <td>${abertura}</td>
    <td>${fechamento}</td>
    <td>${responsavel}</td>
    <td>${status}</td>
  </tr>`;
    $("#tabelaOs").append(elementoDaTabela);

  });
}

function criarCampoCliente(){
  $("#filtroClienteOs").empty();
  $("#filtroClienteOs").append(`<option value=""> </option>`);
  caixaClientes.forEach(elemento => {
      $("#filtroClienteOs").append(`<option>${elemento}</option>`);
  });
}


function criarOpcao(elementoPai, dados, selecionado) {
  $(elementoPai).empty();

  dados.forEach(elemento => {
  if(elemento == selecionado) {
    $(elementoPai).append((`<option selected>${elemento}</option>`));
  } else {
    $(elementoPai).append((`<option>${elemento}</option>`));
  }
  });

}

function atualizarSelecao() {
  $("#addOsCliente").empty();
  $("#addOsResponsavel").empty();
  criarOpcao("#addOsCliente", caixaClientes, "vazio");
  criarOpcao("#addOsResponsavel", caixaColaboradores, "vazio");
  criarOpcao("#filtroClienteOs", caixaClientes, "vazio");
}

function dataBootstrap(elemento) {
  let data = new Date(elemento);
  let dataFormatada = (data.getFullYear() + "-" + (adicionaZero(data.getMonth() + 1)) + "-" + adicionaZero((data.getDate() ))) +"T"+
  adicionaZero(data.getHours()) + ":" + adicionaZero(data.getMinutes());                 
  return dataFormatada;

}


function formatarData(date) {
  let data = new Date(date);
  let dataFormatada = (adicionaZero(data.getDate()) + "/" +
   adicionaZero((data.getMonth() + 1)) + "/" + data.getFullYear() + " " +
   adicionaZero(data.getHours()) + ":" + adicionaZero(data.getMinutes())); 
  return dataFormatada;
}

function adicionaZero(numero){
  if (numero <= 9) 
      return "0" + numero;
  else
      return numero; 
}

function dataEmSegundos(elemento) {
  let d = elemento;
  let data = Date.parse(d + "T00:00:00")/1000;
  return data;

}






/*                      SEÇÃO CLIENTES                     */

async function criarTabelaClientes() {

  $("#tabelaClientes").empty();
  caixaClientes = [];
  let dados = await regrasGerais.lerColecao("clientes");

  if(dados === false){
    reportarErro("Problema ao coletar dados! Reinicie a página", 5000);
  }else {
    dados.forEach(element => {
    let nome = element.nome;
    let endereco = element.endereco;
    let elementoDaTabela =  `<tr id="${element.id}" data-toggle="modal" data-target="#dadosCliente" onclick="criarModalCliente(this)">
    <td>${nome}</td>
    <td>${endereco}</td>
    </tr>`;
    $("#tabelaClientes").append(elementoDaTabela);
    caixaClientes.push(element.nome);
  });
  }

}

async function criarModalCliente(elemento) {
  limparModalClientes();
  let id = elemento.id;
  let doc = await regrasGerais.lerDoc("clientes", id)
  if(doc === false) {
    reportarErro("Problema ao coletar dados do cliente! Reinicie a página", 5000);
  }else {
    $("#modalClienteNome").val(doc.nome);
    $("#modalClienteEndereco").val(doc.endereco);
    $("#dadosCliente").attr("key", doc.id)
  }

}

async function criarCliente() {
  let nome = $("#addClienteNome").val();
  let endereco = $("#addClienteEndereco").val();

  if(nome !== "" && endereco !== "") {

    let resultado = await regrasClientes.criarDoc("clientes", nome, endereco);
    console.log(resultado)

      if(resultado === false) {
        reportarErro("Problema ao salvar os dados! Tente novamente!", 5000)
      } else{
            $("#addClienteNome").val("");
            $("#addClienteEndereco").val("");
            criarTabelaClientes();
            reportarSucesso("Cadastro realizado com sucesso!", 4000)
      }

  } else {
    reportarErro("Todos os campos devem ser preenchidos", 4000)
  }


}

async function filtrarCliente() {

  let nomeFiltrado = $("#nomeCliente").val();

  let dados = await regrasGerais.pesquisarDoc("clientes", nomeFiltrado)

  if(dados === false) {
    reportarErro("Problema ao coletar dados! Reinicie a página", 5000);
  } else{

       if(dados.length != 0) {

        $("#tabelaClientes").empty();

        dados.forEach(element => {
          let nome = element.nome;
          let endereco = element.endereco;
          let elementoDaTabela =  `<tr id="${element.id}" data-toggle="modal" data-target="#dadosCliente" onclick="criarModalCliente(this)">
          <td>${nome}</td>
          <td>${endereco}</td>
          </tr>`;
          $("#tabelaClientes").append(elementoDaTabela);
        })

        $("#nomeCliente").val("");
        
         } else {
        reportarErro("Não encontramos nenhum cliente com esse nome! Confira se o nome foi escrito corretamente, letras maiúsculas e acentos também são considerados.", 8000);
       }
  }

}

function editarCliente() {
  $("#mudancaCliente").removeAttr("disabled");
  
  $("#botaoEditarCliente").remove();
  $("#botoesDadosCliente").prepend(`<button id='botaoSalvarCliente' type='button' class='btn btn-success mx-1' role='button' data-dismiss="modal"
  onclick='salvarAlteracaoCliente()'>Salvar</button>`);

}

async function salvarAlteracaoCliente() {

  let id = $("#dadosCliente").attr("key");
  let nome = $("#modalClienteNome").val();
  let endereco = $("#modalClienteEndereco").val();

  if(nome !== "" && endereco !== "") {
    
    let resultado = await regrasClientes.alterarDoc("clientes", id, nome, endereco);
  
    if(resultado === false) {
    reportarErro("Problema ao salvar os dados! Tente novamente!", 5000);
    }else{
    $("#mudancaCliente").attr("disabled", "disabled");
    $("#botaoSalvarCliente").remove();
    $("#botoesDadosCliente").prepend(`<button id="botaoEditarCliente" type="button" class="btn btn-info mx-1" role="button"
    onclick="editarCliente()">Editar</button>`);
    criarTabelaClientes();
    reportarSucesso("Alteração salva com sucesso", 4000);
    }
  } else {
    console.log(resultado);
    reportarErro("Todos os campos devem ser preenchidos", 4000)
  }

}

function limparModalClientes() {
    $("#mudancaCliente").attr("disabled", "disabled");
    $("#botaoSalvarCliente").remove();
    $("#botaoEditarCliente").remove();
    $("#botoesDadosCliente").prepend(`<button id="botaoEditarCliente" type="button" class="btn btn-info mx-1" role="button"
    onclick="editarCliente()">Editar</button>`);
    $("#modalClienteNome").val("");
    $("#modalClienteEndereco").val("");

}

async function deletarCliente() {

  let id = $("#dadosCliente").attr("key");
  let resultado = await regrasGerais.deletarDoc("clientes", id);
  if(resultado === false) {
    reportarErro("Problema ao excluir os dados! Tente novamente!", 5000);
  }else {
    criarTabelaClientes();
    reportarSucesso("Cliente excluido com sucesso!", 4000)
  }
  
}




/*                       SEÇÃO COLABORADORES                */

async function criarTabelaColaboradores() {
  caixaColaboradores = [];
  $("#tabelaColaboradores").empty();

  let dados = await regrasGerais.lerColecao("colaboradores");

  if(dados === false){
    reportarErro("Problema ao coletar dados! Reinicie a página", 5000);
  }else {
    dados.forEach(element => {
    let nome = element.nome;
    let funcao = element.funcao;
    let elementoDaTabela = `<tr id="${element.id}" data-toggle="modal" data-target="#dadosColaborador" onclick="criarModalColaborador(this)">
    <td>${nome}</td>
    <td>${funcao}</td>
    </tr>`

    $("#tabelaColaboradores").append(elementoDaTabela)
    caixaColaboradores.push(element.nome);

  });
}

}

async function criarModalColaborador(elemento) {
  limparModalColaboradores();
  let id = elemento.id;
  let doc = await regrasGerais.lerDoc("colaboradores", id)
  if(doc === false) {
    reportarErro("Problema ao coletar dados do colaborador! Reinicie a página", 5000);
  }else {
    $("#modalColaboradorNome").val(doc.nome);
    $("#modalColaboradorEmail").val(doc.email);
    $("#modalColaboradorSenha").val(doc.senha);
    $("#modalColaboradorFuncao").val(doc.funcao);
    $("#dadosColaborador").attr("key", doc.id)
  }

}

async function criarColaborador() {
  let nome = $("#addColaboradorNome").val();
  let email = $("#addColaboradorEmail").val();
  let senha = $("#addColaboradorSenha").val();
  let funcao = $("#addColaboradorFuncao").val();

  if(nome !== "" && email !== "" && senha !== "") {

    let resultado = await regrasColaboradores.criarDoc("colaboradores", nome, email, senha, funcao);

      if(resultado === false) {
        reportarErro("Problema ao salvar os dados! Tente novamente!", 5000)
      } else{
            $("#addColaboradorNome").val("");
            $("#addColaboradorEmail").val("");
            $("#addColaboradorSenha").val("");
            criarTabelaColaboradores();
            reportarSucesso("Cadastro realizado com sucesso!", 4000)
      }

  } else {
    reportarErro("Todos os campos devem ser preenchidos", 4000)
  }


}


async function filtrarColaborador() {

  let nomeFiltrado = $("#nomeColaborador").val();

  let dados = await regrasGerais.pesquisarDoc("colaboradores", nomeFiltrado)

  if(dados === false) {
    reportarErro("Problema ao coletar dados! Reinicie a página", 5000);
  } else{

       if(dados.length != 0) {

          $("#tabelaColaboradores").empty();

           dados.forEach(element => {
           let nome = element.nome;
          let funcao = element.funcao;
           let elementoDaTabela = `<tr id="${element.id}" data-toggle="modal" data-target="#dadosColaborador" onclick="criarModalColaborador(this)">
          <td>${nome}</td>
          <td>${funcao}</td>
          </tr>` 
          $("#tabelaColaboradores").append(elementoDaTabela)
          })

        $("#nomeColaborador").val("");

         } else {
        reportarErro("Não encontramos nenhum colaborador com esse nome! Confira se o nome foi escrito corretamente, letras maiúsculas e acentos também são considerados.", 8000);
       }
  }

}

function editarColaborador() {
  $("#mudancaColaborador").removeAttr("disabled");
  
  $("#botaoEditarColaborador").remove();
  $("#botoesDadosColaborador").prepend(`<button id='botaoSalvarColaborador' type='button' class='btn btn-success mx-1' role='button' data-dismiss="modal"
  onclick='salvarAlteracaoColaborador()'>Salvar</button>`);
}

async function salvarAlteracaoColaborador() {

  let id = $("#dadosColaborador").attr("key");
  let nome = $("#modalColaboradorNome").val();
  let email = $("#modalColaboradorEmail").val();
  let senha = $("#modalColaboradorSenha").val();
  let funcao = $("#modalColaboradorFuncao").val();

  if(nome !== "" && email !== "" && senha !== "") {
    
    let resultado = await regrasColaboradores.alterarDoc("colaboradores", id, nome, email, senha, funcao);
  
    if(resultado === false) {
    reportarErro("Problema ao salvar os dados! Tente novamente!", 5000);
    }else{
    $("#mudancaColaborador").attr("disabled", "disabled");
    $("#botaoSalvarColaborador").remove();
    $("#botoesDadosColaborador").prepend(`<button id="botaoEditarColaborador" type="button" class="btn btn-info mx-1" role="button"
    onclick="editarColaborador()">Editar</button>`);
    criarTabelaColaboradores();
    reportarSucesso("Alteração salva com sucesso", 4000);
    }
  } else {
    reportarErro("Todos os campos devem ser preenchidos", 4000)
  }

}

function limparModalColaboradores() {
  $("#modalColaboradorNome").val("");
  $("#modalColaboradorEmail").val("");
  $("#modalColaboradorSenha").val("");
  $("#modalColaboradorFuncao").val("");
  $("#mudancaColaborador").attr("disabled", "disabled");
  $("#botaoSalvarColaborador").remove();
  $("#botaoEditarColaborador").remove();
  $("#botoesDadosColaborador").prepend(`<button id="botaoEditarColaborador" type="button" class="btn btn-info mx-1" role="button"
  onclick="editarColaborador()">Editar</button>`);
}

async function deletarColaborador() {

  let id = $("#dadosColaborador").attr("key");
  let resultado = await regrasGerais.deletarDoc("colaboradores", id);
  if(resultado === false) {
    reportarErro("Problema ao excluir os dados! Tente novamente!", 5000);
  }else {
    criarTabelaColaboradores();
    reportarSucesso("Colaborador excluido com sucesso!", 4000)
  }
  
}





/*                      GERAL                           */

function reportarSucesso(mensagem, tempo) {

  $("body").append(`<div id="alertaSucesso" class="alert alert-success alertas ">
  ${mensagem}
</div>`)

  setTimeout(() => {
    $("#alertaSucesso").remove();
  }, tempo);

}

function reportarErro(mensagem, tempo) {

  $("body").append(` <div id="alertaErro" class="alert alert-danger alertas">
  <strong>Erro:</strong> ${mensagem}
  </div>`)

  setTimeout(() => {
    $("#alertaErro").remove();
  }, tempo);

}




