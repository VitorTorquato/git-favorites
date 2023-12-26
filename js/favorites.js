import { GithubUser } from "./githubuser.js"

//Classe que vai conter a logica dos dados e estruturar eles
export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.load()

       // GithubUser.search('vitortorquato').then(user => console.log(user))

    }
 load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

 }

 save(){
    localStorage.setItem('@github-favorites:' , JSON.stringify(this.entries))
 }

 async add(username){
    try{
        const userExist = this.entries.find(entry => entry.login === username)

        

        if(userExist){
        throw new Error('Usuário já cadastrado')
      }
 

    const user = await GithubUser.search(username) 
       
    if(user.login === undefined){
            throw new Error('Usuario não encontrado')
        }

        this.entries = [user, ...this.entries]
        this.update()
        this.save()
    }catch(error){
        alert(error.message)
    }
 }
 
 delete(user){
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
 }
    
}
//classe que vai criar o HTML
export class FavoriteView extends Favorites{
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('table tbody')
        
        this.update()
        this.onAdd()
    }

    
    onAdd(){
        const addButton= this.root.querySelector('.search button')
        addButton.onclick = () =>{
            const {value} = this.root.querySelector('.search input')

            this.add(value)
            this.favoriteAdd()
        }
    }
    
    update() {
        this.removeAllTr()
        this.favoriteAdd()
   
   
      this.entries.forEach(user => {
        const row = this.createRow()
        
        row.querySelector('.user img').src = `https://github.com/${user.login}.png`
        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.user a').href = `https://github.com/${user.login}`
        row.querySelector('.user span').textContent = user.login
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers

        row.querySelector('.remove').onclick = () => {
            const isOK = confirm('Tem certeza que deseja deletar essa linha?')
            if(isOK){
                this.delete(user)
            }
        }

        
        
        this.tbody.append(row)
    })

    
    }
    
    createRow(){
        const tr = document.createElement('tr')
      
        tr.innerHTML =   
        `
        <td class="user">
            <img src="https://github.com/vitortorquato.png" alt="Vitor Torquato Image">
            <a href="https://github.com/maykbrito">
                <p>Vitor Torquato</p>
                <span>/vitortorquato</span>
            </a>
           
        </td>
        <td class="repositories">11</td>
        <td class="followers">1</td>
        <td ><button class="remove" >Remover</button>
        </td>
    `
    return tr

    
    }
    
    
    removeAllTr(){
       
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
        
        
    }


    favoriteAdd(){
       if(this.entries.length === 0){
        this.root.classList.add('noFav')
       }else{
        this.root.classList.remove('noFav')
       }
    }
}


