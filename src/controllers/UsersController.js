const { hash, compare} = require("bcryptjs")
const AppError = require("../AppError")
const knex = require("../database/knex")

class UsersController {

    async create (request, response) {
        const {name, email, password, avatar} = request.body //Faz a requisição pelo Corpo

        if(!name){
            throw new AppError("Nome é obrigatório!")
        }
        
        await knex("users").first().where("email", email).then((checkEmailExists) => {
            if(checkEmailExists) {
                throw new AppError("Esse E-mail já está em uso")
            }
        })

        const hashedPassword = await hash(password, 8)

        const [id] = await knex("users").insert({name, email, password:hashedPassword, avatar})

        response.json()
    }

    async update (request, response) {
        const { name, email, avatar, password, old_password} = request.body
        const { id } =  request.params

        //pegando a senha atual do usuário cadastrada no Banco
        const userPassword = await knex("users").pluck("password").where({id})
       
        console.log(`Senha antiga: ${userPassword} e old_password: ${old_password}`)

        if(email){
            await knex("users").first().where("email", email).then((checkEmailExists) => {
                if(checkEmailExists) {
                    throw new AppError("Esse E-mail já está em uso")
                }
            })
        }

       /*  await compare(old_password, userPassword, (err, correspondem) => {
            if (!correspondem) {
               return console.log('Senha incorreta. Acesso negado.');
    
            } 
          }); */

     if(password && old_password){ // Usa o "Compare" do bcryptjs para conferir se a senha bate
        const checkOldPassword = await compare(old_password, userPassword)

        if(!checkOldPassword){
            throw new AppError("A senha antiga não confere")
        }
            console.log(`senha confere, atualizar`)
    } 

   await knex("users").update({name, email, password, avatar}).where({id})

    response.json()
           
        
        
    }

    async delete (request, response) {
        const { id } =  request.params

        await knex("users").delete().where({id})

        response.json()
    }
}

module.exports = UsersController