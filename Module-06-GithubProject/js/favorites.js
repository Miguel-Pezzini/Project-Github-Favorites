
import { GithubUser } from "./GithubUser.js"

// classe que vai conter a logica dos dados
// como os dados serao estruturados
export class Favorites {
    //Constructor(#app)
    constructor(root) {
        // this.#app = document.querySelector("#app")
        this.root = document.querySelector(root)
        this.load()
        // the user is the data in the last .then { login, name, public_repos, followers }
    }

    load() {
        // parse (function that transforms a JSON string into an JSON object)
        // localStorage (A place in your browser that holds data)
        // getItem (A function that works with localStorage to get an item to store)
        this.entries = JSON.parse(localStorage.getItem('$github-favorites:')) || []
    }

    save() {
        localStorage.setItem('$github-favorites:', JSON.stringify(this.entries))
    }
    // async tells to the javascript that the function is async (will wait for a response)
    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('User alredy registered')
            }


          const user = await GithubUser.search(username)
    
          if(user.login === undefined) {
            throw new Error('Usuário não encontrado!')
          }
    
          this.entries = [user, ...this.entries]
          this.update()
          this.save()
    
        } catch(error) {
          alert(error.message)
        }
      }

    delete(user) {
        // Higher-order functions (map, filter, find, reduce)
        // Function filter(boolean, so when it's false it will delete)
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
        // Assigning value for this.entries
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}


// classe que vai criar a visualizacao e eventos do HTML
export class FavoritesView extends Favorites {
    //Constructor(root) = Constructor(#app)
    constructor(root) {
        //Super(#app) (super is the first constructor from Favorites)
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }
    onadd() {
        const addButton = this.root.querySelector('#fav')
        addButton.onclick = () => {
            // destructuring the input object, selecting just the value
            const { value } = this.root.querySelector('#input--fav')


            this.add(value)
        }
    }


    update() {
        // Executing function 'RemoveAllTr'
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.link').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector(`#remove`).onclick = () =>{
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if(isOk) {
                    this.delete(user)
                }
            }
            this.tbody.append(row)
        })
    }

    createRow() {

        const tr = document.createElement('tr')
        
        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/maykbrito.png" alt=""/>
            <a href="https://github.com/maykbrito" target="_blank" class="link">
                <p>Mayk Brito</p>
                <span>maykbrito</span>
            </a>
        </td>
        <td class="repositories">
            76
        </td>
        <td class="followers">
            9000
        </td>
        <td><button id="remove">Remover</button></td>
        `

        return tr
    }

    removeAllTr() {
        // this = #app
        //ForEach is an array function that runs a function for each element
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            //remove is a method that removes the element from the DOM
            tr.remove()
        })
    }
}