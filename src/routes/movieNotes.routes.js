const { Router } =  require("express") // Importa o Router do Express

const MovieNotesController = require("../controllers/MovieNotesController") // Importa a Classe

const movieNotesController = new MovieNotesController() // Instancia a classe

const movieNotesRoutes = Router()

movieNotesRoutes.get("/", movieNotesController.index)
movieNotesRoutes.post("/:user_id", movieNotesController.create)
movieNotesRoutes.delete("/:id", movieNotesController.delete)
movieNotesRoutes.get("/:id", movieNotesController.show)

module.exports = movieNotesRoutes

