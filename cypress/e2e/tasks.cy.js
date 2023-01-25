/// <reference types = "cypress"/>

describe("tarefas", () => {

	let testeData;

	//executado uma vez para todos os contextos e casos de testes

	before(()=>{
		cy.fixture('tasks').then(t =>{
			testeData = t
		})

		
	})

	context('cadastro', () => {
		//caso de uso
		it("deve cadastrar uma nova tarefa", () => {
			//deletar a tarefa antes de começar o teste / preparar o terreno
			// foi solicitado ao dev um helper

			const taskName = "Ler um livro de node.js"

			cy.removeTaskByName(taskName)

			//steps

			cy.createTask(taskName)

			cy.contains("main div p", taskName).should("be.visible");
		});

		it("não deve permitir tarefa duplicada", () => {


			// Criação de contante da massa de testes - interessante usar objeto nesse caso porque o create exige um objeto

			const task = testeData.dup

			//Limpar o helper

			cy.removeTaskByName(task.name)

			// Dado que eu tenho uma tarefa duplicada - faço a postagem via api

			cy.postTask(task)

			// Quando faço o cadastro dessa tarefa
			cy.createTask(task.name)

			// Então vejo a mensagem de duplicidade
			//pegar o modal de erro
			cy.get('.swal2-html-container')
				.should('be.visible') //tm que estar visivel
				.should('have.text', 'Task already exists!') // texto que aparece no modal

		});

		it('campo obrigatório', () => {

			cy.createTask()

			cy.isRequired('This is a required field')
		})
	})

	context('atualização', ()=>{
		
		it('deve concluir uma tarefa', ()=>{
			
			const task = testeData.att

			cy.removeTaskByName(task.name)
			cy.postTask(task)

			cy.visit('/')

			cy.contains('p', task.name)
				.parent()
				.find('button[class*=ItemToggle]')
				.click()

			cy.contains('p', task.name)
				.should('have.css', 'text-decoration-line','line-through')
		})
	})

	context('exclusão', ()=>{
		
		it('deve remover uma tarefa', ()=>{
			
			const task = testeData.del

			cy.removeTaskByName(task.name)
			cy.postTask(task)

			cy.visit('/')

			cy.contains('p', task.name)
				.parent()
				.find('button[class*=ItemDelete]')
				.click()

			cy.contains('p', task.name)
				.should('not.exist')
		})
	})

});


