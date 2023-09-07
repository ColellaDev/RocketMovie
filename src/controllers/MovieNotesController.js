const AppError = require("../AppError")
const knex = require("../database/knex")

class MovieNotesController {

    async create (request, response) {
        const {title, description, rating, tags} = request.body
        const {user_id} = request.params

        if(rating < 0 || rating > 5) {
            throw new AppError(`A nota é de 1 a 5`)
        }
       
        const [note_id] = await knex("movieNotes").insert({title, description, rating, user_id})

        const tagsInsert = tags.map(name => {
            return {
              note_id,
              user_id,
              name
            }
          })
      
          await knex("movieTags").insert(tagsInsert)

        response.json()
    }

    async show (request, response) {
        const { id } =  request.params
        
       const note = await knex("movieNotes").first().where({ id })
       const tags = await knex("movieTags").where({note_id: id})

        response.json({
        note, 
        tags})
    }

    async index(request, response) {
        const { title, user_id, tags } = request.query
        
        let notes

        if(tags){
            const filterTags = tags.split(',').map(tag => tag.trim())

            notes = await knex("movieTags")
            .select([
                "movieNotes.id",
                "movieNotes.title",
                "movieNotes.user_id"
            ])
            .where("movieNotes.user_id", user_id)
            .whereLike("movieNotes.title",`%${title}%`)
            .whereIn("name",filterTags)
            .innerJoin("movieNotes", "movieNotes.id", "movieTags.note_id")           

        } else {
         notes = await knex("movieNotes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        }

        const userTags = await knex("movieTags").where({ user_id })
        const notesWhithTags = notes.map(note => {
          const noteTags = userTags.filter(tag => tag.note_id === note.id)
    
          return {
            ...note,
            tags: noteTags
          }
        })

        return response.json(notesWhithTags)
      }

    async update (request, response) {
        const { name, email, password, avatar} = request.body
        const { id } =  request.params
        
        await knex("movieNotes").update({name, email, password, avatar}).where({id})

        response.json()
    }

    async delete (request, response) {
        const { id } =  request.params

        await knex("movieNotes").delete().where({id})

        response.json()
    }
}

module.exports = MovieNotesController