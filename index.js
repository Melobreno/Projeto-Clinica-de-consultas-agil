const fs = require('fs');
const inputTxt = require('readline');

const rl = inputTxt.createInterface({
  input: process.stdin,
  output: process.stdout
});

let pacientes = []; // Array para armazenar os dados dos pacientes

// Função para carregar dados de pacientes do arquivo JSON
function carregarPacientes() {
  try {
    const data = fs.readFileSync('pacientes.json');
    pacientes = JSON.parse(data);
  } catch (err) {
    pacientes = [];
  }
}

// Função para salvar dados de pacientes no arquivo JSON
function salvarPacientes() {
  fs.writeFileSync('pacientes.json', JSON.stringify(pacientes, null, 2));
}

// Função para carregar dados de consultas do arquivo JSON
function carregarConsultas() {
  try {
    const data = fs.readFileSync('consultas.json');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Função para salvar dados de consultas no arquivo JSON
function salvarConsultas(consultas) {
  fs.writeFileSync('consultas.json', JSON.stringify(consultas, null, 2));
}

// Menu de opções
function exibirMenu() {
  console.log('\nMenu:');
  console.log('1. Cadastrar paciente');
  console.log('2. Marcar consulta');
  console.log('3. Cancelar consulta');
  console.log('4. Visualizar consultas cadastradas');
  console.log('5. Sair do programa');
  rl.question('\nEscolha uma das opções: ', opcao => {
    switch (opcao) {
      case '1':
        cadastrarPaciente();
        break;
      case '2':
        marcarConsulta();
        break;
      case '3':
        cancelarConsulta();
        break;
      case '4':
        visualizarConsultas();
        break;
      case '5':
        console.log('Encerrando o programa.');
        rl.close();
        break;
      default:
        console.log('Opção inválida.');
        exibirMenu();
    }
  });
}

// Função para cadastrar um novo paciente
function cadastrarPaciente() {
  rl.question('Digite o nome do paciente: ', nome => {
    rl.question('Digite o telefone do paciente: ', telefone => {
      pacientes.push({ nome, telefone });
      salvarPacientes();
      console.log(`Paciente ${nome} cadastrado com sucesso.`);
      exibirMenu();
    });
  });
}

// Função para marcar uma consulta
function marcarConsulta() {
  carregarPacientes();
  if (pacientes.length === 0) {
    console.log('Não há pacientes cadastrados.');
    exibirMenu();
    return;
  }
  
  console.log('\nPacientes cadastrados:');
  pacientes.forEach((paciente, index) => {
    console.log(`${index + 1}. ${paciente.nome} - ${paciente.telefone}`);
  });

  rl.question('\nEscolha o número do paciente para marcar a consulta: ', pacienteIndex => {
    const index = parseInt(pacienteIndex) - 1;
    if (index < 0 || index >= pacientes.length || isNaN(index)) {
      console.log('Índice inválido.');
      exibirMenu();
      return;
    }

    rl.question('Digite a especialidade da consulta: ', especialidade => {
      const consulta = { paciente: pacientes[index].nome, telefone: pacientes[index].telefone, especialidade };
      const consultas = carregarConsultas();
      consultas.push(consulta);
      salvarConsultas(consultas);
      console.log(`Consulta marcada para ${consulta.paciente} na especialidade de ${consulta.especialidade}.`);
      exibirMenu();
    });
  });
}

// Cancelar uma consulta
function cancelarConsulta() {
  const consultas = carregarConsultas();
  if (consultas.length === 0) {
    console.log('Não há consultas marcadas.');
    exibirMenu();
    return;
  }

  console.log('\nConsultas marcadas:');
  consultas.forEach((consulta, index) => {
    console.log(`${index + 1}. ${consulta.paciente} - ${consulta.telefone} - ${consulta.especialidade}`);
  });

  rl.question('\nEscolha o número da consulta a ser cancelada: ', consultaIndex => {
    const index = parseInt(consultaIndex) - 1;
    if (index < 0 || index >= consultas.length || isNaN(index)) {
      console.log('Índice inválido.');
      exibirMenu();
      return;
    }

    const consultaCancelada = consultas.splice(index, 1)[0];
    salvarConsultas(consultas);
    console.log(`Consulta de ${consultaCancelada.paciente} na especialidade de ${consultaCancelada.especialidade} cancelada.`);
    exibirMenu();
  });
}

// Função para exibir consultas cadastradas
function visualizarConsultas() {
  const consultas = carregarConsultas();
  if (consultas.length === 0) {
    console.log('Não há consultas marcadas.');
  } else {
    console.log('\nConsultas marcadas:');
    consultas.forEach((consulta, index) => {
      console.log(`${index + 1}. ${consulta.paciente} - ${consulta.telefone} - ${consulta.especialidade}`);
    });
  }

  rl.question('\nPressione Enter para voltar ao menu principal...', () => {
    exibirMenu();
  });
}

// Iniciar o programa
exibirMenu();
carregarPacientes();

// Fechar o readline ao finalizar
rl.on('close', () => {
  process.exit(0);
});
