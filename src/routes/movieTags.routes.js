const { Router } =  require("express") // Importa o Router do Express

const MovieTagsController = require("../controllers/MovieTagsController") // Importa a Classe

const movieTagsController = new MovieTagsController() // Instancia a classe

const movieTagsRoutes = Router()

movieTagsRoutes.get("/:user_id", movieTagsController.index)


module.exports = movieTagsRoutes