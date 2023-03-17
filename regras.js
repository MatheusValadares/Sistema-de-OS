
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/*                  ORDEM DE SERVIÇO                      */

const regrasOs = {


  lerContador: async function () {
    let numero = false;

    await db.collection("gerador").doc("osnumero").get().then((snapshot) => {
      doc = snapshot.data();
      numero = doc.numero;
    })
      .catch(() => {
        numero = false;
      });

    return numero;
  },

  atualizarContador: async function (numeroAtualizado) {

    let atualizacao = true;

    await db.collection("gerador").doc("osnumero").update(
      {
        numero: numeroAtualizado,
      }
    ).catch(err => {
      atualizacao = false
    })

    return atualizacao;

  },


  criarDoc: async function (secao, cliente, nivel, responsavel, problema, relato, numero) {

    let resultado = true;

    await db.collection(secao).add({
      cliente: cliente,
      nivel: nivel,
      responsavel: responsavel,
      problema: problema,
      abertura: firebase.firestore.Timestamp.fromDate(new Date()),
      aberturaSegundos: firebase.firestore.Timestamp.fromDate(new Date()).seconds,
      relato: relato,
      status: "Aberta",
      numero: numero,
    }).catch((erro) => {
      resultado = false;
      console.log(erro);
    });

    return resultado

  },

  pesquisarOs: async function (secao, propriedade, valor) {

    let dados = [];

    await db.collection(secao).where(propriedade, "==", valor).get().then((snapshot) => {

      snapshot.forEach(doc => {
        let obj = doc.data();
        obj.id = doc.id;
        dados.push(obj);
      })

    })
      .catch(() => {
        dados = false;
      });

    return dados;

  },

  pesquisarOsData: async function (filtro, de, ate,) {
    let dados = [];

    if (filtro == "Data de Abertura") {
      await db.collection("os").where("aberturaSegundos", ">=", de).where("aberturaSegundos", "<=", ate).get().then((snapshot) => {
        snapshot.forEach(doc => {
          let obj = doc.data();
          obj.id = doc.id;
          dados.push(obj);
        })

      }).catch(() => {
        dados = false;
      });
    } else {
      await db.collection("os").where("fechamentoSegundos", ">=", de).where("fechamentoSegundos", "<=", ate).get().then((snapshot) => {
        snapshot.forEach(doc => {
          let obj = doc.data();
          obj.id = doc.id;
          dados.push(obj);
        })

      }).catch((erro) => {
        dados = false;
      });
    }

    return dados;

  },

  alterarDoc: async function (secao, id, cliente, nivel, responsavel, problema, status, relato, solucao) {
    let resultado = true;

    await db.collection(secao).doc(id).update(
      {
        cliente: cliente,
        nivel: nivel,
        responsavel: responsavel,
        problema: problema,
        status: status,
        relato: relato,
        solucao: solucao,
      }
    ).then(() => {
      console.log("Alteração realizada")
    }).catch(err => {
      resultado = false;
    })

    return resultado;

  },

  fecharOs: async function (secao, id, solucao) {
    let resultado = true;

    await db.collection(secao).doc(id).update(
      {
        solucao: solucao,
        status: "Fechada",
        fechamento: firebase.firestore.Timestamp.fromDate(new Date()),
        fechamentoSegundos: firebase.firestore.Timestamp.fromDate(new Date()).seconds,
      }
    ).then(() => {
      console.log("Alteração realizada")
    }).catch(err => {
      resultado = false;
    })

    return resultado;

  },


}







/*                     CLIENTES                          */

const regrasClientes = {

  criarDoc: async function (secao, nome, endereco) {

    let resultado = true;

    await db.collection(secao).add({
      nome: nome,
      endereco: endereco,
    }).catch((erro) => {
      resultado = false;
      console.log(erro);
    });

    return resultado

  },

  alterarDoc: async function (secao, id, nome, endereco) {
    let resultado = true;

    await db.collection(secao).doc(id).update(
      {
        nome: nome,
        endereco: endereco,
      }
    ).then(() => {
      console.log("Alteração realizada")
    }).catch(err => {
      resultado = false;
      console.log(err)
    })

    return resultado;

  },

}









/*                          COLABORADORES                         */

const regrasColaboradores = {

  criarDoc: async function (secao, nome, email, senha, funcao) {
    let resultado = true;
    await db.collection(secao).add({
      nome: nome,
      email: email,
      senha: senha,
      funcao: funcao,
    }).catch((erro) => {
      resultado = false;
      console.log(erro);
    });

    return resultado

  },


  alterarDoc: async function (secao, id, nome, email, senha, funcao) {
    let resultado = true;

    await db.collection(secao).doc(id).update(
      {
        nome: nome,
        email: email,
        senha: senha,
        funcao: funcao,
      }
    ).then(() => {
      console.log("Alteração realizada")
    }).catch(err => {
      resultado = false;
    })

    return resultado;

  },


}



/*                     GERAL                             */


const regrasGerais = {

  lerColecao: async function (secao) {
    let dados = [];

    await db.collection(secao).get().then((snapshot) => {

      snapshot.forEach(doc => {
        let obj = doc.data();
        obj.id = doc.id;
        dados.push(obj);
      })

    }).catch(() => {
      dados = false;
    })

    return dados;
  },


  lerDoc: async function (secao, id) {
    let documento = "";

    await db.collection(secao).doc(id).get().then((snapshot) => {

      documento = snapshot.data();
      documento.id = id;

    })
      .catch(() => {
        documento = false;
      });


    return documento;
  },

  pesquisarDoc: async function (secao, nome) {

    let dados = [];

    await db.collection(secao).where("nome", "==", nome).get().then((snapshot) => {

      snapshot.forEach(doc => {
        let obj = doc.data();
        obj.id = doc.id;
        dados.push(obj);
      })

    })
      .catch(() => {
        dados = false;
      });

    return dados;


  },

  deletarDoc: async function (secao, id) {

    let resultado = true;

    await db.collection(secao).doc(id).delete()
      .then(() => {
        console.log("Excluído com sucesso")
      }).catch(err => {
        resultado = false;
        console.log(err)
      })

    return resultado;

  },




}
