import { Router } from "express";
import { verifyToken } from "../utils/token.util.js";
import usersManager from "../data/mongo/managers/UsersManager.mongo.js";

class CustomRouter {
  //para construir y configurar cada instancia del enrutador
  constructor() {
    this.router = Router();
    this.init();
  }
  //para obtener todas las rutas del enrutador definido
  getRouter() {
    return this.router;
  }
  //para inicializar las clases/propiedades heredades (sub-routers)
  init() {}
  //para manejar las callbacks (de middlewares y la final)
  applyCbs(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        return params[2](error);
      }
    });
  }
  response = (req, res, next) => {
    res.message200 = (message) => res.json({ statusCode: 200, message });
    res.response200 = (response) => res.json({ statusCode: 200, response });
    res.paginate = (response, info) =>
      res.json({ statusCode: 200, response, info });
    res.message201 = (message) => res.json({ statusCode: 201, message });
    res.response201 = (message, response) => res.json({ statusCode: 201, message, response });
    res.error400 = (message) => res.json({ statusCode: 400, message });
    res.error401 = () =>
      res.json({ statusCode: 401, message: "Bad auth from poliecies!" });
    res.error403 = () =>
      res.json({ statusCode: 403, message: "Forbidden from poliecies!" });
    res.error404 = () =>
      res.json({ statusCode: 404, message: "Not found docs" });
    return next();
  };
  policies = (policies) => async (req, res, next) => {
    try {
      if (policies.includes("PUBLIC")) return next();
      else {
        //console.log(req.cookies.token);
        let token = req.cookies.token;
        if (!token) return res.error401();
        else {
          token = verifyToken(token);
          const { role, email } = token;
          if (
            (policies.includes("USER") && role === 0) ||
            (policies.includes("ADMIN") && role === 1)
          ) {
            const user = await usersManager.readByEmail(email);
            delete user.password
            //proteger contraseña del usuario!!!
            req.user = user;
            return next();
          } else return res.error403();
        }
      }
    } catch (error) {
      console.log(error);
      return res.error400(error.message);
    }
  };
  //para definir un endpoint de tipo POST
  create(path, arrayOfPolicies, ...callbacks) {
    this.router.post(
      path,
      this.response,
      this.policies(arrayOfPolicies),
      this.applyCbs(callbacks)
    );
  }
  //para definir un endpoint de tipo GET
  read(path, arrayOfPolicies, ...callbacks) {
    this.router.get(
      path,
      this.response,
      this.policies(arrayOfPolicies),
      this.applyCbs(callbacks)
    );
  }
  //para definir un endpoint de tipo PUT
  update(path, arrayOfPolicies, ...callbacks) {
    this.router.put(
      path,
      this.response,
      this.policies(arrayOfPolicies),
      this.applyCbs(callbacks)
    );
  }
  //para definir un endpoint de tipo DELETE
  destroy(path, arrayOfPolicies, ...callbacks) {
    this.router.delete(
      path,
      this.response,
      this.policies(arrayOfPolicies),
      this.applyCbs(callbacks)
    );
  }
  //para enrutar o implementar middlewares
  use(path, ...callbacks) {
    this.router.use(path, this.response, this.applyCbs(callbacks));
  }
}

export default CustomRouter;
